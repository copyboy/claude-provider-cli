/**
 * Command type definitions
 */

export interface CommandOptions {
  [key: string]: any;
}

export interface ListCommandOptions {
  json?: boolean;
}

export interface UseCommandOptions {
  temp?: boolean;
}

export interface AddCommandOptions {
  name?: string;
  url?: string;
  token?: string;
  interactive?: boolean;
}

export interface StatusCommandOptions {
  verbose?: boolean;
}

