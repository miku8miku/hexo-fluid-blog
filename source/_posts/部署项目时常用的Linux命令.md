---
title: Linux项目部署常用命令详解：从入门到实战
date: 2024-09-17 18:00:00
index_img: img/bg/linux-commands.png
category: 服务器运维
tags:
  - Linux
  - 运维
  - 部署
  - 命令行
  - 系统管理
math: false
mermaid: true
---

> 🐧 在Linux服务器上部署项目是每个开发者和运维工程师必备的技能。本文整理了项目部署过程中最常用的Linux命令，包括软件安装、防火墙配置、Vim编辑器使用、Nginx操作等核心操作，帮助你快速掌握Linux服务器管理的要点。

<!-- more -->

## 📦 软件包管理

### Ubuntu/Debian系列

Ubuntu系统使用`apt-get`作为包管理器：

```bash
# 更新软件包列表（必须先执行）
sudo apt-get update

# 升级已安装的软件包
sudo apt-get upgrade

# 安装软件包
sudo apt-get install 软件包名

# 安装上传下载工具
sudo apt-get install lrzsz

# 卸载软件包
sudo apt-get remove 软件包名
```

{% note warning %}
**重要提醒**：在执行`apt-get upgrade`命令之前，必须先执行`apt-get update`命令更新软件包列表。
{% endnote %}

## 🔥 防火墙配置

### Ubuntu系统（UFW）

```bash
# 启用防火墙
sudo ufw enable

# 开放端口
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# 查看开放的端口
sudo ufw status

# 关闭端口
sudo ufw delete allow 80

# 禁用防火墙
sudo ufw disable

# 重载防火墙
sudo ufw reload
```

{% note info %}
**UFW特点**：在Ubuntu系统中，修改防火墙规则后无需重启，配置立即生效。
{% endnote %}

### CentOS系统（Firewalld）

```bash
# 启动防火墙服务
sudo systemctl start firewalld

# 查看开放的端口
sudo firewall-cmd --list-ports

# 开放端口（永久）
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent

# 重载防火墙配置
sudo firewall-cmd --reload
# 或者使用
sudo systemctl reload firewalld

# 开机自启动
sudo systemctl enable firewalld

# 关闭防火墙
sudo systemctl stop firewalld

# 取消开机自启动
sudo systemctl disable firewalld
```

## ✏️ Vim编辑器使用

Vim是Linux系统中最强大的文本编辑器：

### 模式切换
```bash
# 从命令模式进入插入模式
i          # 在光标位置插入
a          # 在光标后插入
o          # 在下一行插入

# 从插入模式返回命令模式
Esc        # 按Esc键
```

### 文件操作
```bash
# 在命令模式下输入以下命令（需要按:开头）
:w         # 保存文件
:q         # 退出
:wq        # 保存并退出
:q!        # 强制退出（不保存）
:wq!       # 强制保存并退出
:x         # 保存并退出（同:wq）
```

### 编辑操作
```bash
# 复制粘贴
yy         # 复制当前行
nyy        # 复制n行（n为数字）
p          # 粘贴到光标下方

# 查找替换
/关键词     # 向下查找
?关键词     # 向上查找
n          # 下一个匹配项
N          # 上一个匹配项

# 实用设置
:set number        # 显示行号
:set nonumber      # 隐藏行号
:noh              # 取消搜索高亮
```

## 🌐 Nginx操作

以下命令适用于编译安装的Nginx：

```bash
# 测试配置文件语法
/usr/local/nginx/sbin/nginx -t

# 重载配置文件
/usr/local/nginx/sbin/nginx -s reload

# 启动Nginx
/usr/local/nginx/sbin/nginx

# 停止Nginx
/usr/local/nginx/sbin/nginx -s stop

# 优雅停止Nginx
/usr/local/nginx/sbin/nginx -s quit
```

### 使用systemctl管理（如果配置了服务）
```bash
# 启动Nginx服务
sudo systemctl start nginx

# 停止Nginx服务
sudo systemctl stop nginx

# 重启Nginx服务
sudo systemctl restart nginx

# 重载Nginx配置
sudo systemctl reload nginx

# 查看Nginx状态
sudo systemctl status nginx

# 开机自启动
sudo systemctl enable nginx
```

## 🔄 进程管理

### 后台运行程序

关闭SSH不会挂起程序的运行：

```bash
# 使用nohup后台运行Java程序
nohup java -jar application.jar > /dev/null 2>&1 &

# 指定日志文件
nohup java -jar application.jar > app.log 2>&1 &
```

{% note warning %}
**注意**：输入`exit`退出终端，不能直接关闭终端窗口。
{% endnote %}

### 进程查看和管理

```bash
# 查看所有进程
ps aux

# 查看特定程序的进程
ps aux | grep java
ps aux | grep nginx
ps aux | grep tomcat

# 实时查看进程
top

# 查看端口占用
netstat -tlnp
netstat -tlnp | grep 8080

# 终止进程
kill -9 PID

# 按名称终止进程
killall java
pkill -f "java.*application.jar"
```

## 📁 文件和目录操作

```bash
# 基本文件操作
pwd                    # 显示当前目录
ls -la                 # 详细列出文件
cd /path/to/directory  # 切换目录
mkdir dirname          # 创建目录
rmdir dirname          # 删除空目录
rm -rf dirname         # 强制删除目录及内容

# 文件操作
touch filename         # 创建空文件
cp source dest         # 复制文件
mv source dest         # 移动/重命名文件
rm filename           # 删除文件

# 查看文件内容
cat filename           # 显示全部内容
less filename          # 分页查看
head -n 20 filename    # 查看前20行
tail -n 20 filename    # 查看后20行
tail -f filename       # 实时查看文件变化
```

## 🛠️ 系统信息查看

```bash
# 系统信息
uname -a                # 系统信息
cat /etc/os-release     # 发行版信息
uptime                  # 系统运行时间
whoami                  # 当前用户

# 硬件信息
free -h                 # 内存使用情况
df -h                   # 磁盘使用情况
lscpu                   # CPU信息

# 网络信息
ifconfig                # 网络接口信息
ping google.com         # 测试网络连通性
```

## 📋 常用命令速查表

### 软件包管理
| 操作 | Ubuntu/Debian | CentOS/RHEL |
|:---|:---|:---|
| 更新包列表 | `apt-get update` | `yum update` |
| 安装软件 | `apt-get install pkg` | `yum install pkg` |
| 卸载软件 | `apt-get remove pkg` | `yum remove pkg` |

### 防火墙管理
| 操作 | Ubuntu (UFW) | CentOS (Firewalld) |
|:---|:---|:---|
| 启用防火墙 | `ufw enable` | `systemctl start firewalld` |
| 开放端口 | `ufw allow 80` | `firewall-cmd --add-port=80/tcp --permanent` |
| 查看状态 | `ufw status` | `firewall-cmd --list-ports` |
| 重载配置 | `ufw reload` | `firewall-cmd --reload` |

### Vim快捷键
| 操作 | 命令 | 说明 |
|:---|:---|:---|
| 插入模式 | `i` | 在光标位置插入 |
| 保存退出 | `:wq` | 保存并退出 |
| 强制退出 | `:q!` | 不保存强制退出 |
| 复制行 | `yy` | 复制当前行 |
| 粘贴 | `p` | 粘贴到光标下方 |

### 进程管理
| 操作 | 命令 | 说明 |
|:---|:---|:---|
| 查看进程 | `ps aux` | 显示所有进程 |
| 实时进程 | `top` | 实时显示进程 |
| 终止进程 | `kill -9 PID` | 强制终止进程 |
| 后台运行 | `nohup cmd &` | 后台运行命令 |

## 🎯 实战技巧

### 1. 一键部署脚本示例

```bash
#!/bin/bash
# deploy.sh - 简单的部署脚本

echo "开始部署应用..."

# 停止旧进程
pkill -f "application.jar"

# 备份旧文件
if [ -f "application.jar" ]; then
    mv application.jar application.jar.bak.$(date +%Y%m%d_%H%M%S)
fi

# 启动新应用
echo "启动新应用..."
nohup java -jar application.jar > app.log 2>&1 &

echo "部署完成！"
echo "查看日志：tail -f app.log"
```

### 2. 系统状态检查脚本

```bash
#!/bin/bash
# check_system.sh - 系统状态检查

echo "=== 系统状态检查 ==="
echo "时间：$(date)"
echo "系统负载：$(uptime | awk '{print $10,$11,$12}')"
echo "内存使用：$(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "磁盘使用：$(df -h / | tail -1 | awk '{print $5}')"
echo "========================"
```

## 📚 学习建议

1. **循序渐进**：先掌握基本命令，再学习高级用法
2. **多加练习**：在安全的测试环境中反复练习
3. **建立备忘录**：记录常用命令和参数
4. **学会查帮助**：使用`man`命令查看详细帮助
5. **自动化思维**：将重复操作写成脚本

## 📝 总结

掌握这些Linux命令对于项目部署和服务器管理至关重要。通过本文的整理，你应该能够：

- ✅ 熟练使用包管理器安装和管理软件
- ✅ 正确配置防火墙保护服务器安全
- ✅ 使用Vim编辑器进行文件编辑
- ✅ 管理Nginx等Web服务器
- ✅ 进行进程管理和后台运行
- ✅ 处理常见的系统管理任务

记住，Linux命令的学习是一个渐进的过程，多练习、多思考，逐步积累经验。建议在实际项目中反复使用这些命令，形成肌肉记忆，这样在需要的时候就能快速响应。

{% note success %}
**温馨提示**：在生产环境中执行任何操作前，务必先在测试环境验证，并做好数据备份。安全第一！
{% endnote %}