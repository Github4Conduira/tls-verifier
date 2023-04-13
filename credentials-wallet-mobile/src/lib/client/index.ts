import { ReclaimWalletBackendClient } from '@questbook/reclaim-client-sdk/';

let client: ReclaimWalletBackendClient | null = null;

export function getClient(privateKey: string, refresh: boolean = false) {
  if (!client || refresh) client = new ReclaimWalletBackendClient(privateKey);
  return client;
}

export function getNewClientInstance(privateKey: string) {
  const client = new ReclaimWalletBackendClient(privateKey);
  return client;
}
