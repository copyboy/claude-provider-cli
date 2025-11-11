# Claude Provider CLI

[![npm version](https://badge.fury.io/js/claude-provider-cli.svg)](https://www.npmjs.com/package/claude-provider-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Complete solution for managing Claude Code API providers - switch between GLM, MiniMax and custom providers with ease

## 特性 Features

✨ **开箱即用** - 预配置智谱 GLM 和 MiniMax 供应商  
🚀 **快速切换** - 一条命令切换 API 供应商  
🔧 **自定义供应商** - 轻松添加自定义 API 提供商  
💻 **跨平台** - 支持 Windows、macOS 和 Linux  
🎨 **友好界面** - 清晰的输出和错误提示  
📦 **零配置** - 无需手动编辑配置文件  

## 安装 Installation

### npm (推荐)

```bash
# 全局安装
npm install -g claude-provider-cli

# 一次性使用
npx claude-provider-cli
```

### 系统要求

- Node.js 16+

## 快速开始 Quick Start

### 1. 配置 API Token

在使用前，你需要先配置 API Token。有两种方式：

#### 方式 1: 直接设置环境变量（推荐）

**智谱 GLM：**
```bash
# 在 ~/.zshrc 或 ~/.bashrc 中添加
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的智谱API密钥"

# 重新加载配置
source ~/.zshrc
```

**MiniMax：**
```bash
# 在 ~/.zshrc 或 ~/.bashrc 中添加
export ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的MiniMax令牌"
export API_TIMEOUT_MS="3000000"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
export ANTHROPIC_MODEL="MiniMax-M2"
export ANTHROPIC_SMALL_FAST_MODEL="MiniMax-M2"
export ANTHROPIC_DEFAULT_SONNET_MODEL="MiniMax-M2"
export ANTHROPIC_DEFAULT_OPUS_MODEL="MiniMax-M2"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="MiniMax-M2"

# 重新加载配置
source ~/.zshrc
```

#### 方式 2: 使用 Shell 函数（多供应商场景）

在 `~/.zshrc` 或 `~/.bashrc` 中添加切换函数：

```bash
# 切换到智谱 GLM
claude_use_glm() {
    export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"
    export ANTHROPIC_AUTH_TOKEN="你的智谱API密钥"
    echo "✓ 已切换到智谱 GLM API"
}

# 切换到 MiniMax
claude_use_minimax() {
    export ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic"
    export ANTHROPIC_AUTH_TOKEN="你的MiniMax令牌"
    export API_TIMEOUT_MS="3000000"
    export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
    export ANTHROPIC_MODEL="MiniMax-M2"
    export ANTHROPIC_SMALL_FAST_MODEL="MiniMax-M2"
    export ANTHROPIC_DEFAULT_SONNET_MODEL="MiniMax-M2"
    export ANTHROPIC_DEFAULT_OPUS_MODEL="MiniMax-M2"
    export ANTHROPIC_DEFAULT_HAIKU_MODEL="MiniMax-M2"
    echo "✓ 已切换到 MiniMax M2 API"
}

# 重新加载配置
source ~/.zshrc

# 使用方式
claude_use_glm      # 切换到 GLM
claude_use_minimax  # 切换到 MiniMax
```

### 2. 列出所有可用供应商

```bash
claude-provider list
```

### 3. 切换到某个供应商

```bash
# 切换到智谱 GLM
claude-provider use glm

# 切换到 MiniMax
claude-provider use minimax
```

### 4. 查看当前供应商

```bash
claude-provider current
```

### 5. 测试连接

```bash
claude-provider status
```

## 命令 Commands

### `list` - 列出供应商

列出所有可用的 API 供应商。

```bash
claude-provider list
claude-provider ls                # 别名

# JSON 输出
claude-provider list --json
```

### `use` - 切换供应商

切换到指定的 API 供应商。

```bash
claude-provider use <provider-id>

# 临时切换（仅当前会话）
claude-provider use glm --temp
```

### `current` - 当前供应商

显示当前激活的供应商详情。

```bash
claude-provider current
```

### `status` - 连接状态

测试当前供应商的连接状态。

```bash
claude-provider status

# 显示详细信息
claude-provider status --verbose
```

## 内置供应商 Built-in Providers

### 智谱 GLM

```yaml
ID: glm
Name: 智谱 GLM
Description: 智谱 AI GLM 模型服务 - 国内稳定的 AI 服务提供商
Base URL: https://open.bigmodel.cn/api/anthropic
```

### MiniMax M2

```yaml
ID: minimax
Name: MiniMax M2
Description: MiniMax M2 大模型服务 - 高性能 AI 模型
Base URL: https://api.minimaxi.com/anthropic
```

## 配置 Configuration

### 配置文件位置

配置文件自动存储在系统标准位置：

- **macOS**: `~/Library/Preferences/claude-provider-cli-nodejs/config.json`
- **Linux**: `~/.config/claude-provider-cli-nodejs/config.json`
- **Windows**: `%APPDATA%\claude-provider-cli-nodejs\config.json`

### 配置内容说明

配置文件存储：
- ✅ 供应商列表
- ✅ 当前激活的供应商
- ✅ 基础 URL 配置
- ✅ 用户偏好设置

**重要**: API Token **不会**存储在配置文件中，而是通过环境变量管理，确保安全。

### 获取 API Token

#### 智谱 GLM API
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 在控制台创建 API Key
4. 复制 API Key 配置到环境变量

#### MiniMax API
1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)
2. 注册/登录账号
3. 在控制台创建 API Token
4. 复制 Token 配置到环境变量

### 环境变量说明

**必需的环境变量：**
- `ANTHROPIC_BASE_URL`: API 基础地址
- `ANTHROPIC_AUTH_TOKEN`: API 认证令牌

**可选的环境变量（MiniMax）：**
- `API_TIMEOUT_MS`: 超时时间（毫秒）
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`: 禁用非必要流量
- `ANTHROPIC_MODEL`: 默认模型名称
- `ANTHROPIC_SMALL_FAST_MODEL`: 小型快速模型
- `ANTHROPIC_DEFAULT_SONNET_MODEL`: 默认 Sonnet 模型
- `ANTHROPIC_DEFAULT_OPUS_MODEL`: 默认 Opus 模型
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`: 默认 Haiku 模型

### 查看配置

```bash
# 查看当前供应商配置
claude-provider current

# 查看配置文件（macOS）
cat ~/Library/Preferences/claude-provider-cli-nodejs/config.json

# 查看当前环境变量
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_AUTH_TOKEN
```

## 使用场景 Use Cases

### 场景 1: 日常开发

```bash
# 早上使用 GLM
claude-provider use glm
claude code "帮我写代码"

# 下午切换到 MiniMax
claude-provider use minimax
claude code "继续开发"
```

### 场景 2: 测试不同供应商

```bash
# 测试 GLM 响应
claude-provider use glm
time claude code "测试问题"

# 测试 MiniMax 响应
claude-provider use minimax
time claude code "测试问题"
```

### 场景 3: API 额度管理

```bash
# GLM 额度用完，切换到 MiniMax
claude-provider use minimax
```

## 故障排查 Troubleshooting

### API Token 未配置？

如果遇到认证错误，可能是 Token 未配置：

```bash
# 检查环境变量是否设置
echo $ANTHROPIC_AUTH_TOKEN

# 如果为空，需要配置 Token
# 编辑 shell 配置文件
vi ~/.zshrc  # 或 ~/.bashrc

# 添加环境变量
export ANTHROPIC_AUTH_TOKEN="你的API密钥"

# 重新加载
source ~/.zshrc
```

### 配置未生效？

确保环境变量已设置：

```bash
# 查看当前配置
claude-provider current

# 重新加载 shell
source ~/.zshrc
# 或
source ~/.bashrc

# 验证环境变量
env | grep ANTHROPIC
```

### 连接失败？

测试网络连接：

```bash
# 检查连接状态
claude-provider status --verbose

# 尝试另一个供应商
claude-provider use minimax

# 测试 API 地址可访问性
curl -I https://open.bigmodel.cn/api/anthropic
```

### Token 无效？

验证 Token 是否正确：

```bash
# 1. 检查 Token 值
echo $ANTHROPIC_AUTH_TOKEN

# 2. 重新获取 Token
# 智谱 GLM: https://open.bigmodel.cn/
# MiniMax: https://platform.minimaxi.com/

# 3. 更新环境变量
export ANTHROPIC_AUTH_TOKEN="新的Token"
```

### 多个供应商配置冲突？

使用 Shell 函数管理多个供应商：

```bash
# 方法 1: 使用 shell 函数切换
claude_use_glm      # 自动设置 GLM 环境变量
claude_use_minimax  # 自动设置 MiniMax 环境变量

# 方法 2: 使用临时切换
claude-provider use glm --temp

# 方法 3: 查看当前激活的配置
claude-provider current
```

### 需要帮助？

```bash
# 查看帮助
claude-provider --help

# 查看特定命令帮助
claude-provider use --help

# 提交问题
# https://github.com/copyboy/claude-provider-cli/issues
```

## 开发 Development

```bash
# 克隆仓库
git clone https://github.com/yourusername/claude-provider-cli.git
cd claude-provider-cli

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test

# Lint
npm run lint
```

## 贡献 Contributing

欢迎贡献！提交 Issue 或 Pull Request：

- 🐛 [报告 Bug](https://github.com/copyboy/claude-provider-cli/issues/new?labels=bug)
- ✨ [功能建议](https://github.com/copyboy/claude-provider-cli/issues/new?labels=enhancement)
- 📖 [改进文档](https://github.com/copyboy/claude-provider-cli/issues/new?labels=documentation)

## 许可证 License

MIT © [Qingdong Zhang](https://github.com/copyboy)

## 链接 Links

- 📦 [npm Package](https://www.npmjs.com/package/claude-provider-cli)
- 🐛 [Issue Tracker](https://github.com/copyboy/claude-provider-cli/issues)
- 📖 [Documentation](https://github.com/copyboy/claude-provider-cli#readme)
- 👨‍💻 [Author GitHub](https://github.com/copyboy)

## 相关项目 Related Projects

- [Claude Code](https://claude.ai/)
- [智谱 AI](https://open.bigmodel.cn/)
- [MiniMax](https://platform.minimaxi.com/)

---

**Made with ❤️ for the Claude Code community**

