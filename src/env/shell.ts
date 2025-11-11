import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Shell RC Integration
 * 🆕 NEW: Manages environment variables persistence in shell RC files
 * 
 * This class handles:
 * - Detection of user's shell type
 * - Finding appropriate RC file path
 * - Writing environment variables to RC files
 * - Managing configuration blocks for clean updates
 */
export class ShellIntegration {
  private readonly BLOCK_START = '# >>> claude-provider-cli init >>>';
  private readonly BLOCK_END = '# <<< claude-provider-cli init <<<';

  /**
   * Detect the current shell type
   */
  detectShell(): 'bash' | 'zsh' | 'fish' | 'powershell' | 'unknown' {
    const shell = process.env.SHELL || '';
    
    if (shell.includes('zsh')) return 'zsh';
    if (shell.includes('bash')) return 'bash';
    if (shell.includes('fish')) return 'fish';
    
    // Windows detection
    const platform = process.platform as string;
    if (platform === 'win32') {
      return 'powershell';
    }
    
    // Default to bash on Unix-like systems
    if (platform !== 'win32') {
      return 'bash';
    }
    
    return 'unknown';
  }

  /**
   * Get shell RC file path
   */
  getShellRcPath(shell?: 'bash' | 'zsh' | 'fish' | 'powershell'): string | null {
    const detectedShell = shell || this.detectShell();
    const home = os.homedir();
    const platform = process.platform as string;

    switch (detectedShell) {
      case 'zsh':
        return path.join(home, '.zshrc');
      
      case 'bash':
        // Prefer .bashrc, fallback to .bash_profile
        const bashrc = path.join(home, '.bashrc');
        const bashProfile = path.join(home, '.bash_profile');
        if (fs.existsSync(bashrc)) return bashrc;
        if (fs.existsSync(bashProfile)) return bashProfile;
        return bashrc; // Create .bashrc if neither exists
      
      case 'fish':
        const fishDir = path.join(home, '.config', 'fish');
        if (!fs.existsSync(fishDir)) {
          fs.mkdirSync(fishDir, { recursive: true });
        }
        return path.join(fishDir, 'config.fish');
      
      case 'powershell':
        return path.join(
          process.env.USERPROFILE || home,
          'Documents',
          'PowerShell',
          'Microsoft.PowerShell_profile.ps1'
        );
      
      default:
        return null;
    }
  }

  /**
   * Write environment variables to shell RC file
   * Replaces existing claude-provider block or creates new one
   */
  writeEnvVars(envVars: Record<string, string>): void {
    const shell = this.detectShell();
    const rcPath = this.getShellRcPath();

    if (!rcPath) {
      throw new Error(`Unsupported shell: ${shell}. Please set environment variables manually.`);
    }

    // Backup RC file if it exists
    if (fs.existsSync(rcPath)) {
      const backupPath = `${rcPath}.claude-provider-backup`;
      fs.copyFileSync(rcPath, backupPath);
    }

    // Read existing content
    let content = '';
    if (fs.existsSync(rcPath)) {
      content = fs.readFileSync(rcPath, 'utf-8');
    }

    // Generate new config block
    const newBlock = this.generateConfigBlock(envVars, shell);

    // Check if block already exists
    if (content.includes(this.BLOCK_START)) {
      // Replace existing block
      const regex = new RegExp(
        `${this.escapeRegex(this.BLOCK_START)}[\\s\\S]*?${this.escapeRegex(this.BLOCK_END)}`,
        'g'
      );
      content = content.replace(regex, newBlock);
    } else {
      // Append new block
      if (content && !content.endsWith('\n')) {
        content += '\n';
      }
      content += '\n' + newBlock + '\n';
    }

    // Write back
    fs.writeFileSync(rcPath, content, 'utf-8');
  }

  /**
   * Clear environment variables from shell RC file
   * Removes claude-provider block
   */
  clearEnvVars(): void {
    const rcPath = this.getShellRcPath();

    if (!rcPath || !fs.existsSync(rcPath)) {
      return; // Nothing to clear
    }

    let content = fs.readFileSync(rcPath, 'utf-8');

    // Remove block if exists
    if (content.includes(this.BLOCK_START)) {
      const regex = new RegExp(
        `\\n?${this.escapeRegex(this.BLOCK_START)}[\\s\\S]*?${this.escapeRegex(this.BLOCK_END)}\\n?`,
        'g'
      );
      content = content.replace(regex, '\n');

      fs.writeFileSync(rcPath, content, 'utf-8');
    }
  }

  /**
   * Generate config block for shell
   */
  private generateConfigBlock(envVars: Record<string, string>, shell: string): string {
    const lines: string[] = [this.BLOCK_START];
    
    lines.push('# Claude Provider CLI - Environment Configuration');
    lines.push('# DO NOT EDIT THIS BLOCK MANUALLY - managed by claude-provider CLI');
    lines.push('');

    // Generate export statements based on shell
    if (shell === 'fish') {
      Object.entries(envVars).forEach(([key, value]) => {
        lines.push(`set -x ${key} "${this.escapeValue(value, shell)}"`);
      });
    } else if (shell === 'powershell') {
      Object.entries(envVars).forEach(([key, value]) => {
        lines.push(`$env:${key} = "${this.escapeValue(value, shell)}"`);
      });
    } else {
      // bash/zsh
      Object.entries(envVars).forEach(([key, value]) => {
        lines.push(`export ${key}="${this.escapeValue(value, shell)}"`);
      });
    }

    lines.push('');
    lines.push(this.BLOCK_END);

    return lines.join('\n');
  }

  /**
   * Escape special characters in value
   */
  private escapeValue(value: string, shell: string): string {
    if (shell === 'powershell') {
      // PowerShell escaping
      return value.replace(/"/g, '`"');
    } else {
      // Unix shells escaping
      return value.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
    }
  }

  /**
   * Escape regex special characters
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get instructions for applying changes
   */
  getApplyInstructions(shell?: string): string {
    const detectedShell = shell || this.detectShell();
    const rcPath = this.getShellRcPath();

    if (!rcPath) {
      return 'Please restart your terminal or set environment variables manually.';
    }

    switch (detectedShell) {
      case 'zsh':
      case 'bash':
        return `Run: source ${rcPath}`;
      
      case 'fish':
        return `Run: source ${rcPath}`;
      
      case 'powershell':
        return `Run: . ${rcPath}`;
      
      default:
        return 'Please restart your terminal.';
    }
  }

  /**
   * Check if RC file exists and is writable
   */
  canWrite(): { canWrite: boolean; error?: string } {
    const rcPath = this.getShellRcPath();

    if (!rcPath) {
      return {
        canWrite: false,
        error: 'Unsupported shell type',
      };
    }

    try {
      // Check if directory exists
      const dir = path.dirname(rcPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Check write permissions
      if (fs.existsSync(rcPath)) {
        fs.accessSync(rcPath, fs.constants.W_OK);
      } else {
        // Try to create the file
        fs.writeFileSync(rcPath, '', { flag: 'a' });
      }

      return { canWrite: true };
    } catch (error) {
      return {
        canWrite: false,
        error: error instanceof Error ? error.message : 'Permission denied',
      };
    }
  }
}

// Singleton instance
export const shellIntegration = new ShellIntegration();

