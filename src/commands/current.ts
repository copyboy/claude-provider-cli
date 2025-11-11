import chalk from 'chalk';
import boxen from 'boxen';
import { configStore } from '../config/store';
import { logger } from '../utils/logger';

export function currentCommand(): void {
  try {
    const currentProviderId = configStore.getCurrentProvider();

    if (!currentProviderId) {
      logger.warning('No provider is currently active');
      logger.blank();
      logger.info('Use "claude-provider use <id>" to select a provider');
      logger.info('Run "claude-provider list" to see available providers');
      return;
    }

    const provider = configStore.getProvider(currentProviderId);
    if (!provider) {
      logger.error('Current provider not found in configuration');
      return;
    }

    const info = [
      `${chalk.bold('Provider:')} ${provider.name}`,
      `${chalk.bold('ID:')} ${currentProviderId}`,
      `${chalk.bold('Description:')} ${provider.description}`,
      `${chalk.bold('Base URL:')} ${provider.baseUrl}`,
      `${chalk.bold('Type:')} ${provider.builtIn ? 'Built-in' : 'Custom'}`,
    ].join('\n');

    const box = boxen(info, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      title: '✓ Active Provider',
      titleAlignment: 'center',
    });

    console.log(box);

    // Show environment variables
    logger.log(chalk.bold('Environment Variables:'));
    Object.entries(provider.envVars).forEach(([key, value]) => {
      logger.log(`  ${chalk.cyan(key)}: ${chalk.dim(value)}`);
    });

    if (provider.authToken) {
      logger.log(`  ${chalk.cyan('ANTHROPIC_AUTH_TOKEN')}: ${chalk.dim('(configured)')}`);
    }

    logger.blank();
  } catch (error) {
    logger.error(error as Error);
    process.exit(1);
  }
}

