/**
 * Configuration type definitions
 */

export interface Config {
  version: string;
  currentProvider: string | null;
  providers: Record<string, any>;
  preferences: UserPreferences;
}

export interface UserPreferences {
  shellIntegration: boolean;
  autoUpdate: boolean;
  defaultProvider?: string;
}

export interface ExportConfig {
  version: string;
  providers: Record<string, any>;
  exportedAt: string;
}

