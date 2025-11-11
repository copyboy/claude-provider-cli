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

> **注意**: v0.1.0 为 MVP 版本，Token 管理功能将在 v0.2.0 中提供。当前版本需要手动配置 Token。

### 1. 配置 API Token

> **⚠️ v0.1.0 限制**: 当前版本只支持**单一 Token**。如果你的 GLM 和 MiniMax 使用不同的 Token，请选择以下方案之一。

首先在环境变量中配置你的 API Token：

```bash
# 编辑你的 shell 配置文件
vi ~/.zshrc  # 或 ~/.bashrc

# === 场景 A: 两个供应商使用相同 Token ===
export ANTHROPIC_AUTH_TOKEN="你的共用Token"

# === 场景 B: 两个供应商使用不同 Token（临时方案）===
# 方案 1: 只配置最常用的供应商Token
export ANTHROPIC_AUTH_TOKEN="你最常用的GLM密钥"

# 方案 2: 配置两个不同名称的变量（推荐）
export GLM_TOKEN="你的GLM密钥"
export MINIMAX_TOKEN="你的MiniMax令牌"
# 使用时手动切换（见下方说明）

# 重新加载
source ~/.zshrc
```

**如果使用方案 2（不同 Token），切换时需要手动更新：**
```bash
# 切换到 GLM
export ANTHROPIC_AUTH_TOKEN=$GLM_TOKEN
claude-provider use glm

# 切换到 MiniMax
export ANTHROPIC_AUTH_TOKEN=$MINIMAX_TOKEN
claude-provider use minimax
```

**获取 API Token：**
- [智谱 GLM](https://open.bigmodel.cn/) - 智谱 AI 开放平台
- [MiniMax](https://platform.minimaxi.com/) - MiniMax 开放平台

> **💡 v0.2.0 将彻底解决**: 未来版本将支持每个供应商存储独立 Token，切换时自动切换正确的 Token。
> ```bash
> # v0.2.0 将支持
> claude-provider add glm --token "GLM密钥"
> claude-provider add minimax --token "MiniMax令牌"
> claude-provider use glm  # 自动使用正确的Token
> ```

### 2. 列出可用供应商

```bash
claude-provider list
```

输出：
```
┌───────────┬────────────┬────────────────────────────┬──────────┐
│ ID        │ Name       │ Description                │ Status   │
├───────────┼────────────┼────────────────────────────┼──────────┤
│ glm       │ 智谱 GLM   │ 智谱 AI GLM 模型服务       │          │
│ minimax   │ MiniMax M2 │ MiniMax M2 大模型服务      │ ✓ Active │
└───────────┴────────────┴────────────────────────────┴──────────┘
```

### 3. 切换供应商（核心功能）

```bash
# 切换到智谱 GLM
claude-provider use glm

# 切换到 MiniMax
claude-provider use minimax
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
- ✅ 供应商列表和详细信息
- ✅ 当前激活的供应商
- ✅ 基础 URL 和环境变量配置
- ✅ 用户偏好设置

**重要安全说明**: 
- API Token **不会**存储在配置文件中
- Token 需要手动配置到环境变量（v0.1.0 MVP 版本）
- 未来版本（v0.2.0+）将提供 `add`/`edit`/`remove` 命令来安全管理 Token

### 当前版本 Token 管理

**v0.1.0（当前）：**
- 用户需要手动在 `~/.zshrc` 中配置 `ANTHROPIC_AUTH_TOKEN`
- 工具负责管理其他所有环境变量（BASE_URL、MODEL 等）
- 工具记住你选择的供应商，自动切换配置

**v0.2.0（计划中）：**
```bash
# 未来将支持
claude-provider add glm --token "你的密钥"
claude-provider edit glm --token "新密钥"
claude-provider remove custom-provider
```

### 获取 API Token

#### 智谱 GLM API
1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 在控制台创建 API Key
4. 复制 API Key 到环境变量

#### MiniMax API
1. 访问 [MiniMax 开放平台](https://platform.minimaxi.com/)
2. 注册/登录账号  
3. 在控制台创建 API Token
4. 复制 Token 到环境变量

### 环境变量说明

**用户需要配置（手动）：**
- `ANTHROPIC_AUTH_TOKEN`: API 认证令牌（唯一需要手动配置的）

**工具自动管理：**
- `ANTHROPIC_BASE_URL`: API 基础地址（工具自动设置）
- `API_TIMEOUT_MS`: 超时时间（工具自动设置）
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`: 流量控制（工具自动设置）
- `ANTHROPIC_MODEL`: 模型配置（工具自动设置）
- 其他模型相关变量（工具自动设置）

### 查看配置

```bash
# 查看当前供应商配置
claude-provider current

# 查看配置文件（macOS）
cat ~/Library/Preferences/claude-provider-cli-nodejs/config.json

# 查看当前环境变量
echo $ANTHROPIC_AUTH_TOKEN  # 你配置的
echo $ANTHROPIC_BASE_URL    # 工具设置的
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

### 多个供应商如何管理 Token？

> **这是 v0.1.0 的核心限制**

**问题说明：**

当前版本只支持单一 `ANTHROPIC_AUTH_TOKEN` 环境变量。如果 GLM 和 MiniMax 使用不同的 Token，切换供应商时：
- ✅ 工具会自动切换 `ANTHROPIC_BASE_URL`
- ✅ 工具会自动切换 `ANTHROPIC_MODEL` 等其他变量
- ❌ 但 `ANTHROPIC_AUTH_TOKEN` **不会自动切换**

**临时解决方案：**

```bash
# 在 ~/.zshrc 中配置两个变量
export GLM_TOKEN="你的GLM密钥"
export MINIMAX_TOKEN="你的MiniMax令牌"

# 创建别名简化操作
alias use-glm='export ANTHROPIC_AUTH_TOKEN=$GLM_TOKEN && claude-provider use glm'
alias use-minimax='export ANTHROPIC_AUTH_TOKEN=$MINIMAX_TOKEN && claude-provider use minimax'

# 使用
use-glm      # 切换到 GLM（Token + 配置）
use-minimax  # 切换到 MiniMax（Token + 配置）
```

**v0.2.0 完整解决方案：**

```bash
# 未来版本将支持
claude-provider add glm --token "GLM密钥"
claude-provider add minimax --token "MiniMax令牌"

# 切换时自动使用正确的 Token
claude-provider use glm      # 自动切换到 GLM Token
claude-provider use minimax  # 自动切换到 MiniMax Token

# Token 安全存储在配置文件中（chmod 600）
```

**为什么现在不支持？**

v0.1.0 是 MVP 版本，专注于核心功能：
- ✅ 供应商切换和管理
- ✅ 环境变量自动配置
- ✅ 配置持久化

Token 安全管理需要更多考虑：
- 🔐 安全存储机制
- 🔄 Token 加密/解密
- 📝 完整的 CRUD 操作
- ✅ 这些将在 v0.2.0 中实现

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

