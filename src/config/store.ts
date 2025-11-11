import Conf from 'conf';
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

    // Migrate if needed
    this.migrate();
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

