import chalk from 'chalk';
import Table from 'cli-table3';
import { configStore } from '../config/store';
import { logger } from '../utils/logger';
import { ListCommandOptions } from '../types/command';

export function listCommand(options: ListCommandOptions): void {
  try {
    const providers = configStore.getProviders();
    const currentProviderId = configStore.getCurrentProvider();

    if (options.json) {
      // Don't expose tokens in JSON output for security
      const safeProviders = Object.entries(providers).reduce((acc, [id, provider]) => {
        acc[id] = {
          ...provider,
          authToken: provider.authToken ? '***' : undefined,
          hasToken: configStore.hasProviderToken(id),
        };
        return acc;
      }, {} as any);
      console.log(JSON.stringify(safeProviders, null, 2));
      return;
    }

    const table = new Table({
      head: [
        chalk.bold('ID'),
        chalk.bold('Name'),
        chalk.bold('Description'),
        chalk.bold('Token'),
        chalk.bold('Status'),
      ],
      colWidths: [15, 18, 35, 18, 12],
      wordWrap: true,
    });

    Object.entries(providers).forEach(([id, provider]) => {
      const isCurrent = id === currentProviderId;
      const hasToken = configStore.hasProviderToken(id);
      
      // Token status
      const tokenStatus = hasToken 
        ? chalk.green('✓ Configured')
        : chalk.red('✗ Not configured');
      
      // Current status
      const status = isCurrent ? chalk.green('✓ Active') : '';
      
      // ID display
      const idDisplay = isCurrent ? chalk.green.bold(id) : id;

      table.push([
        idDisplay,
        provider.name,
        provider.description,
        tokenStatus,
        status,
      ]);
    });

    logger.log('\n' + table.toString());

    if (!currentProviderId) {
      logger.blank();
      logger.info('No provider is currently active.');
    }
    
    // Show hints for unconfigured providers
    const unconfiguredProviders = Object.entries(providers)
      .filter(([id]) => !configStore.hasProviderToken(id))
      .map(([id]) => id);
    
    if (unconfiguredProviders.length > 0) {
      logger.blank();
      logger.warning(`Providers without tokens: ${unconfiguredProviders.join(', ')}`);
      logger.info(`Add token: ${logger.command(`claude-provider add <provider-id> --token "your-token"`)}`);
    }

    logger.blank();
  } catch (error) {
    logger.error(error as Error);
    process.exit(1);
  }
}

