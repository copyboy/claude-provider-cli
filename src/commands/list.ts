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
      console.log(JSON.stringify(providers, null, 2));
      return;
    }

    const table = new Table({
      head: [
        chalk.bold('ID'),
        chalk.bold('Name'),
        chalk.bold('Description'),
        chalk.bold('Status'),
      ],
      colWidths: [15, 20, 40, 10],
      wordWrap: true,
    });

    Object.entries(providers).forEach(([id, provider]) => {
      const isCurrent = id === currentProviderId;
      const status = isCurrent ? chalk.green('✓ Active') : '';
      const idDisplay = isCurrent ? chalk.green.bold(id) : id;

      table.push([
        idDisplay,
        provider.name,
        provider.description,
        status,
      ]);
    });

    logger.log('\n' + table.toString());

    if (!currentProviderId) {
      logger.blank();
      logger.info('No provider is currently active. Use "claude-provider use <id>" to select one.');
    }

    logger.blank();
  } catch (error) {
    logger.error(error as Error);
    process.exit(1);
  }
}

