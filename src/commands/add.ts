import inquirer from 'inquirer';
import { configStore } from '../config/store';
import { logger } from '../utils/logger';
import { validateUrl, validateToken } from '../utils/validator';
import { Provider } from '../types/provider';

interface AddOptions {
  token?: string;
  url?: string;
  name?: string;
  description?: string;
}

/**
 * Add or update provider token/configuration
 * 🆕 NEW: Core command for adding tokens to providers
 */
export async function addCommand(
  providerId: string,
  options: AddOptions
): Promise<void> {
  try {
    const existingProvider = configStore.getProvider(providerId);

    // Case 1: Built-in provider - only add token
    if (existingProvider?.builtIn) {
      await addTokenToBuiltInProvider(providerId, existingProvider, options);
      return;
    }

    // Case 2: Existing custom provider - update it
    if (existingProvider && !existingProvider.builtIn) {
      await updateCustomProvider(providerId, existingProvider, options);
      return;
    }

    // Case 3: New custom provider - create it
    await createCustomProvider(providerId, options);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Add token to built-in provider
 */
async function addTokenToBuiltInProvider(
  providerId: string,
  provider: Provider,
  options: AddOptions
): Promise<void> {
  let token = options.token;

  // Interactive prompt if token not provided
  if (!token) {
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: `Enter API token for ${provider.name}:`,
        mask: '*',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Token cannot be empty';
          }
          return validateToken(input) || true;
        },
      },
    ]);
    token = answers.token;
  }

  // Validate token
  const validationError = validateToken(token!);
  if (validationError) {
    throw new Error(validationError);
  }

  // Store token
  configStore.addProviderToken(providerId, token!);

  logger.success(`✓ Token configured for ${provider.name}`);
  logger.info('');
  logger.info(`Next steps:`);
  logger.info(`  1. Switch to this provider: ${logger.command(`claude-provider use ${providerId}`)}`);
  logger.info(`  2. Verify connection: ${logger.command('claude-provider status')}`);
}

/**
 * Update existing custom provider
 */
async function updateCustomProvider(
  providerId: string,
  provider: Provider,
  options: AddOptions
): Promise<void> {
  const updates: Partial<Provider> = {};

  // Collect updates
  if (options.token) {
    const validationError = validateToken(options.token);
    if (validationError) {
      throw new Error(validationError);
    }
    updates.authToken = options.token;
  }

  if (options.url) {
    const validationError = validateUrl(options.url);
    if (validationError) {
      throw new Error(validationError);
    }
    updates.baseUrl = options.url;
    updates.envVars = { ...provider.envVars, ANTHROPIC_BASE_URL: options.url };
  }

  if (options.name) {
    updates.name = options.name;
  }

  if (options.description) {
    updates.description = options.description;
  }

  // Interactive prompt for missing fields
  if (!options.token && !provider.authToken) {
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: `Enter API token for ${provider.name}:`,
        mask: '*',
      },
    ]);
    updates.authToken = answers.token;
  }

  // Apply updates
  const updatedProvider = { ...provider, ...updates };
  configStore.setProvider(providerId, updatedProvider);

  logger.success(`✓ Updated provider '${providerId}'`);
}

/**
 * Create new custom provider
 */
async function createCustomProvider(
  providerId: string,
  options: AddOptions
): Promise<void> {
  let { token, url, name, description } = options;

  // Interactive prompts for missing required fields
  if (!url || !token || !name) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Provider name:',
        default: providerId,
        when: !name,
      },
      {
        type: 'input',
        name: 'url',
        message: 'API base URL:',
        when: !url,
        validate: (input: string) => {
          return validateUrl(input) || true;
        },
      },
      {
        type: 'password',
        name: 'token',
        message: 'API token:',
        mask: '*',
        when: !token,
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Token cannot be empty';
          }
          return validateToken(input) || true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description (optional):',
        when: !description,
      },
    ]);

    name = name || answers.name;
    url = url || answers.url;
    token = token || answers.token;
    description = description || answers.description;
  }

  // Validate
  const urlError = validateUrl(url!);
  if (urlError) {
    throw new Error(urlError);
  }

  const tokenError = validateToken(token!);
  if (tokenError) {
    throw new Error(tokenError);
  }

  // Create provider
  const newProvider: Provider = {
    id: providerId,
    name: name!,
    description: description || `Custom provider: ${name}`,
    baseUrl: url!,
    authToken: token!,
    envVars: {
      ANTHROPIC_BASE_URL: url!,
    },
    builtIn: false,
  };

  configStore.setProvider(providerId, newProvider);

  logger.success(`✓ Created custom provider '${providerId}'`);
  logger.info('');
  logger.info(`Next steps:`);
  logger.info(`  1. Switch to this provider: ${logger.command(`claude-provider use ${providerId}`)}`);
  logger.info(`  2. Verify connection: ${logger.command('claude-provider status')}`);
}

