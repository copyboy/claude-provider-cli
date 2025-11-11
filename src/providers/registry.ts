import { Provider } from '../types/provider';

export class ProviderRegistry {
  private providers: Map<string, Provider>;

  constructor(providers: Record<string, Provider> = {}) {
    this.providers = new Map(Object.entries(providers));
  }

  /**
   * Get all providers
   */
  getAll(): Provider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get provider by ID
   */
  get(id: string): Provider | undefined {
    return this.providers.get(id);
  }

  /**
   * Add or update provider
   */
  set(id: string, provider: Provider): void {
    this.providers.set(id, provider);
  }

  /**
   * Remove provider
   */
  remove(id: string): boolean {
    return this.providers.delete(id);
  }

  /**
   * Check if provider exists
   */
  has(id: string): boolean {
    return this.providers.has(id);
  }

  /**
   * Get built-in providers
   */
  getBuiltIn(): Provider[] {
    return this.getAll().filter((p) => p.builtIn);
  }

  /**
   * Get custom providers
   */
  getCustom(): Provider[] {
    return this.getAll().filter((p) => !p.builtIn);
  }

  /**
   * Convert to plain object
   */
  toObject(): Record<string, Provider> {
    const obj: Record<string, Provider> = {};
    this.providers.forEach((provider, id) => {
      obj[id] = provider;
    });
    return obj;
  }
}

