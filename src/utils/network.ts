import axios, { AxiosError } from 'axios';
import { Provider, ProviderStatus } from '../types/provider';

export class NetworkUtils {
  /**
   * Test provider connection
   */
  async testConnection(provider: Provider): Promise<ProviderStatus> {
    const startTime = Date.now();

    try {
      const endpoint = provider.testEndpoint || provider.baseUrl;
      const response = await axios.head(endpoint, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status
      });

      const responseTime = Date.now() - startTime;

      return {
        provider,
        connected: response.status < 500,
        responseTime,
      };
    } catch (error) {
      const err = error as AxiosError;
      return {
        provider,
        connected: false,
        error: err.message,
      };
    }
  }

  /**
   * Check internet connectivity
   */
  async isOnline(): Promise<boolean> {
    try {
      await axios.head('https://www.google.com', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

export const networkUtils = new NetworkUtils();

