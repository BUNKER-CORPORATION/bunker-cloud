import { Client } from 'minio';
import { config } from '../config.js';
import { logger } from './logger.js';
import crypto from 'crypto';
import { Readable } from 'stream';

const minioClient = new Client({
  endPoint: config.minio.endpoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

// Ensure registry bucket exists
export async function ensureBucket(): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(config.minio.bucket);
    if (!exists) {
      await minioClient.makeBucket(config.minio.bucket);
      logger.info(`Created registry bucket: ${config.minio.bucket}`);
    }
  } catch (error) {
    logger.error('Error ensuring bucket exists:', error);
    throw error;
  }
}

// Generate blob path
function getBlobPath(digest: string): string {
  // Store blobs by their sha256 digest
  // Format: blobs/sha256/ab/cdef.../data
  const hash = digest.replace('sha256:', '');
  return `blobs/sha256/${hash.substring(0, 2)}/${hash}/data`;
}

// Generate manifest path
function getManifestPath(repository: string, reference: string): string {
  // Store manifests by repository and tag/digest
  return `manifests/${repository}/${reference}`;
}

// Upload blob
export async function uploadBlob(
  digest: string,
  data: Buffer | Readable,
  size: number
): Promise<void> {
  const path = getBlobPath(digest);
  await minioClient.putObject(config.minio.bucket, path, data, size, {
    'Content-Type': 'application/octet-stream',
  });
}

// Check if blob exists
export async function blobExists(digest: string): Promise<boolean> {
  const path = getBlobPath(digest);
  try {
    await minioClient.statObject(config.minio.bucket, path);
    return true;
  } catch {
    return false;
  }
}

// Get blob
export async function getBlob(digest: string): Promise<NodeJS.ReadableStream> {
  const path = getBlobPath(digest);
  return await minioClient.getObject(config.minio.bucket, path);
}

// Get blob size
export async function getBlobSize(digest: string): Promise<number> {
  const path = getBlobPath(digest);
  const stat = await minioClient.statObject(config.minio.bucket, path);
  return stat.size;
}

// Delete blob
export async function deleteBlob(digest: string): Promise<void> {
  const path = getBlobPath(digest);
  await minioClient.removeObject(config.minio.bucket, path);
}

// Upload manifest
export async function uploadManifest(
  repository: string,
  reference: string,
  manifest: string,
  contentType: string
): Promise<string> {
  const path = getManifestPath(repository, reference);
  const digest = 'sha256:' + crypto.createHash('sha256').update(manifest).digest('hex');

  await minioClient.putObject(
    config.minio.bucket,
    path,
    Buffer.from(manifest),
    manifest.length,
    {
      'Content-Type': contentType,
      'Docker-Content-Digest': digest,
    }
  );

  return digest;
}

// Get manifest
export async function getManifest(
  repository: string,
  reference: string
): Promise<{ data: string; contentType: string; digest: string } | null> {
  const path = getManifestPath(repository, reference);
  try {
    const stat = await minioClient.statObject(config.minio.bucket, path);
    const stream = await minioClient.getObject(config.minio.bucket, path);

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    const data = Buffer.concat(chunks).toString('utf-8');

    return {
      data,
      contentType: stat.metaData['content-type'] || 'application/vnd.docker.distribution.manifest.v2+json',
      digest: stat.metaData['docker-content-digest'] || '',
    };
  } catch {
    return null;
  }
}

// Delete manifest
export async function deleteManifest(repository: string, reference: string): Promise<void> {
  const path = getManifestPath(repository, reference);
  await minioClient.removeObject(config.minio.bucket, path);
}

// List all objects in a repository (for cleanup)
export async function listRepositoryObjects(repository: string): Promise<string[]> {
  const objects: string[] = [];
  const stream = minioClient.listObjects(config.minio.bucket, `manifests/${repository}/`, true);

  for await (const obj of stream) {
    objects.push(obj.name);
  }

  return objects;
}

// Get total storage used by a user
export async function getUserStorageUsed(repositories: string[]): Promise<number> {
  let totalSize = 0;

  for (const repo of repositories) {
    const stream = minioClient.listObjects(config.minio.bucket, `manifests/${repo}/`, true);
    for await (const obj of stream) {
      totalSize += obj.size;
    }
  }

  return totalSize;
}

// Generate presigned URL for blob upload
export async function getUploadUrl(digest: string, expirySeconds = 3600): Promise<string> {
  const path = getBlobPath(digest);
  return await minioClient.presignedPutObject(config.minio.bucket, path, expirySeconds);
}

// Generate presigned URL for blob download
export async function getDownloadUrl(digest: string, expirySeconds = 3600): Promise<string> {
  const path = getBlobPath(digest);
  return await minioClient.presignedGetObject(config.minio.bucket, path, expirySeconds);
}
