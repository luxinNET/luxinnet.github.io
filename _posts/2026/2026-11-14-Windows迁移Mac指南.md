---
title: "Windows 迁移 Mac 指南"
date: 2026-11-14
categories: ["Article"]
tags: ["Mac", "Toolchain", "Migration"]
comments: true
---

M1 / 16GB / 512G 的闲置 MacBook Pro 接替现在的 Windows 机器（i7-1165G7 / 16G / C盘仅剩30G）。工作项目是 net8.0 + Vue，无 WCF/WPF 依赖，驻场允许自带 Mac，无硬性阻碍。本文是迁移执行手册。

## 一、迁移方式

核心原则：**能重建的不拷，只拷"有状态"的数据**。

| 数据 | 方式 |
|---|---|
| Git 仓库 | 旧机 `git push` 所有未推送 commit → Mac 重新 clone |
| Claude Code 记忆 | 拷 `C:\Users\EDY\.claude\` → Mac `~/.claude/` |
| user-secrets | 拷 `C:\Users\EDY\AppData\Roaming\Microsoft\UserSecrets\` → Mac `~/.microsoft/usersecrets/` |
| 项目内 gitignored 文件 | 每个仓库 `git status --ignored` 清点，手动拷 |
| Obsidian vault | 整个文件夹拷（含隐藏的 `.obsidian` 配置目录） |
| 文档资料 | SMB 共享或移动硬盘 |
| 浏览器数据 | Chrome/Edge 账号同步，免拷 |
| 微信聊天记录 | 微信官方"聊天记录迁移"功能（局域网） |

### SMB 共享操作（几十 GB 以内推荐）

1. Windows：目标文件夹 → 右键 → 属性 → 共享
2. Mac：Finder 按 `Cmd+K`，输入 `smb://旧机器IP`，输账号密码
3. 挂载后直接拖拽拷贝

数据量超过 100G 或 Mac 无网线转接器时，改用移动硬盘（exFAT 格式，两边通用）。

## 二、必须单独拷的东西（重新 clone 拿不回来的）

- [ ] `C:\Users\EDY\.claude\` 整个目录
- [ ] `C:\Users\EDY\AppData\Roaming\Microsoft\UserSecrets\`
- [ ] 各项目的 `.claude/` 文件夹、`.env`、`appsettings.Local.json`、本地 sqlite 文件
- [ ] SSH 密钥和 `.gitconfig`
- [ ] 数据库连接串笔记 / Navicat 连接配置导出

**清点命令**：每个仓库根目录跑 `git status --ignored`，对着列表勾。

### Claude Code 记忆挂载的坑

会话和 memory 按项目路径索引。Windows 上 `d:\else\doc\luxinnet.github.io` 到 Mac 变成 `/Users/xxx/work/luxinnet.github.io`，路径变了，旧记忆不会自动出现在新项目里。

解法：拷过去后把 `~/.claude/projects/` 下旧路径对应的文件夹**改名**成新路径的编码名（规律：路径里的 `\` `:` `.` 换成 `-`），记忆即接上。不改名文件也还在，可手动翻。

## 三、常用工具的 Mac 对应

| Windows 工具 | Mac 方案 | 说明 |
|---|---|---|
| VS Code | 官方 Mac 版 | **Settings Sync**：登录同一 GitHub 账号，扩展/设置/快捷键自动同步 |
| APIPost | 官方 Mac 版，原生 M1 | 登录同一账号走云端同步，或旧机导出 → Mac 导入 |
| Notepad++ | 无 Mac 版 → 用 VS Code | 把 VS Code 设为默认文本编辑器即可覆盖全部场景 |
| Markdown 预览 | VS Code 内置（`Cmd+Shift+V`） | 不用再装预览器；Typora 付费可选 |
| WPS | 官方 Mac 版 | 直接装 |
| Obsidian | 官方 Mac 版 | vault 文件夹整体拷过去即完成迁移（`.obsidian` 隐藏目录里有插件和配置，别漏） |
| SSMS | VS Code + MSSQL 扩展 | 连远程 SQL Server 没问题 |
| 远程桌面 | Microsoft Remote Desktop | App Store 免费，连 Windows 服务器 |
| 浏览器 | Chrome/Edge Mac 版 | 账号同步 |
| 微信 / QQ | Mac 版 | 聊天记录用官方迁移工具 |

## 四、Mac 系统差异备忘

### 键盘肌肉记忆（最痛的一周）

| 操作 | Windows | Mac |
|---|---|---|
| 复制 / 粘贴 / 全选 | Ctrl + C/V/A | **Cmd** + C/V/A |
| 行首 / 行尾 | Home / End | **Cmd + ←** / **Cmd + →** |
| 删除前一个词 | Ctrl + Backspace | **Option + Backspace** |
| 关闭窗口 | 点 × | 红点只是关窗口，**Cmd+Q 才是退出程序** |
| 锁屏 | Win + L | **Ctrl + Cmd + Q** |
| 任务管理器 | Ctrl+Shift+Esc | **Cmd+Option+Esc**（或活动监视器） |

VS Code / 浏览器里的 Ctrl 快捷键基本平移成 Cmd，过渡比想象中快。

### 文件系统

- 无盘符，外接盘挂载在 `/Volumes/`，路径分隔符是 `/`
- APFS 默认大小写不敏感但保留（和 Windows 行为接近，一般无感）
- **换行符**：Windows CRLF → Mac LF。Mac 上配 `git config --global core.autocrlf input`，避免仓库里混入换行符 diff

### 软件安装方式

- **Homebrew** 是包管理器主力（装法见下节）
- `.dmg` 安装：打开后把图标拖进 Applications
- Gatekeeper：第一次打开"未验证开发者"的软件被拦 → 系统设置 → 隐私与安全性 → 点"仍要打开"

## 五、开发环境重装清单（按顺序）

```bash
# 1. 命令行工具（git 等随附）
xcode-select --install

# 2. Homebrew（官网 brew.sh 取最新命令）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Node
brew install node

# 4. .NET 8 SDK（brew 装的是最新版，net8 项目用官网 pkg 更稳）
#    dotnet.microsoft.com/download/dotnet/8.0 → macOS ARM64

# 5. 验证
dotnet --info
node -v && npm -v
```

然后：

- [ ] VS Code：登录账号，Settings Sync 自动恢复扩展
- [ ] 装扩展：C# Dev Kit、MSSQL
- [ ] 恢复 `~/.microsoft/usersecrets/`（即上面拷的 UserSecrets）
- [ ] 恢复 `~/.claude/` 并改 projects 文件夹名
- [ ] `git config --global user.name / user.email` 重新设置

## 六、迁移日执行顺序

1. 旧机：所有仓库 `git push` + `git status --ignored` 清点
2. 旧机：打包 `~/.claude`、UserSecrets、`.ssh`、`.gitconfig`、gitignored 杂项
3. SMB / 硬盘拷贝到 Mac
4. Mac：按第五节装环境
5. Mac：clone 一个真实工作项目，跑通**验证三件事**：
   - `dotnet restore && dotnet run`（注意 NuGet 私有源/代理证书，这是最常见卡点）
   - MSSQL 扩展连一次工作库
   - 打断点走一次完整调试
6. 两周双机并行：Windows 机器别收，遇到"只有 Windows 能干"的场景先回退，攒问题清单

## 已知约束

- 16G 内存：尽量不本地跑 Docker（SQL Server 容器在 M1 上无 ARM 镜像，走 Rosetta 模拟，性能打折），数据库连远程
- IDE 用 VS Code 不用 Rider（Rider 吃内存）
- 512G 硬盘：迁移料约 100G，余量充足；Docker 镜像多了会吃紧，定期 `docker system prune`
