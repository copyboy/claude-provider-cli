# Claude Provider CLI

[![npm version](https://badge.fury.io/js/claude-provider-cli.svg)](https://www.npmjs.com/package/claude-provider-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Complete solution for managing Claude Code API providers - switch between GLM, MiniMax and custom providers with ease

## 特性 Features

✨ **开箱即用** - 预配置智谱 GLM 和 MiniMax 供应商  
🚀 **快速切换** - 一条命令切换 API 供应商，无需记忆复杂配置  
🔧 **智能管理** - 自动设置所有必需的环境变量和模型参数  
💾 **配置持久化** - 切换后的配置自动保存，跨会话生效  
💻 **跨平台** - 支持 Windows、macOS 和 Linux  
🎨 **友好界面** - 清晰的输出和错误提示  
📦 **统一管理** - 一个工具管理所有 Claude Code API 供应商  

## 为什么需要这个工具？ Why This Tool?

**没有工具时：**
```bash
# 切换到 GLM - 需要记住并设置多个环境变量
export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的密钥"
# 还要清除其他供应商的变量...

# 切换到 MiniMax - 需要设置更多变量
export ANTHROPIC_BASE_URL="https://api.minimaxi.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="你的令牌"
export API_TIMEOUT_MS="3000000"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
export ANTHROPIC_MODEL="MiniMax-M2"
export ANTHROPIC_SMALL_FAST_MODEL="MiniMax-M2"
# ... 还有更多变量
```

**使用工具后：**
```bash
# 切换到 GLM - 一条命令搞定
claude-provider use glm

# 切换到 MiniMax - 同样简单
claude-provider use minimax

# 查看当前配置
claude-provider current
```

**核心价值：**
- 🎯 **简化操作** - 不需要记住每个供应商的配置细节
- 🔄 **统一接口** - 所有供应商使用相同的命令切换
- 💾 **自动持久化** - 配置自动保存，下次启动自动生效
- 🚫 **避免错误** - 自动清除冲突的环境变量
- 📊 **状态管理** - 随时查看当前使用的供应商和连接状态  

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

### 1. 安装

```bash
npm install -g claude-provider-cli
```

### 2. 添加 API Token

首次使用需要为每个供应商添加 API Token：

```bash
# 添加智谱 GLM Token
claude-provider add glm --token "your-glm-api-key"

# 添加 MiniMax Token
claude-provider add minimax --token "your-minimax-jwt-token"
```

**获取 API Token：**
- [智谱 GLM](https://open.bigmodel.cn/) - 智谱 AI 开放平台
- [MiniMax](https://platform.minimaxi.com/) - MiniMax 开放平台

### 3. 查看所有供应商

```bash
claude-provider list
```

输出：
```
┌───────────┬────────────┬────────────────────────────┬──────────────────┬──────────┐
│ ID        │ Name       │ Description                │ Token            │ Status   │
├───────────┼────────────┼────────────────────────────┼──────────────────┼──────────┤
│ glm       │ 智谱 GLM   │ 智谱 AI GLM 模型服务       │ ✓ Configured     │          │
│ minimax   │ MiniMax M2 │ MiniMax M2 大模型服务      │ ✓ Configured     │ ✓ Active │
└───────────┴────────────┴────────────────────────────┴──────────────────┴──────────┘
```

### 4. 切换供应商（核心功能）

```bash
# 切换到智谱 GLM（持久化）
claude-provider use glm

# 输出：
# ✓ Switched to 智谱 GLM ✓
# Updated /Users/you/.zshrc (zsh)
# 
# To apply changes:
#   Option 1: Run: source /Users/you/.zshrc
#   Option 2: Open a new terminal window
```

### 5. 应用更改

```bash
# 方式 1: 当前终端立即生效
source ~/.zshrc   # 或 ~/.bashrc

# 方式 2: 打开新终端（自动生效）
```

### 6. 验证配置

```bash
# 查看当前激活的供应商
claude-provider current

# 检查环境变量
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL
```

### 7. 开始使用 Claude Code

```bash
claude code "帮我写一个快速排序算法"
# 正常工作！使用的是智谱 GLM API
```

### 临时切换（仅当前会话）

如果只想临时测试某个供应商，不修改配置文件：

```bash
claude-provider use minimax --temp

# 输出：
# ✓ Temporarily switched to MiniMax M2
# ⚠ This is a temporary switch (current session only)
# Changes will NOT persist to new terminals
```

**工具会自动：**
- ✅ 设置 `ANTHROPIC_BASE_URL` 到正确的地址
- ✅ 配置所有必需的环境变量
- ✅ 保存你的选择，下次启动自动生效
- ✅ 跨终端会话持久化

### 4. 验证当前配置

```bash
# 查看当前使用的供应商
claude-provider current

# 测试连接状态
claude-provider status
```

### 5. 开始使用 Claude Code

```bash
claude code "帮我写代码"
```

## 命令 Commands

### `add` - 添加/更新供应商 Token

为内置或自定义供应商添加 API Token。

**为内置供应商添加 Token：**

```bash
# 交互式提示输入 Token
claude-provider add glm

# 直接指定 Token
claude-provider add glm --token "your-api-key"

# 添加 MiniMax Token
claude-provider add minimax --token "your-jwt-token"
```

**创建自定义供应商：**

```bash
# 完整命令行参数
claude-provider add my-api \
  --token "your-token" \
  --url "https://api.example.com/anthropic" \
  --name "My Custom API" \
  --description "My custom Claude-compatible API"

# 交互式提示
claude-provider add my-api
# 将提示输入：name, url, token, description
```

**选项：**
- `-t, --token <token>` - API 认证 Token
- `-u, --url <url>` - API 基础 URL（仅自定义供应商）
- `-n, --name <name>` - 供应商显示名称（仅自定义供应商）
- `-d, --description <desc>` - 供应商描述（仅自定义供应商）

### `list` - 列出供应商

列出所有可用的 API 供应商及其 Token 配置状态。

```bash
claude-provider list
claude-provider ls                # 别名

# JSON 输出（Token 被掩码保护）
claude-provider list --json
```

输出示例：
```
┌───────────┬────────────┬────────────────────────────┬──────────────────┬──────────┐
│ ID        │ Name       │ Description                │ Token            │ Status   │
├───────────┼────────────┼────────────────────────────┼──────────────────┼──────────┤
│ glm       │ 智谱 GLM   │ 智谱 AI GLM 模型服务       │ ✓ Configured     │ ✓ Active │
│ minimax   │ MiniMax M2 │ MiniMax M2 大模型服务      │ ✗ Not configured │          │
└───────────┴────────────┴────────────────────────────┴──────────────────┴──────────┘
```

### `use` - 切换供应商

切换到指定的 API 供应商。默认持久化到 Shell 配置文件。

```bash
# 持久化切换（推荐）
claude-provider use <provider-id>

# 临时切换（仅当前会话）
claude-provider use <provider-id> --temp
```

**示例：**

```bash
# 切换到 GLM（写入 ~/.zshrc）
claude-provider use glm

# 临时切换到 MiniMax（不修改配置文件）
claude-provider use minimax --temp
```

**工作原理：**

持久化切换：
1. 读取 Token 从配置文件
2. 写入所有环境变量到 `~/.zshrc` 或 `~/.bashrc`
3. 自动备份原配置文件
4. 在当前会话也设置环境变量
5. 新终端自动应用配置

临时切换：
1. 仅在当前 shell 会话设置环境变量
2. 不修改任何配置文件
3. 关闭终端后失效

**选项：**
- `-t, --temp` - 临时切换（不持久化）

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

### 配置内容

配置文件存储：
- ✅ 供应商列表和详细信息
- ✅ **API Tokens**（安全存储，chmod 600）
- ✅ 当前激活的供应商
- ✅ 基础 URL 和环境变量配置
- ✅ 用户偏好设置

### Token 安全存储

**v0.2.0 特性：**

- ✅ Tokens 安全存储在配置文件中
- ✅ 配置文件权限：`chmod 600`（仅所有者读写）
- ✅ 每个供应商独立 Token
- ✅ 切换供应商自动切换正确的 Token
- ✅ Token 在输出中自动掩码

**工作原理：**

```bash
# 1. 添加 Token（存储到配置文件）
claude-provider add glm --token "your-token"
# → 配置文件被设置为 chmod 600

# 2. 切换供应商（自动读取并应用 Token）
claude-provider use glm
# → 读取配置文件中的 Token
# → 写入所有环境变量（含 Token）到 ~/.zshrc
# → Token 在终端输出中被掩码
```

### Shell 集成

工具会自动修改你的 Shell 配置文件：

**支持的 Shell：**
- ✅ bash (`.bashrc` / `.bash_profile`)
- ✅ zsh (`.zshrc`)
- ✅ fish (`.config/fish/config.fish`)
- ✅ PowerShell (`profile.ps1`)

**配置块示例（~/.zshrc）：**

```bash
# >>> claude-provider-cli init >>>
# Claude Provider CLI - Environment Configuration
# DO NOT EDIT THIS BLOCK MANUALLY - managed by claude-provider CLI

export ANTHROPIC_BASE_URL="https://open.bigmodel.cn/api/anthropic"
export ANTHROPIC_AUTH_TOKEN="6d7909c078..."

# <<< claude-provider-cli init <<<
```

**安全特性：**
- 自动备份原配置文件（`.zshrc.claude-provider-backup`）
- 使用标记管理配置块，避免重复
- 清晰的 "DO NOT EDIT" 警告

### 获取 API Token

#### 智谱 GLM API
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 在控制台创建 API Key
4. 使用 `claude-provider add glm --token "your-key"` 添加

#### MiniMax API
1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)
2. 注册/登录账号  
3. 在控制台创建 API Token
4. 使用 `claude-provider add minimax --token "your-token"` 添加

### 环境变量

**工具完全管理所有环境变量：**

| 变量名 | 说明 | 管理方式 |
|--------|------|----------|
| `ANTHROPIC_AUTH_TOKEN` | API 认证令牌 | 从配置读取并写入 RC 文件 |
| `ANTHROPIC_BASE_URL` | API 基础地址 | 自动设置 |
| `API_TIMEOUT_MS` | 超时时间 | 自动设置（MiniMax） |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 流量控制 | 自动设置（MiniMax） |
| `ANTHROPIC_MODEL` | 模型配置 | 自动设置（MiniMax） |
| `ANTHROPIC_*_MODEL` | 其他模型变量 | 自动设置（MiniMax） |

**用户无需手动配置任何环境变量！**

### 查看配置

```bash
# 查看当前供应商配置
claude-provider current

# 查看配置文件（macOS）
cat ~/Library/Preferences/claude-provider-cli-nodejs/config.json

# 查看 Shell RC 文件中的配置块
grep -A 10 "claude-provider-cli init" ~/.zshrc

# 查看当前环境变量
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL
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
# 检查 Token 状态
claude-provider list

# 如果显示 "✗ Not configured"，添加 Token
claude-provider add glm --token "your-api-key"
```

### 配置未生效？

确保环境变量已设置：

```bash
# 查看当前配置
claude-provider current

# 重新应用配置
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

更新 Token：

```bash
# 1. 重新获取 Token
# 智谱 GLM: https://open.bigmodel.cn/
# MiniMax: https://platform.minimaxi.com/

# 2. 更新 Token
claude-provider add glm --token "new-token"

# 3. 重新切换
claude-provider use glm
```

### 如何管理多个供应商的 Token？

**v0.2.0 完美支持：**

```bash
# 每个供应商独立 Token
claude-provider add glm --token "glm-token-123"
claude-provider add minimax --token "minimax-token-456"

# 切换时自动使用正确的 Token
claude-provider use glm      # 自动使用 glm-token-123
claude-provider use minimax  # 自动使用 minimax-token-456

# Token 安全存储在配置文件中（chmod 600）
ls -la ~/Library/Preferences/claude-provider-cli-nodejs/config.json
# -rw------- ... config.json  （仅所有者可读写）
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

