import { Provider } from '../types/provider';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

export class EnvManager {
  /**
   * Set environment variables for provider
   */
  setProviderEnv(provider: Provider): void {
    // Set auth token if provided
    if (provider.authToken) {
      process.env.ANTHROPIC_AUTH_TOKEN = provider.authToken;
    }

    // Set all provider-specific env vars
    Object.entries(provider.envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
  }

  /**
   * Clear previous provider's environment variables
   */
  clearProviderEnv(provider?: Provider): void {
    // Clear common Anthropic env vars
    delete process.env.ANTHROPIC_BASE_URL;
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    delete process.env.ANTHROPIC_MODEL;
    delete process.env.ANTHROPIC_SMALL_FAST_MODEL;
    delete process.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    delete process.env.ANTHROPIC_DEFAULT_OPUS_MODEL;
    delete process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    delete process.env.API_TIMEOUT_MS;
    delete process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC;

    // If specific provider, clear its custom env vars
    if (provider) {
      Object.keys(provider.envVars).forEach((key) => {
        delete process.env[key];
      });
    }
  }

  /**
   * Get shell RC file path
   */
  getShellRcPath(): string | null {
    const shell = process.env.SHELL || '';
    const home = os.homedir();

    if (shell.includes('zsh')) {
      return path.join(home, '.zshrc');
    } else if (shell.includes('bash')) {
      const bashrc = path.join(home, '.bashrc');
      const bashProfile = path.join(home, '.bash_profile');
      return fs.existsSync(bashrc) ? bashrc : bashProfile;
    } else if (shell.includes('fish')) {
      return path.join(home, '.config', 'fish', 'config.fish');
    }

    // Default to .bashrc on Unix-like systems
    if (process.platform !== 'win32') {
      return path.join(home, '.bashrc');
    }

    return null;
  }

  /**
   * Generate shell export commands
   */
  generateExportScript(provider: Provider): string[] {
    const commands: string[] = [];

    // Add auth token if present
    if (provider.authToken) {
      commands.push(`export ANTHROPIC_AUTH_TOKEN="${provider.authToken}"`);
    }

    // Add all env vars
    Object.entries(provider.envVars).forEach(([key, value]) => {
      commands.push(`export ${key}="${value}"`);
    });

    return commands;
  }

  /**
   * Write env vars to shell RC file (for shell integration)
   */
  writeToShellRc(provider: Provider): void {
    const rcPath = this.getShellRcPath();
    if (!rcPath) {
      throw new Error('Could not determine shell RC file');
    }

    const marker = '# claude-provider-cli managed';
    const script = this.generateExportScript(provider);

    let content = '';
    if (fs.existsSync(rcPath)) {
      content = fs.readFileSync(rcPath, 'utf-8');

      // Remove previous claude-provider-cli section
      const lines = content.split('\n');
      const filtered = [];
      let inManagedSection = false;

      for (const line of lines) {
        if (line.includes(marker)) {
          inManagedSection = true;
          continue;
        }
        if (inManagedSection && line.trim() === '') {
          inManagedSection = false;
          continue;
        }
        if (!inManagedSection) {
          filtered.push(line);
        }
      }

      content = filtered.join('\n');
    }

    // Append new section
    const newSection = [
      '',
      marker,
      ...script,
      '',
    ].join('\n');

    fs.writeFileSync(rcPath, content + newSection, 'utf-8');
  }

  /**
   * Detect current shell
   */
  detectShell(): string {
    const shell = process.env.SHELL || '';
    if (shell.includes('zsh')) return 'zsh';
    if (shell.includes('bash')) return 'bash';
    if (shell.includes('fish')) return 'fish';
    if (process.platform === 'win32') return 'powershell';
    return 'unknown';
  }

  /**
   * Check if platform is Windows
   */
  isWindows(): boolean {
    return process.platform === 'win32';
  }

  /**
   * Get environment variable instructions for manual setup
   */
  getManualInstructions(provider: Provider): string {
    const shell = this.detectShell();
    const script = this.generateExportScript(provider);

    let instructions = 'Set these environment variables:\n\n';

    if (shell === 'powershell') {
      instructions += script.map(cmd => cmd.replace('export ', '$env:')).join('\n');
    } else {
      instructions += script.join('\n');
    }

    return instructions;
  }
}

export const envManager = new EnvManager();

