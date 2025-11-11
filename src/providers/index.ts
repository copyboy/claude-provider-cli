import { Provider } from '../types/provider';

/**
 * Built-in provider configurations
 */

export const GLM_PROVIDER: Provider = {
  id: 'glm',
  name: '智谱 GLM',
  description: '智谱 AI GLM 模型服务 - 国内稳定的 AI 服务提供商',
  baseUrl: 'https://open.bigmodel.cn/api/anthropic',
  envVars: {
    ANTHROPIC_BASE_URL: 'https://open.bigmodel.cn/api/anthropic',
  },
  builtIn: true,
  testEndpoint: 'https://open.bigmodel.cn/api/anthropic',
};

export const MINIMAX_PROVIDER: Provider = {
  id: 'minimax',
  name: 'MiniMax M2',
  description: 'MiniMax M2 大模型服务 - 高性能 AI 模型',
  baseUrl: 'https://api.minimaxi.com/anthropic',
  envVars: {
    ANTHROPIC_BASE_URL: 'https://api.minimaxi.com/anthropic',
    API_TIMEOUT_MS: '3000000',
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
    ANTHROPIC_MODEL: 'MiniMax-M2',
    ANTHROPIC_SMALL_FAST_MODEL: 'MiniMax-M2',
    ANTHROPIC_DEFAULT_SONNET_MODEL: 'MiniMax-M2',
    ANTHROPIC_DEFAULT_OPUS_MODEL: 'MiniMax-M2',
    ANTHROPIC_DEFAULT_HAIKU_MODEL: 'MiniMax-M2',
  },
  builtIn: true,
  testEndpoint: 'https://api.minimaxi.com/anthropic',
};

export const DEFAULT_PROVIDERS: Record<string, Provider> = {
  glm: GLM_PROVIDER,
  minimax: MINIMAX_PROVIDER,
};

