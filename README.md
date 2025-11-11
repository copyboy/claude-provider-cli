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

### 1. 列出所有可用供应商

```bash
claude-provider list
```

### 2. 切换到某个供应商

```bash
# 切换到智谱 GLM
claude-provider use glm

# 切换到 MiniMax
claude-provider use minimax
```

### 3. 查看当前供应商

```bash
claude-provider current
```

### 4. 测试连接

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

配置文件自动存储在：

- **macOS/Linux**: `~/.config/claude-provider-cli/`
- **Windows**: `%APPDATA%\claude-provider-cli\`

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

### 配置未生效？

确保环境变量已设置：

```bash
# 查看当前配置
claude-provider current

# 重新加载 shell
source ~/.zshrc
# 或
source ~/.bashrc
```

### 连接失败？

测试网络连接：

```bash
# 检查连接状态
claude-provider status --verbose

# 尝试另一个供应商
claude-provider use minimax
```

### 需要帮助？

```bash
# 查看帮助
claude-provider --help

# 查看特定命令帮助
claude-provider use --help
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

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 许可证 License

MIT © [Your Name]

## 链接 Links

- 📦 [npm Package](https://www.npmjs.com/package/claude-provider-cli)
- 🐛 [Issue Tracker](https://github.com/yourusername/claude-provider-cli/issues)
- 📖 [Documentation](https://github.com/yourusername/claude-provider-cli#readme)

## 相关项目 Related Projects

- [Claude Code](https://claude.ai/)
- [智谱 AI](https://open.bigmodel.cn/)
- [MiniMax](https://platform.minimaxi.com/)

---

**Made with ❤️ for the Claude Code community**

