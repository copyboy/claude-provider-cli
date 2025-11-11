import chalk from 'chalk';

export enum LogLevel {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export class Logger {
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  warning(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  error(message: string | Error): void {
    const msg = message instanceof Error ? message.message : message;
    console.error(chalk.red('✗'), msg);
  }

  log(message: string): void {
    console.log(message);
  }

  blank(): void {
    console.log();
  }

  /**
   * Format command for display
   * 🆕 NEW: Highlight commands in output
   */
  command(cmd: string): string {
    return chalk.cyan.bold(cmd);
  }
}

export const logger = new Logger();

