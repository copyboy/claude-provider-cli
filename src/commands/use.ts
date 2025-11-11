import chalk from 'chalk';
import { configStore } from '../config/store';
import { envManager } from '../env/manager';
import { shellIntegration } from '../env/shell';
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

    // 🆕 Check if token is configured
    if (!configStore.hasProviderToken(providerId)) {
      logger.error(`Provider '${provider.name}' does not have a token configured`);
      logger.blank();
      logger.info(`Please add token first:`);
      logger.info(`  ${logger.command(`claude-provider add ${providerId} --token "your-api-token"`)}`);
      logger.blank();
      process.exit(1);
    }

    // 🆕 Prepare all environment variables (including token)
    const envVars: Record<string, string> = {
      ...provider.envVars,
      ANTHROPIC_AUTH_TOKEN: provider.authToken!, // Token is guaranteed to exist from check above
    };

    // If temporary switch, only set current session
    if (options.temp) {
      envManager.setProviderEnv(provider);
      
      logger.success(`Temporarily switched to ${chalk.bold(provider.name)}`);
      logger.warning('This is a temporary switch (current session only)');
      logger.blank();
      logger.info('Environment variables have been set for this session');
      logger.info('Changes will NOT persist to new terminals');
      logger.blank();
      return;
    }

    // 🆕 Persistent switch: Write to Shell RC file
    try {
      shellIntegration.writeEnvVars(envVars);
      
      // Update current provider in config
      configStore.setCurrentProvider(providerId);
      
      // Also set for current session
      envManager.setProviderEnv(provider);
      
      // Success message
      logger.success(`Switched to ${chalk.bold(provider.name)} ✓`);
      logger.blank();
      
      // Show RC file path
      const rcPath = shellIntegration.getShellRcPath();
      const shell = shellIntegration.detectShell();
      logger.info(`Updated ${chalk.cyan(rcPath)} (${shell})`);
      logger.blank();
      
      // Instructions to apply
      logger.log(chalk.bold('To apply changes:'));
      logger.log(`  ${chalk.green('Option 1:')} ${chalk.cyan(shellIntegration.getApplyInstructions())}`);
      logger.log(`  ${chalk.green('Option 2:')} Open a new terminal window`);
      logger.blank();
      
      // Show configured environment variables (without exposing full token)
      logger.log(chalk.dim('Configured environment variables:'));
      Object.entries(envVars).forEach(([key, value]) => {
        if (key === 'ANTHROPIC_AUTH_TOKEN') {
          // Mask token for security
          const maskedToken = value.substring(0, 10) + '***';
          logger.log(chalk.dim(`  ${key}=${maskedToken}`));
        } else {
          logger.log(chalk.dim(`  ${key}=${value}`));
        }
      });
      logger.blank();
      
    } catch (error) {
      logger.error('Failed to write to Shell RC file');
      logger.error(error as Error);
      logger.blank();
      logger.warning('Falling back to temporary switch (current session only)');
      
      // Fallback: Set only for current session
      envManager.setProviderEnv(provider);
      
      logger.blank();
      logger.info('Manual setup instructions:');
      const instructions = envManager.getManualInstructions(provider);
      logger.log(chalk.dim(instructions));
      logger.blank();
      
      process.exit(1);
    }
    
  } catch (error) {
    logger.error(error as Error);
    process.exit(1);
  }
}

