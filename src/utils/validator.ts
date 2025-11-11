import { AddProviderOptions } from '../types/provider';

export class Validator {
  /**
   * Validate provider ID format
   */
  isValidProviderId(id: string): boolean {
    return /^[a-z0-9-_]+$/.test(id);
  }

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  /**
   * Validate provider name
   */
  isValidProviderName(name: string): boolean {
    return name.length > 0 && name.length <= 50;
  }

  /**
   * Validate API token format
   */
  isValidToken(token: string): boolean {
    return token.length >= 10 && token.length <= 500;
  }

  /**
   * Validate add provider options
   */
  validateAddProviderOptions(options: AddProviderOptions): string[] {
    const errors: string[] = [];

    if (!options.name) {
      errors.push('Provider name is required');
    } else if (!this.isValidProviderName(options.name)) {
      errors.push('Provider name must be 1-50 characters');
    }

    if (!options.url) {
      errors.push('Provider URL is required');
    } else if (!this.isValidUrl(options.url)) {
      errors.push('Invalid URL format');
    }

    return errors;
  }

  /**
   * Sanitize provider ID from name
   */
  sanitizeProviderId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

export const validator = new Validator();

