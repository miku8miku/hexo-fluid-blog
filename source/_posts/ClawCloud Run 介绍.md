---
title: ClawCloud Run 云开发平台使用指南
date: 2025-04-15 11:00:00
index_img: https://pic1.imgdb.cn/item/68e877a5c5157e1a8860c5d5.png
category: 技术教程
tags:
  - 云服务
  - 容器部署
  - ClawCloud
  - ASF
  - 云开发平台
math: false
mermaid: true
# sticky: 1 # 置顶
---

> ClawCloud 是一家新加坡的主机服务商，最近推出了 ClawCloud Run 服务，这是一个集成在线开发、测试和生产环境的云开发平台。对于注册时长大于 180 天的 GitHub 用户，每个月提供免费的 5 美元余额。最重要的是，不需要绑卡、KYC 等涉及隐私的操作。

<!-- more -->

## 📋 服务介绍

ClawCloud Run 是一个现代化的云开发平台，集成了在线开发、测试和生产环境，为开发者提供了便捷的容器化部署解决方案。

### 🎁 免费额度

{% note primary %}
**Free $5 credits first month by signing up - No credit card required. 180-day GitHub users unlock $5 free every month.**
{% endnote %}

- **新用户首月**：免费获得 $5 信用额度
- **GitHub 老用户**：注册时长大于 180 天的 GitHub 用户每月可获得 $5 免费额度
- **无隐私风险**：无需绑定信用卡或进行 KYC 身份验证

### 📊 流量限制

虽然每月有 $5 的免费额度，但免费用户每月仅有 10G 的免费流量：

- **免费流量**：每月 10G
- **超出费用**：$0.05/G，从免费额度中扣除

因此，ClawCloud Run 特别适合部署一些对流量要求不高的容器应用，如：

- 🤖 **ASF (ArchiSteamFarm)**：Steam 挂卡工具
- 📁 **AList**：多功能文件列表程序
- 🐍 **青龙面板**：定时任务管理平台
- 🌐 **其他轻量级应用**

## 🚀 部署教程

### 第一步：注册账户

1. 前往官网 [ClawCloud Run](https://console.run.claw.cloud/signin?link=1VRUPP1EJJSN) 注册账户
2. 推荐使用注册时间超过 180 天的 GitHub 账号直接登录，省去绑定账号的麻烦
3. 注册后选择区域，推荐选择日本或新加坡等距离较近的数据中心

1. **注册账户**
   - 前往官网 ClawCloud Run https://console.run.claw.cloud/signin?link=1VRUPP1EJJSN注册账户（含AFF，介意自行删除）。
   - 推荐使用注册时间超过 180 天的 GitHub 账号直接使用GitHub方式登录，省去绑定账号的麻烦。
   - 注册后会要求选择区域，并且可以后续可以随意更改。推荐选择日本或者新加坡等距离较近的数据中心。

### 第二步：创建应用

进入控制台，依次点击 **App Launchpad** → **Create App**，按以下说明填写配置：

1. **Application Name**：任意填写
2. **Image**：`justarchi/archisteamfarm`
3. **Usage**：
   - CPU 选择 0.1
   - 内存推荐 256M
4. **Network**：
   - Container Port 输入 `1242`
   - 勾选 **Enable Internet Access**
5. **Local Storage**：
   - 点击 **Add**
   - Mount Path 输入 `/app/config`
   - 如果后期需要安装插件，也要同时挂载 `/app/plugins`

填写完成后点击 **Deploy Application**。

{% note info %}
按照上述设置，每天费用约为 $0.04，30 天的费用仅为 $1.2，完全足够运行 ASF 应用。
{% endnote %}

![创建容器设置（上）](https://raw.githubusercontent.com/miku8miku/picture/main/2025/10/upgit_20251011_1760169713.png)

![创建容器设置（下）](https://raw.githubusercontent.com/miku8miku/picture/main/2025/10/upgit_20251011_1760169739.png)

## 💾 上传配置文件

### 等待部署完成

1. 等待容器完成部署，Pod List 中的 STATUS 显示为 **Active**
2. 点击 **Logs**，观察到如下输出则表示 ASF 部署成功：

```log
2025-04-15 11:02:22|ArchiSteamFarm-18|WARN|ASF|RegisterBots() No bots are defined. Did you forget to configure your ASF? Follow 'setting up' guide on the wiki if you're confused.
```

### 创建配置文件

在本地电脑上新建两个文件，用于开启 ASF 的远程访问：

{% note warning %}
**安全提醒**：为了账号安全，请不要使用弱密码！
{% endnote %}

#### ASF.json

```json
{
  "Headless": true,
  "IPCPassword": "ASF密码"
}
```

#### IPC.config

```json
{
  "Kestrel": {
    "Endpoints": {
      "HTTP": {
        "Url": "http://*:1242"
      }
    }
  }
}
```

### 上传文件

1. 点击 Pod List 栏的文件夹图标
2. 将保存好的文件上传至 `/app/config` 路径

![上传配置文件](https://raw.githubusercontent.com/miku8miku/picture/main/2025/10/upgit_20251011_1760169769.png)

### 重启容器

1. 上传完成后，点击 **Restart**
2. 等待 ASF 重启完成
3. 当 STATUS 变为 **Active** 后，点击 Network 栏的 **Public Address** 地址即可成功访问

![访问 ASF](https://raw.githubusercontent.com/miku8miku/picture/main/2025/10/upgit_20251011_1760169787.png)

## 🌐 自定义域名

如果需要使用自定义域名访问您的应用：

1. 点击 **Manage Network** → **Custom Domain**
2. 将自己的域名添加一条 CNAME 记录，指向提示的地址即可

## 📝 总结

至此，ASF 已经在 ClawCloud Run 上成功运行。如果需要修改其他配置，请参考 [ASF 官方 WIKI](https://github.com/JustArchiNET/ArchiSteamFarm/wiki) 进行修改。

### 优势总结

1. **免费额度**：每月 $5 免费额度，足够运行轻量级应用
2. **隐私保护**：无需绑卡和 KYC 验证
3. **简单易用**：直观的控制台界面，快速部署容器应用
4. **全球节点**：多个数据中心可选，优化访问速度
5. **按需计费**：根据实际使用量计费，避免资源浪费

### 适用场景

- 🎮 **游戏工具**：Steam 挂卡、游戏机器人等
- 📁 **文件管理**：个人网盘、文件分享服务
- ⏰ **定时任务**：自动化脚本、定时任务执行
- 🧪 **开发测试**：临时环境部署、应用测试

### 注意事项

{% note warning %}
**重要提醒**：
- 注意每月流量限制，避免产生额外费用
- 定期备份重要配置文件
- 使用强密码保护应用安全
- 关注账户余额，及时充值避免服务中断
{% endnote %}

## 📚 相关资源

- [ClawCloud Run 官网](https://console.run.claw.cloud/)
- [ASF 官方文档](https://github.com/JustArchiNET/ArchiSteamFarm/wiki)
- [AList 项目地址](https://github.com/Xhofe/alist)
- [青龙面板项目地址](https://github.com/whyour/qinglong)

---

通过以上步骤，您可以轻松在 ClawCloud Run 上部署各种容器化应用，享受免费额度带来的便利，同时确保应用的安全性和稳定性。