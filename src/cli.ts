#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { listCommand } from './commands/list';
import { useCommand } from './commands/use';
import { currentCommand } from './commands/current';
import { statusCommand } from './commands/status';
import { handleError } from './utils/error';

const program = new Command();

program
  .name('claude-provider')
  .description('Complete solution for managing Claude Code API providers')
  .version('0.1.0');

// List command
program
  .command('list')
  .alias('ls')
  .description('List all available providers')
  .option('-j, --json', 'Output as JSON')
  .action((options) => {
    try {
      listCommand(options);
    } catch (error) {
      handleError(error);
    }
  });

// Use command
program
  .command('use <provider>')
  .description('Switch to a provider')
  .option('-t, --temp', 'Temporary switch (session only)')
  .action((provider, options) => {
    try {
      useCommand(provider, options);
    } catch (error) {
      handleError(error);
    }
  });

// Current command
program
  .command('current')
  .description('Show current active provider')
  .action(() => {
    try {
      currentCommand();
    } catch (error) {
      handleError(error);
    }
  });

// Status command
program
  .command('status')
  .description('Check connection status of current provider')
  .option('-v, --verbose', 'Show detailed information')
  .action(async (options) => {
    try {
      await statusCommand(options);
    } catch (error) {
      handleError(error);
    }
  });

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);

