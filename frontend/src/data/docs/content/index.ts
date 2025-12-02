// Documentation Content Index
// Combines all documentation pages into a single record

import { DocPage } from '../types';
import { gettingStartedDocs } from './getting-started';
import { computeDocs } from './compute';
import { storageDocs } from './storage';
import { databasesDocs } from './databases';
import { networkingDocs } from './networking';
import { securityDocs } from './security';
import { devopsDocs } from './devops';
import { monitoringDocs } from './monitoring';
import { apiReferenceDocs } from './api-reference';
import { cliDocs } from './cli';
import { billingDocs } from './billing';

// Combine all documentation into a single record
export const allDocs: Record<string, DocPage> = {
  ...gettingStartedDocs,
  ...computeDocs,
  ...storageDocs,
  ...databasesDocs,
  ...networkingDocs,
  ...securityDocs,
  ...devopsDocs,
  ...monitoringDocs,
  ...apiReferenceDocs,
  ...cliDocs,
  ...billingDocs,
};

// Helper function to get a doc by ID
export function getDocById(id: string): DocPage | undefined {
  return allDocs[id];
}

// Helper function to check if a doc exists
export function docExists(id: string): boolean {
  return id in allDocs;
}

// Re-export individual section docs for specific imports
export {
  gettingStartedDocs,
  computeDocs,
  storageDocs,
  databasesDocs,
  networkingDocs,
  securityDocs,
  devopsDocs,
  monitoringDocs,
  apiReferenceDocs,
  cliDocs,
  billingDocs,
};
