---
title: Umami 网站统计工具完整部署指南
date: 2024-09-19 14:00:00
index_img: https://pic1.imgdb.cn/item/68caacdec5157e1a8812c6fd.png
category: 实用工具
tags:
  - Umami
  - 网站统计
  - Docker
  - 私有部署
  - 数据分析
  - 开源工具
math: false
mermaid: true
# sticky: 1 # 置顶
---

> 在数字化时代，网站数据分析对于了解用户行为、优化用户体验至关重要。Umami 作为一款优秀的开源网站统计工具，提供了简洁、高效、隐私友好的统计解决方案。本文将详细介绍如何部署和配置 Umami 统计系统，让您拥有完全控制的网站数据分析平台。

<!-- more -->

## 项目背景

在博客和个人网站的运营过程中，我之前一直使用百度统计作为网站数据分析工具。然而，百度统计的用户体验并不理想，界面较为繁琐，而且访问数据的可订制性也有限。

虽然我的小站访问量不大，也不经常去查看统计数据，但最近在更换服务器时，偶然发现了 Umami 这个优秀的开源统计工具。它不仅界面简洁美观，而且部署简单，正好赶上这次服务器迁移，便决定自己搭建一个试试。

{% note primary %}
Umami 的最大优势在于它是完全开源免费的，同时提供了简洁直观的用户界面和强大的隐私保护功能。
{% endnote %}

## Umami 简介

**Umami** 是一款现代化的开源网站统计工具，专注于提供简单、快速、隐私友好的网站分析解决方案。

### 主要特性

- 🌍 **多网站支持**：可同时管理多个网站的统计数据
- 🔒 **隐私保护**：不使用 Cookie，不追踪个人信息
- ⚡ **轻量快速**：资源占用极少，加载速度很快
- 🎨 **界面美观**：现代化的响应式设计
- 🐋 **开源免费**：完全开源，无使用限制
- 🚀 **部署简单**：支持 Docker 一键部署

### 技术架构

| 组件 | 技术 | 说明 |
|:---|:---|:---|
| **前端** | React + Next.js | 现代化的用户界面 |
| **后端** | Node.js | 高性能的服务端 |
| **数据库** | PostgreSQL/MySQL | 可选择数据库类型 |
| **部署** | Docker | 容器化部署 |

### 项目信息

- 🌐 **官方网站**：[https://umami.is/](https://umami.is/)
- 📚 **官方文档**：[https://umami.is/docs/](https://umami.is/docs/)
- 💻 **GitHub 地址**：[https://github.com/umami-software/umami](https://github.com/umami-software/umami)
- ⭐ **Star 数量**：20k+（持续增长中）

## 服务选择

在开始部署之前，您需要决定是自建服务还是使用官方托管服务。

### 🌍 官方托管服务

如果您不想自建服务，Umami 提供了便捷的云服务选项：

| 套餐类型 | 网站数量 | 月浏览量 | 价格 |
|:---|:---|:---|:---|
| **免费版** | 3 个 | 100K | 免费 |
| **专业版** | 无限 | 1M | $20/月 |
| **企业版** | 无限 | 10M | $100/月 |

{% note info %}
对于个人用户来说，免费版本可以监控 3 个网站，每月 10 万次浏览量，基本上已经足够使用。
{% endnote %}

### 🛠️ 自建服务优势

选择自建 Umami 服务的主要优势：

- ✅ **完全控制**：数据完全由您控制，无第三方依赖
- ✅ **无数量限制**：可以添加无限数量的网站
- ✅ **数据私有**：所有统计数据都存储在您自己的服务器上
- ✅ **定制化**：可以根据需要进行个性化配置
- ✅ **成本优势**：除了服务器成本外，无其他费用
## Docker Compose 一键部署

### 环境准备

在开始部署之前，请确保您的服务器满足以下要求：

#### 系统要求
- **操作系统**：Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- **内存**：至少 512MB RAM
- **存储空间**：至少 1GB 可用空间
- **网络**：稳定的互联网连接

#### 必需软件
```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 安装 Docker Compose
sudo apt install docker-compose
```

### 部署流程

#### 第一步：创建项目目录

```bash
# 进入服务器目录 www/wwwroot/下
cd /www/wwwroot/

# 新建 umami 文件夹，并进入
mkdir umami
cd umami
```

#### 第二步：拉取镜像

```bash
# 拉取 PostgreSQL 支持的 Umami Docker 镜像
docker pull ghcr.io/umami-software/umami:postgresql-latest
```

{% note info %}
Umami 提供了多个版本的 Docker 镜像，这里我们选择集成 PostgreSQL 的版本，无需单独配置数据库。
{% endnote %}

#### 第三步：创建配置文件

创建 `docker-compose.yaml` 文件：

```bash
vi docker-compose.yaml
```

复制以下内容到文件中：

```yaml
---
version: '3.8'
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    container_name: umami-app
    ports:
      - "3000:3000"  # 可自定义端口，用于反向代理
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: your-32-character-secret-key-here  # 请替换为随机字符串
      TRACKER_SCRIPT_NAME: script.js  # 可选：自定义跟踪脚本名称
    depends_on:
      db:
        condition: service_healthy
    restart: always
    networks:
      - umami-network

  db:
    image: postgres:15-alpine
    container_name: umami-db
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    restart: always
    networks:
      - umami-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  umami-db-data:
    driver: local

networks:
  umami-network:
    driver: bridge
```

### 配置参数说明

#### 环境变量详解

| 变量名 | 说明 | 示例值 |
|:---|:---|:---|
| `DATABASE_URL` | 数据库连接字符串 | `postgresql://umami:umami@db:5432/umami` |
| `DATABASE_TYPE` | 数据库类型 | `postgresql` |
| `APP_SECRET` | 应用密钥（32位字符） | `your-32-character-secret-key-here` |
| `TRACKER_SCRIPT_NAME` | 跟踪脚本名称 | `script.js` |

{% note warning %}
**安全提醒**：请务必将 `APP_SECRET` 替换为随机生成的 32 位字符串，可以使用以下命令生成：
```bash
openssl rand -hex 32
```
{% endnote %}

#### 第四步：启动服务

```bash
# 启动容器（后台运行）
docker-compose up -d
```

#### 部署验证

启动完成后，您会看到类似以下的输出：

```bash
[+] Running 9/9
 ⠿ db Pulled                                                  10.6s
   ⠿ 7264a8db6415 Already exists                              0.0s
   ⠿ 6ff36a0c8b9b Pull complete                               0.4s
   ⠿ 41485c1d4f30 Pull complete                               0.5s
   ⠿ b1c0fd40744e Pull complete                               9.0s
   ⠿ c03dbaaa41b8 Pull complete                               9.1s
   ⠿ bef2a2546759 Pull complete                               9.1s
   ⠿ d80603666f21 Pull complete                               9.2s
   ⠿ b76686cd2926 Pull complete                               9.2s
[+] Running 4/4
 ⠿ Network umami_umami-network   Created                      0.1s
 ⠿ Volume "umami_umami-db-data"  Created                      0.0s
 ⠿ Container umami-db            Healthy                      6.3s
 ⠿ Container umami-app           Started                      6.6s
```

检查容器运行状态：

```bash
# 查看容器状态
docker-compose ps -a

# 查看服务日志
docker-compose logs -f umami
```
## 宝塔面板一键安装

如果您使用的是宝塔面板，可以更加简单地安装 Umami。

### 安装步骤

#### 第一步：搜索并安装

1. 打开宝塔面板的「软件商店」
2. 在搜索框中输入「Umami」
3. 点击「安装」按钮

{% note info %}
由于网络环境的差异，安装时间可能会有所不同，请耐心等待安装完成。
{% endnote %}

#### 第二步：配置参数

安装完成后，您可以进行以下配置：

- **端口设置**：默认为 3000，可根据需要修改
- **数据目录**：设置数据库文件存储位置
- **日志配置**：配置日志输出级别和位置

#### 第三步：监控服务

在宝塔面板中，您可以方便地：

- ✅ **查看应用状态**：实时监控服务运行情况
- ✅ **获取访问信息**：查看访问地址和端口
- ✅ **查看运行日志**：进行问题排查和性能监控

### 宝塔面板优势

| 特性 | 说明 |
|:---|:---|
| **可视化管理** | 直观的图形界面操作 |
| **一键安装** | 无需手动配置 Docker 环境 |
| **集成监控** | 与宝塔系统监控集成 |
| **日志管理** | 集中化的日志查看和管理 |

## 网站配置与访问设置

无论您选择哪种安装方式，部署完成后都需要进行以下配置才能正常访问。

### 第一步：创建网站

在您的服务器管理面板中创建一个新的网站：

1. **添加网站**：设置域名（如 `stats.yourdomain.com`）
2. **SSL 证书**：配置 HTTPS 加密（建议使用 Let's Encrypt 免费证书）
3. **DNS 解析**：将域名指向您的服务器 IP

### 第二步：配置反向代理

设置反向代理将域名访问转发到 Umami 服务：

#### Nginx 配置示例

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name stats.yourdomain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持（可选）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

#### 关键配置参数

| 参数 | 值 | 说明 |
|:---|:---|:---|
| `proxy_pass` | `http://127.0.0.1:3000` | 代理地址（端口与 docker-compose 中一致） |
| `proxy_set_header Host` | `$host` | 保持原始主机头 |
| `X-Forwarded-Proto` | `$scheme` | 传递协议类型（HTTP/HTTPS） |

{% note warning %}
**安全提醒**：
1. 确保只允许从特定域名访问 Umami 服务
2. 建议启用 HTTPS 加密保护数据传输
3. 考虑设置防火墙规则限制访问
{% endnote %}

## 开始使用 Umami

### 初次登录

打开您配置的域名，将看到 Umami 的登录界面。默认登录信息：

- **用户名**：`admin`
- **密码**：`umami`

{% note warning %}
首次登录后请立即修改默认密码，确保账户安全。
{% endnote %}

### 设置中文界面

登录后可以在右上角进行语言修改，选择中文界面以便使用。

### 添加网站

点击上方菜单的「设置」，添加网站，输入网站名称和网址保存即可。

### 获取跟踪代码

添加完成后，点击编辑 - 跟踪代码获取页面埋点链接。将该链接添加到您网站的页面头部或底部即可。

### 验证安装

添加完成后可以在网站右击审查元素查看是否有跟踪代码。如果有的话就代表正确添加了，您就可以在 Umami 中查看网站的访问数据了。

## 主要优势

### 与传统统计工具对比

| 特性 | Umami | Google Analytics | 百度统计 |
|:---|:---:|:---:|:---:|
| **开源免费** | ✅ | ❌ | ❌ |
| **隐私保护** | ✅ | ❌ | ❌ |
| **数据自主** | ✅ | ❌ | ❌ |
| **轻量快速** | ✅ | ❌ | ❌ |
| **界面简洁** | ✅ | ❌ | ❌ |
| **学习成本** | 低 | 高 | 中 |

### 核心功能

- 📊 **实时统计**：实时显示网站访问数据
- 👥 **用户分析**：独立访问者、会话统计
- 📄 **页面统计**：各页面访问量排名
- 🌍 **来源分析**：用户来源网站统计
- 📱 **设备统计**：桌面/移动设备分布
- 🌏 **地理位置**：访问者地理信息分析

## 最佳实践

### 安全配置

1. **修改默认密码**：首次登录后立即修改
2. **启用 HTTPS**：使用 SSL 证书保护数据传输
3. **限制访问**：通过防火墙限制访问来源
4. **定期备份**：设置数据库自动备份

### 性能优化

1. **资源限制**：为容器设置合理的内存和 CPU 限制
2. **数据库优化**：针对高流量调优 PostgreSQL 配置
3. **监控告警**：设置服务健康检查和告警机制

## 总结

Umami 作为一款优秃的开源网站统计工具，为个人和企业用户提供了一个简单、高效、隐私友好的网站数据分析解决方案。

### 主要优势

- ✅ **完全开源**：无使用限制，可自由定制
- ✅ **隐私保护**：数据完全由您控制，不依赖第三方
- ✅ **部署简单**：支持 Docker 一键部署
- ✅ **界面美观**：现代化的响应式设计
- ✅ **性能优秀**：轻量级，资源占用少

{% note success %}
通过本文的详细指南，您应该能够成功部署并使用 Umami 来监控您的网站数据。建议在正式使用前进行充分测试，确保所有功能正常工作。
{% endnote %}

## 相关资源

- [Umami 官方网站](https://umami.is/)
- [Umami 官方文档](https://umami.is/docs/)
- [Umami GitHub 仓库](https://github.com/umami-software/umami)
- [Docker 官方文档](https://docs.docker.com/)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)