import ora from 'ora';
import chalk from 'chalk';
import { configStore } from '../config/store';
import { networkUtils } from '../utils/network';
import { logger } from '../utils/logger';
import { StatusCommandOptions } from '../types/command';

export async function statusCommand(options: StatusCommandOptions): Promise<void> {
  try {
    const currentProviderId = configStore.getCurrentProvider();

    if (!currentProviderId) {
      logger.warning('No provider is currently active');
      logger.info('Use "claude-provider use <id>" to select a provider');
      return;
    }

    const provider = configStore.getProvider(currentProviderId);
    if (!provider) {
      logger.error('Current provider not found in configuration');
      return;
    }

    logger.blank();
    logger.log(chalk.bold(`Testing connection to ${provider.name}...`));
    logger.blank();

    const spinner = ora('Checking connection...').start();

    // Test connection
    const status = await networkUtils.testConnection(provider);

    spinner.stop();

    if (status.connected) {
      logger.success(`Connected to ${provider.name}`);
      logger.log(`  ${chalk.dim('Response time:')} ${status.responseTime}ms`);
    } else {
      logger.error(`Cannot connect to ${provider.name}`);
      if (status.error) {
        logger.log(`  ${chalk.dim('Error:')} ${status.error}`);
      }
    }

    if (options.verbose) {
      logger.blank();
      logger.log(chalk.bold('Provider Details:'));
      logger.log(`  ${chalk.dim('Base URL:')} ${provider.baseUrl}`);
      logger.log(`  ${chalk.dim('Test Endpoint:')} ${provider.testEndpoint || provider.baseUrl}`);
    }

    logger.blank();
  } catch (error) {
    logger.error(error as Error);
    process.exit(1);
  }
}

