import * as Minio from 'minio';
import { Readable } from 'stream';
import { config } from '../config.js';

export const minioClient = new Minio.Client({
  endPoint: config.minio.endpoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

// Object info interface
interface ObjectInfo {
  name: string;
  size: number;
  etag?: string;
  lastModified?: Date;
  prefix?: string;
}

// Generate a unique bucket name for a user
export function generateBucketName(userId: string, name: string): string {
  // Bucket names must be lowercase, 3-63 chars, no underscores
  const sanitized = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 40);
  const userPrefix = userId.substring(0, 8).toLowerCase();
  return `${userPrefix}-${sanitized}`;
}

// Check if bucket exists
export async function bucketExists(bucketName: string): Promise<boolean> {
  try {
    return await minioClient.bucketExists(bucketName);
  } catch (error) {
    return false;
  }
}

// Create a new bucket
export async function createBucket(bucketName: string): Promise<void> {
  await minioClient.makeBucket(bucketName, 'us-east-1');
}

// Delete a bucket (must be empty)
export async function deleteBucket(bucketName: string): Promise<void> {
  await minioClient.removeBucket(bucketName);
}

// List objects in a bucket
export async function listObjects(
  bucketName: string,
  prefix: string = '',
  recursive: boolean = false
): Promise<ObjectInfo[]> {
  return new Promise((resolve, reject) => {
    const objects: ObjectInfo[] = [];
    const stream = minioClient.listObjects(bucketName, prefix, recursive);

    stream.on('data', (obj: any) => objects.push({
      name: obj.name || '',
      size: obj.size || 0,
      etag: obj.etag,
      lastModified: obj.lastModified,
      prefix: obj.prefix,
    }));
    stream.on('error', reject);
    stream.on('end', () => resolve(objects));
  });
}

// Get object metadata
export async function getObjectStat(bucketName: string, objectName: string): Promise<any> {
  return await minioClient.statObject(bucketName, objectName);
}

// Upload object from stream
export async function putObject(
  bucketName: string,
  objectName: string,
  stream: Readable | Buffer | string,
  size: number,
  contentType: string
): Promise<any> {
  return await minioClient.putObject(bucketName, objectName, stream as any, size, {
    'Content-Type': contentType,
  });
}

// Download object as stream
export async function getObject(bucketName: string, objectName: string): Promise<NodeJS.ReadableStream> {
  return await minioClient.getObject(bucketName, objectName);
}

// Delete object
export async function deleteObject(bucketName: string, objectName: string): Promise<void> {
  await minioClient.removeObject(bucketName, objectName);
}

// Delete multiple objects
export async function deleteObjects(bucketName: string, objectNames: string[]): Promise<void> {
  await minioClient.removeObjects(bucketName, objectNames);
}

// Generate presigned URL for download
export async function getPresignedDownloadUrl(
  bucketName: string,
  objectName: string,
  expiry: number = config.presignedUrlExpiry
): Promise<string> {
  return await minioClient.presignedGetObject(bucketName, objectName, expiry);
}

// Generate presigned URL for upload
export async function getPresignedUploadUrl(
  bucketName: string,
  objectName: string,
  expiry: number = config.presignedUrlExpiry
): Promise<string> {
  return await minioClient.presignedPutObject(bucketName, objectName, expiry);
}

// Get bucket size (total size of all objects)
export async function getBucketSize(bucketName: string): Promise<number> {
  const objects = await listObjects(bucketName, '', true);
  return objects.reduce((total, obj) => total + (obj.size || 0), 0);
}

// Copy object within or between buckets
export async function copyObject(
  sourceBucket: string,
  sourceObject: string,
  destBucket: string,
  destObject: string
): Promise<any> {
  const conds = new Minio.CopyConditions();
  return await minioClient.copyObject(destBucket, destObject, `/${sourceBucket}/${sourceObject}`, conds);
}

// Set bucket policy (public read, private, etc.)
export async function setBucketPolicy(bucketName: string, policy: 'private' | 'public-read'): Promise<void> {
  if (policy === 'public-read') {
    const publicPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
  } else {
    // Private - remove policy
    await minioClient.setBucketPolicy(bucketName, '');
  }
}

// Get bucket policy
export async function getBucketPolicy(bucketName: string): Promise<string> {
  try {
    return await minioClient.getBucketPolicy(bucketName);
  } catch (error: any) {
    if (error.code === 'NoSuchBucketPolicy') {
      return 'private';
    }
    throw error;
  }
}
