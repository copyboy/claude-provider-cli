/**
 * Provider type definitions
 */

export interface Provider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  authToken?: string;
  envVars: Record<string, string>;
  builtIn: boolean;
  testEndpoint?: string;
}

export interface ProviderConfig {
  providers: Record<string, Provider>;
  currentProvider: string | null;
  version: string;
}

export interface AddProviderOptions {
  name: string;
  url: string;
  token?: string;
  envVars?: Record<string, string>;
}

export interface ProviderStatus {
  provider: Provider;
  connected: boolean;
  responseTime?: number;
  error?: string;
}

