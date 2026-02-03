---
title: OpenClaw 快速开箱指南
date: 2026-02-02 20:30:00
index_img: https://cdn.bili33.top/gh/miku8miku/images@main/202601241526664.png
categories: [AI工具]
tags: [OpenClaw, AI助手, 中文版, Docker, 部署教程]
---


# OpenClaw 快速开箱指南

[OpenClaw](https://github.com/openclaw/openclaw)（曾用名 Clawd / Moltbot）是一个开源的个人 AI 助手平台（GitHub 100k+ Stars），可以通过 WhatsApp、Telegram、Discord 等聊天软件与 AI 交互。简单说就是：**在你自己的机器上运行一个 AI 助手，通过常用聊天软件跟它对话**。

原版是全英文的，我们制作了一个**中文发行版**，让国内用户也能轻松使用：

| 特点     | 说明                                             |
| :------- | :----------------------------------------------- |
| 开箱即用 | npm 一键安装 / Docker 一键部署，不需要手动打补丁 |
| 实时同步 | 每小时自动从官方仓库拉取最新代码并构建           |
| 双版本   | stable（稳定版）和 nightly（最新版）可选         |
| 深度汉化 | CLI + Dashboard 全中文界面                       |

**项目地址**：[GitHub - 1186258278/OpenClawChineseTranslation: 🦞 OpenClaw (Clawdbot/Moltbot) 汉化版 - 开源个人 AI 助手中文版 | Claude/ChatGPT LLM 接入 | WhatsApp/Telegram/Discord 多平台 | 每小时自动同步 | CLI + Dashboard 全中文](https://github.com/1186258278/OpenClawChineseTranslation)

![image-20260202201846737](https://cdn.bili33.top/gh/miku8miku/images@main/202602022018858.png)

## 界面预览

让我们先看看实际效果，Dashboard 界面已完全汉化：

**概览仪表板** - 网关状态、实例监控、快捷操作一目了然：

![image-20260202201925402](https://cdn.bili33.top/gh/miku8miku/images@main/202602022019439.png)

**对话界面** - 与 AI 助手实时交互：

![image-20260202201944089](https://cdn.bili33.top/gh/miku8miku/images@main/202602022019135.png)

**渠道管理** - WhatsApp、Telegram、Discord 等多平台支持：

![image-20260202201959481](https://cdn.bili33.top/gh/miku8miku/images@main/202602022019516.png)

**节点配置** - 执行审批、安全策略管理：

![image-20260202202017441](https://cdn.bili33.top/gh/miku8miku/images@main/202602022020478.png)

**技能插件** - 1Password、Apple Notes 等丰富扩展：

![image-20260202202031203](https://cdn.bili33.top/gh/miku8miku/images@main/202602022020298.png)

**安装诊断页** - 全面汉化，有漏掉的可以去提 issue，保障佬友的优质体验：

![image-20260202202040255](https://cdn.bili33.top/gh/miku8miku/images@main/202602022020308.png)

## 环境要求

| 项目    | 要求                   | 说明 |
| :------ | :--------------------- | :--- |
| Node.js | >= 22.12.0（必须）     | 推荐使用 LTS 版本 |
| Docker  | 可选，服务器部署推荐   | 用于容器化部署，便于管理 |
| 网络    | 需要能访问 AI 模型 API | 需要稳定网络连接 |

安装前请确认您的 Node.js 版本满足要求：

```bash
node -v
# 输出应该是 v22.x.x 或更高
```

如果版本不够，去 [Node.js 官网](https://nodejs.org/) 下载最新 LTS 版本，或者用 nvm 管理：

```bash
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 22
nvm use 22

# Windows 用 nvm-windows
# https://github.com/coreybutler/nvm-windows
```

## 安装方式

提供三种方式，根据自己情况选择。

### 方式 A：一键脚本（推荐新手）

最简单的方式，下载执行脚本自动完成安装。

**Linux / macOS：**

```bash
curl -fsSL -o install.sh https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.sh && bash install.sh
```

**Windows PowerShell：**

```powershell
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.ps1" -OutFile "install.ps1"; .\install.ps1
```

脚本会自动：

1. 检查 Node.js 版本
2. 安装中文版 npm 包
3. 尝试运行初始化配置

### 方式 B：npm 手动安装

如果脚本有问题，可以手动安装：

```bash
# 稳定版（推荐）
npm install -g @qingchencloud/openclaw-zh@latest

# 或者 nightly 版（每小时同步上游最新代码）
npm install -g @qingchencloud/openclaw-zh@nightly
```

验证安装：

```bash
openclaw --version
openclaw --help
```

如果 `--help` 输出是中文，说明安装成功。

### 方式 C：Docker 部署（服务器推荐）

在服务器上运行，或者不想污染本地环境，用 Docker。

**快速启动（本地访问）：**

```bash
# 1. 初始化配置
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw setup

docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

# 2. 启动
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly \
  openclaw gateway run
```

启动后访问 `http://localhost:18789` 打开 Dashboard。

## 首次配置

安装完成后，需要进行初始化配置。

### 运行初始化向导

```bash
openclaw onboard
```

这是一个交互式向导，会引导你完成：

1. **选择 AI 模型**：支持 Claude、GPT、本地模型等
2. **配置 API Key**：根据选择的模型输入对应的 API Key
3. **设置聊天通道**：可以连接 WhatsApp、Telegram 等
4. **创建助手人格**：给你的 AI 起个名字，设置性格

整个过程都是中文界面，跟着提示走就行。

### 安装守护进程（可选）

如果希望 OpenClaw 在后台持续运行：

```bash
openclaw onboard --install-daemon
```

### 常用命令速查

```bash
openclaw                    # 启动（交互模式）
openclaw onboard            # 初始化向导
openclaw config             # 查看配置
openclaw config set key val # 修改配置
openclaw skills             # 管理技能插件
openclaw status             # 查看运行状态
openclaw gateway run        # 启动网关（Dashboard）
openclaw message send       # 发送消息（可用于测试连接）
openclaw daemon install     # 安装为系统服务（守护进程）
openclaw daemon uninstall   # 卸载系统服务
```

> **💡 提示**：
> - `openclaw message send` 命令可用于测试各个聊天通道是否正常工作
> - `openclaw daemon` 相关命令可以让 OpenClaw 随系统自启动
> - 配置修改后通常需要重启服务才能生效

## Docker 服务器部署详解

这部分详细介绍在服务器上部署并实现远程访问的配置方法，这些是常见的难点。

### 本地访问 vs 远程访问

| 场景                 | 访问地址                 | 配置复杂度   |
| :------------------- | :----------------------- | :----------- |
| 本机运行，本机访问   | `http://localhost:18789` | 简单         |
| 服务器运行，远程访问 | `http://服务器IP:18789`  | 需要额外配置 |

**为什么远程访问需要额外配置？**

OpenClaw 的 Dashboard 使用 Web Crypto API 进行设备身份验证，此 API 在非 HTTPS 环境下仅限于 localhost 使用。因此，**通过 HTTP 远程访问时，浏览器安全策略会阻止认证**。这是导致远程访问失败的主要原因。

### 方式 1：一键部署脚本（推荐）

项目提供了一键部署脚本，自动完成环境检测、初始化、配置远程访问：

```bash
# 自动生成 Token
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.sh | bash

# 或者指定 Token
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.sh | bash -s -- --token 你的密码

# 仅本地访问（不配置远程）
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.sh | bash -s -- --local-only
```

脚本会自动：

1. 检查 Docker 环境
2. 拉取镜像
3. 创建数据卷
4. 初始化配置
5. 配置远程访问（Token 认证）
6. 启动容器

部署完成后会显示访问地址和 Token。

### 方式 2：手动配置步骤

如果想手动控制每一步：

```bash
# 1. 创建数据卷
docker volume create openclaw-data

# 2. 初始化
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw setup

# 3. 配置网关模式
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

# 4. 配置远程访问（允许局域网访问）
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.bind lan

# 5. 设置访问令牌（重要！远程访问必须）
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.auth.token 你的密码

# 6. 启动容器
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  ghcr.io/1186258278/openclaw-zh:nightly \
  openclaw gateway run
```

访问 `http://服务器IP:18789`，在「网关令牌」输入框填入你设置的 Token，点击连接即可。

### 方式 3：Docker Compose

项目提供了 `docker-compose.yml`：

```bash
# 下载配置文件
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-compose.yml -o docker-compose.yml
```

配置文件内容：

```yaml
version: '3.8'
services:
  openclaw:
    image: ghcr.io/1186258278/openclaw-zh:nightly
    container_name: openclaw
    ports:
      - "18789:18789"
    volumes:
      - openclaw-data:/root/.openclaw
    environment:
      - OPENCLAW_GATEWAY_TOKEN=${OPENCLAW_GATEWAY_TOKEN:-}
    restart: unless-stopped
    command: openclaw gateway run --allow-unconfigured

volumes:
  openclaw-data:
    name: openclaw-data
```

首次需要初始化配置：

```bash
# 启动容器（首次会自动创建卷）
docker-compose up -d

# 初始化配置
docker-compose exec openclaw openclaw setup
docker-compose exec openclaw openclaw config set gateway.mode local

# 远程访问配置（可选）
docker-compose exec openclaw openclaw config set gateway.bind lan
docker-compose exec openclaw openclaw config set gateway.auth.token 你的密码

# 重启生效
docker-compose restart
```

## 常见问题与解决方案

以下是我在使用过程中遇到的一些典型问题及其解决方案：

### 坑 1：挂载路径错误

OpenClaw 容器以 **root** 用户运行，配置文件在 `/root/.openclaw`，不是 `/home/node/.openclaw`。

```bash
# 错误（配置不会持久化）
-v openclaw-data:/home/node/.openclaw

# 正确
-v openclaw-data:/root/.openclaw
```

### 坑 2：必须先初始化再启动

容器启动前必须先运行 `openclaw setup`，否则会报错：

```lua
Missing config. Run openclaw setup
```

使用一键脚本或按照上面的步骤顺序执行就不会遇到这个问题。

### 坑 3：远程访问报 1008 错误

如果看到这样的错误：

```java
disconnected (1008): control ui requires HTTPS or localhost
disconnected (1008): device identity required
```

这是因为没有配置 Token。浏览器安全策略阻止了非 HTTPS 环境下的设备认证。

**解决方法：设置 gateway.auth.token**

```bash
# 容器已运行的情况下
docker exec openclaw openclaw config set gateway.auth.token 你的密码
docker restart openclaw
```

然后在 Dashboard 的「网关令牌」输入框填入 Token 连接。

### 坑 4：allowInsecureAuth 配置不生效

[官方文档](https://docs.openclaw.ai/gateway/troubleshooting)提到的 `gateway.controlUi.allowInsecureAuth: true` 配置存在上游 Bug，单独使用不起作用。必须配合 `gateway.auth.token` 使用。

![image](https://linux.do/uploads/default/optimized/4X/e/8/f/e8ffa3730d00979dbfffdb38c46b13a8c372f462_2_690x159.png)

### Q：安装后运行还是英文？

可能安装了原版。先卸载再安装中文版：

```bash
npm uninstall -g openclaw
npm install -g @qingchencloud/openclaw-zh@latest
```

### Q：Dashboard 打不开？

A：按以下步骤排查：

1. 确认容器在运行：`docker ps`
2. 确认端口没被占用：`netstat -tlnp | grep 18789`
3. 查看容器日志：`docker logs openclaw`
4. 检查防火墙是否阻止了 18789 端口
5. 确认浏览器是否支持 Web Crypto API

> **⚠️ 注意**：某些隐私增强型浏览器（如 Tor Browser）可能无法正常使用 Dashboard 功能。

### Q：Docker 重启后配置丢失？

A：这通常是由于数据卷挂载不当导致的，请检查：

1. 挂载路径是否正确（应该是 `/root/.openclaw`）
2. 是否使用了命名卷而不是匿名卷
3. 宿主机目录权限是否正确（特别是 Linux 系统）

> **🔧 解决方案**：使用命名数据卷可确保配置持久化：
> ```bash
docker volume create openclaw-data
# 然后使用 -v openclaw-data:/root/.openclaw 挂载
> ```

### Q：如何更新到最新版？

A：定期更新可确保获得最新功能和安全修复：

```bash
# npm 安装
npm update -g @qingchencloud/openclaw-zh

# Docker
docker pull ghcr.io/1186258278/openclaw-zh:nightly
docker stop openclaw && docker rm openclaw
# 重新启动（配置保留在数据卷中）
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  ghcr.io/1186258278/openclaw-zh:nightly \
  openclaw gateway run
```

### Q：如何彻底卸载？

A：按以下步骤可完全移除 OpenClaw 及其相关数据：

```bash
# 卸载 npm 包
npm uninstall -g @qingchencloud/openclaw-zh

# 删除配置文件（可选，会删除所有数据）
rm -rf ~/.openclaw

# Docker 方式
docker stop openclaw && docker rm openclaw
docker volume rm openclaw-data
```

## 其他远程访问方案

除了 Token 认证，还有其他方案：

| 方案                   | 说明                                          | 适用场景     |
| :--------------------- | :-------------------------------------------- | :----------- |
| Token 认证             | 设置 `gateway.auth.token`，Dashboard 输入连接 | 内网，最简单 |
| SSH 端口转发           | `ssh -L 18789:127.0.0.1:18789 user@server`    | 更安全       |
| Tailscale Serve        | 自动提供 HTTPS                                | 跨网络访问   |
| Nginx 反向代理 + HTTPS | 配置 SSL 证书                                 | 生产环境     |

## 常用 Docker 命令

```bash
# 查看日志
docker logs -f openclaw

# 重启服务
docker restart openclaw

# 停止服务
docker stop openclaw

# 进入容器
docker exec -it openclaw sh

# 查看当前配置
docker exec openclaw cat /root/.openclaw/openclaw.json
```

## 版本说明

中文发行版提供两个版本：

| 版本   | npm 标签   | Docker 标签 | 更新频率           | 适用场景 |
| :----- | :--------- | :---------- | :----------------- | :------- |
| 稳定版 | `@latest`  | `:latest`   | 手动发布，经过测试 | 日常使用，追求稳定性 |
| 最新版 | `@nightly` | `:nightly`  | 每小时自动同步上游 | 体验新功能，愿意承担风险 |

> **💡 选择建议**：
> - 新手用户或生产环境推荐使用稳定版 (`@latest`)
> - 技术爱好者或希望第一时间体验新功能的用户可以选择 nightly 版 (`@nightly`)

推荐日常使用稳定版，想体验最新功能用 nightly。

官方发布新功能后，中文版最快 1 小时内可用。




## 个人使用

初始化

docker run --rm -v ./data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw setup

配置网关模式

docker run --rm -v ./data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

配置远程访问（允许局域网访问）

docker run --rm -v ./data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.bind lan

设置访问令牌（重要！远程访问必须）

docker run --rm -v ./data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.auth.token wkb2123489

启动容器

docker run -d -p 18889:18789 -v ./data:/root/.openclaw --restart unless-stopped ghcr.io/1186258278/openclaw-zh:nightly openclaw gateway run



## 容器内调试命令

openclaw config set gateway.mode local

openclaw config set gateway.bind lan

openclaw config set gateway.auth.token <>

openclaw gateway run

openclaw gateway start --verbose

openclaw config

docker exec -it openclaw sh

docker exec openclaw openclaw devices list

docker exec openclaw openclaw devices approve RequestID

openclaw pairing approve telegram RequestID

复制容器空间内的文件

docker run --rm -v openclaw-data:/data_from_volume -v C:/Users/94362/Downloads/exported_data:/data_on_host alpine sh -c "cp -a /data_from_volume/. /data_on_host/"