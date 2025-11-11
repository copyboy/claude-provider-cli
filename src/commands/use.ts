import chalk from 'chalk';
import { configStore } from '../config/store';
import { envManager } from '../env/manager';
import { logger } from '../utils/logger';
import { createError } from '../utils/error';
import { UseCommandOptions } from '../types/command';

export function useCommand(providerId: string, options: UseCommandOptions): void {
  try {
    // Get provider
    const provider = configStore.getProvider(providerId);
    if (!provider) {
      throw createError(
        `Provider "${providerId}" not found`,
        'Run "claude-provider list" to see available providers'
      );
    }

    // Clear previous environment
    const currentProviderId = configStore.getCurrentProvider();
    if (currentProviderId) {
      const currentProvider = configStore.getProvider(currentProviderId);
      if (currentProvider) {
        envManager.clearProviderEnv(currentProvider);
      }
    }

    // Set new environment
    envManager.setProviderEnv(provider);

    // Update current provider (unless temporary)
    if (!options.temp) {
      configStore.setCurrentProvider(providerId);
    }

    // Success message
    logger.success(`Switched to ${chalk.bold(provider.name)}`);
    logger.blank();
    logger.info('Environment variables have been set for the current session');

    if (options.temp) {
      logger.warning('This is a temporary switch (session only)');
    }

    logger.blank();
    logger.log('To apply in your shell, run:');
    logger.log(chalk.cyan('  source ~/.zshrc'));
    logger.log(chalk.gray('  (or restart your terminal)'));
    logger.blank();

    // Show manual instructions if needed
    const instructions = envManager.getManualInstructions(provider);
    logger.log(chalk.dim('Manual setup (if needed):'));
    logger.log(chalk.dim(instructions));
    logger.blank();
  } catch (error) {
    logger.error(error as Error);
    process.exit(1);
  }
}

