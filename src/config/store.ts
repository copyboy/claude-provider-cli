import Conf from 'conf';
import * as fs from 'fs';
import * as path from 'path';
import { Provider } from '../types/provider';
import { Config, UserPreferences } from '../types/config';
import { DEFAULT_PROVIDERS } from '../providers';

const CONFIG_VERSION = '1.0.0';

const defaultPreferences: UserPreferences = {
  shellIntegration: false,
  autoUpdate: true,
};

export class ConfigStore {
  private store: Conf<Config>;

  constructor() {
    this.store = new Conf<Config>({
      projectName: 'claude-provider-cli',
      defaults: {
        version: CONFIG_VERSION,
        currentProvider: null,
        providers: DEFAULT_PROVIDERS,
        preferences: defaultPreferences,
      },
    });

    // Secure the config file (chmod 600)
    this.secureConfigFile();

    // Migrate if needed
    this.migrate();
  }

  /**
   * Secure config file with chmod 600 (owner read/write only)
   * 🆕 NEW: Protect tokens from unauthorized access
   */
  private secureConfigFile(): void {
    try {
      const configPath = this.store.path;
      if (fs.existsSync(configPath)) {
        fs.chmodSync(configPath, 0o600);
      }
    } catch (error) {
      // On Windows, chmod may not work as expected, silently ignore
      if (process.platform !== 'win32') {
        console.warn('Warning: Could not secure config file permissions');
      }
    }
  }

  /**
   * Get current provider ID
   */
  getCurrentProvider(): string | null {
    return this.store.get('currentProvider');
  }

  /**
   * Set current provider
   */
  setCurrentProvider(providerId: string | null): void {
    this.store.set('currentProvider', providerId);
  }

  /**
   * Get all providers
   */
  getProviders(): Record<string, Provider> {
    return this.store.get('providers') || {};
  }

  /**
   * Get single provider
   */
  getProvider(id: string): Provider | undefined {
    const providers = this.getProviders();
    return providers[id];
  }

  /**
   * Set provider
   */
  setProvider(id: string, provider: Provider): void {
    const providers = this.getProviders();
    providers[id] = provider;
    this.store.set('providers', providers);
    
    // Ensure config file is secured after adding/updating provider
    this.secureConfigFile();
  }

  /**
   * Add or update token for a provider
   * 🆕 NEW: Securely store API token
   */
  addProviderToken(providerId: string, token: string): void {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Provider '${providerId}' not found`);
    }

    provider.authToken = token;
    this.setProvider(providerId, provider);
  }

  /**
   * Get token for a provider
   * 🆕 NEW: Retrieve stored token
   */
  getProviderToken(providerId: string): string | undefined {
    const provider = this.getProvider(providerId);
    return provider?.authToken;
  }

  /**
   * Check if provider has token configured
   * 🆕 NEW: Check token status
   */
  hasProviderToken(providerId: string): boolean {
    const token = this.getProviderToken(providerId);
    return token !== undefined && token !== null && token.length > 0;
  }

  /**
   * Remove token from provider
   * 🆕 NEW: Remove token without deleting provider
   */
  removeProviderToken(providerId: string): void {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error(`Provider '${providerId}' not found`);
    }

    delete provider.authToken;
    this.setProvider(providerId, provider);
  }

  /**
   * Remove provider
   */
  removeProvider(id: string): boolean {
    const providers = this.getProviders();
    if (!providers[id]) {
      return false;
    }
    delete providers[id];
    this.store.set('providers', providers);

    // Clear current provider if it was the removed one
    if (this.getCurrentProvider() === id) {
      this.setCurrentProvider(null);
    }

    return true;
  }

  /**
   * Get user preferences
   */
  getPreferences(): UserPreferences {
    return this.store.get('preferences') || defaultPreferences;
  }

  /**
   * Set user preference
   */
  setPreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void {
    const prefs = this.getPreferences();
    prefs[key] = value;
    this.store.set('preferences', prefs);
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.store.clear();
    this.store.set('version', CONFIG_VERSION);
    this.store.set('providers', DEFAULT_PROVIDERS);
    this.store.set('preferences', defaultPreferences);
    this.store.set('currentProvider', null);
  }

  /**
   * Export configuration
   */
  export(): string {
    return JSON.stringify(
      {
        version: CONFIG_VERSION,
        providers: this.getProviders(),
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  /**
   * Import configuration
   */
  import(data: string, merge: boolean = false): void {
    const imported = JSON.parse(data);

    if (!imported.providers) {
      throw new Error('Invalid configuration file: missing providers');
    }

    if (merge) {
      const existingProviders = this.getProviders();
      const mergedProviders = { ...existingProviders, ...imported.providers };
      this.store.set('providers', mergedProviders);
    } else {
      this.store.set('providers', imported.providers);
    }
  }

  /**
   * Get config file path
   */
  getPath(): string {
    return this.store.path;
  }

  /**
   * Migrate old configs
   */
  private migrate(): void {
    const version = this.store.get('version');
    if (version !== CONFIG_VERSION) {
      // Add migration logic here when needed
      this.store.set('version', CONFIG_VERSION);
    }
  }
}

// Singleton instance
export const configStore = new ConfigStore();

