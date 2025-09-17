---
title: 修改SSH登录默认端口教程
date: 2024-09-17 15:30:00
index_img: img/bg/ssh.png
category: 系统运维
tags:
  - SSH
  - Linux
  - 安全配置
  - 系统管理
math: false
mermaid: false
---

> 🔐 为了提高服务器安全性，修改SSH默认端口22是一个重要的安全措施。本文将详细介绍如何安全地修改SSH登录端口。

<!-- more -->

## 📋 准备工作

在开始修改SSH端口之前，请确保：
- 拥有服务器的root权限
- 了解当前服务器的防火墙配置
- 准备好备用的服务器访问方式（如控制台访问）

{% note warning %}
**重要提醒：** 修改SSH端口前，请确保有其他方式访问服务器，避免因配置错误导致无法连接服务器。
{% endnote %}

## 🔧 修改SSH配置

### 步骤1：编辑SSH配置文件

使用root权限打开SSH配置文件：

```bash
vim /etc/ssh/sshd_config
```

### 步骤2：修改端口设置

在配置文件中找到以下行：
```bash
#Port 22
```

将其修改为：
```bash
Port 新端口号
```

{% note info %}
**建议：** 选择一个1024-65535之间的端口号，避免使用常见的端口号。
{% endnote %}

### 步骤3：重启SSH服务

保存配置文件后，重启SSH服务使配置生效：

```bash
systemctl restart sshd
```

## 🔥 配置防火墙

### 开放新端口

使用firewalld开放新的SSH端口：

```bash
firewall-cmd --zone=public --add-port=新端口号/tcp --permanent
```

### 重载防火墙配置

```bash
firewall-cmd --reload
```

### 验证端口开放状态

```bash
firewall-cmd --list-ports
```

## ✅ 测试连接

在关闭旧的SSH连接之前，请先测试新端口的连接：

```bash
ssh -p 新端口号 用户名@服务器IP
```

{% note success %}
**验证成功后**，可以考虑关闭22端口以提高安全性。
{% endnote %}

## 🔒 安全建议

1. **及时关闭默认端口**：确认新端口正常工作后，可关闭22端口
2. **使用密钥认证**：推荐使用SSH密钥代替密码认证
3. **限制root登录**：考虑禁用root直接SSH登录
4. **定期更换端口**：定期更换SSH端口可进一步提高安全性

## 📚 相关命令总结

| 操作 | 命令 |
|:---|:---|
| 编辑SSH配置 | `vim /etc/ssh/sshd_config` |
| 重启SSH服务 | `systemctl restart sshd` |
| 开放防火墙端口 | `firewall-cmd --zone=public --add-port=端口号/tcp --permanent` |
| 重载防火墙 | `firewall-cmd --reload` |
| 查看开放端口 | `firewall-cmd --list-ports` |

{% fold @故障排除 %}
如果遇到连接问题：
1. 检查防火墙是否正确开放了新端口
2. 确认SSH服务是否正常运行：`systemctl status sshd`
3. 查看SSH服务日志：`journalctl -u sshd`
4. 确认SELinux是否允许新端口：`semanage port -l | grep ssh`
{% endfold %}

通过以上步骤，您就可以成功修改SSH登录端口，提高服务器的安全性。记住，安全配置是一个持续的过程，建议定期检查和更新您的安全设置。