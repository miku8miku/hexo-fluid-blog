---
title: macOS 初始化设置指南
date: 2022-7-15 15:30:00
index_img: https://cdn.jsdelivr.net/gh/miku8miku/images@main/202510151037532.png
category: 技术教程
tags:
  - macOS
  - 系统配置
  - 开发环境
math: false
mermaid: false
---

> macOS 系统初始化设置指南，涵盖系统设置、软件配置和开发环境搭建，帮助你快速配置一台适合开发的 macOS 设备。

<!-- more -->

## 🖥️ 系统设置

### 实用命令

- 取消 4 位数密码限制

  ```bash
  pwpolicy -clearaccountpolicies
  ```

- 允许安装任意来源的 App

  ```bash
  sudo spctl --master-disable
  ```

- Xcode 命令行工具

  ```bash
  xcode-select --install
  ```

- 程序坞自动隐藏加速

  ```bash
  # 设置启动坞动画时间设置为 0.5 秒 
  defaults write com.apple.dock autohide-time-modifier -float 0.5 && killall Dock
  
  # 设置启动坞响应时间最短
  defaults write com.apple.dock autohide-delay -int 0 && killall Dock
  ```

  恢复：

  ```bash
  # 恢复启动坞默认动画时间
  defaults delete com.apple.dock autohide-time-modifier && killall Dock
  
  # 恢复默认启动坞响应时间
  defaults delete com.apple.Dock autohide-delay && killall Dock
  ```

### 个人习惯

#### 输入法

装个搜狗吧，官方的中文输入法有 BUG，会导致死机

[![16890781657024](https://image.liqiye.com/i/2024/01/22/wcmafz.png)](https://image.liqiye.com/i/2024/01/22/wcmafz.png)

#### 光标响应

重复率最快，延迟设置最低

[![16890781717456](https://image.liqiye.com/i/2024/01/22/we1vbb.png)](https://image.liqiye.com/i/2024/01/22/we1vbb.png)

#### 三指拖移

如果有触控板的话这个必开

[![16890781785848](https://image.liqiye.com/i/2024/01/22/weixz2.png)](https://image.liqiye.com/i/2024/01/22/weixz2.png)

## 💻 软件设置

### iTerm2

- 主题自带的 `Minimal` 不错
- [![image](https://image.liqiye.com/i/2024/01/22/x3jrnx.png)](https://image.liqiye.com/i/2024/01/22/x3jrnx.png)
- 新建一个自己的配置，并设置为默认 `Set as Default`，在新的配置里面可以进行字体相关的设置，字体大小我设置的是 `12 号`，使用的是 macOS 自带的 `Monaco` 字体[![img](https://image.liqiye.com/i/2024/01/22/xxyt7c-0.png)](https://image.liqiye.com/i/2024/01/22/xxyt7c-0.png)
- 一些窗口设置[![image-20240122210010224](https://image.liqiye.com/i/0/2024/01/22/yqcp6p-0.png)](https://image.liqiye.com/i/0/2024/01/22/yqcp6p-0.png)

## 🧑‍💻 开发配置

### Vim

macOS 自带的 vim 是没有任何配色的，可以搞点颜色

- 先在用户目录下新建一个 vim 的配置文件：

  ```bash
  vim ~/.vimrc
  ```

- 内容如下：

  ```vim
  set nu                " 显示行号
  colorscheme desert    " 颜色显示方案，其他方案查看：ls /usr/share/vim/vim*/colors 
  syntax on             " 打开语法高亮
  ```

### Node.js

主要用来跑 Hexo，又因为 Node.js 版本也比较凌乱，所以这里主要是通过 nvm 来进行配置管理。

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 新开个终端，输入下面命令，完善 zsh 补全配置
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 查看版本信息
zsh
nvm --version
0.39.7

# 查看当前 node 的版本
nvm version 

# 安装最新稳定版 node
nvm install stable

# 显示当前的版本
nvm current
```

{% note info %}
```bash
# 列出所有远程服务器的版本
nvm ls-remote

# 安装指定版本
nvm install v18.16.1
nvm install <version>

# 列出所有已安装的版本
nvm ls

# 卸载指定的版本
nvm uninstall <version>

# 切换使用指定的版本node
nvm use <version>
```
{% endnote %}

### Homebrew

Homebrew 是 macOS（或 Linux）缺失的软件包的管理器，开发必备神器，安装也比较简单（网络 OK 的情况）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，如果没有 brew 命令的话，就继续配置 zsh 环境变量（上面安装完会提示 COPY 运行即可）：

```bash
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/security/.zprofile
```

brew 常用软件推荐：

```bash
# 安装 brew-cask
brew install cask

# 空格预览 markdown
brew install qlmarkdown

# 空格高亮预览代码文件
brew install syntax-highlight
```

{% note info %}
brew 的基本使用：

```bash
# 更新 Homebrew
brew update

# 搜索相关的包
brew search [关键词] 

# 查看包的信息
brew info [软件名]

# 查看已安装的包
brew list

# 更新某个软件
brew upgrade [软件名]

# 清理所有软件的旧版
brew cleanup

# 卸载某个软件
brew uninstall [软件名]
```
{% endnote %}

### Oh My Zsh

Oh My Zsh 这个 zsh 美化增强脚本，来让自己的终端 Shell 颜值更逼格：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

[![16890783761892](https://image.liqiye.com/i/0/2024/01/22/z1tnp7-0.png)](https://image.liqiye.com/i/0/2024/01/22/z1tnp7-0.png)

- Zsh 插件推荐：

  ```bash
  # 目录切换神器
  ➜ brew install autojump
  
  # 自动建议提示接下来可能要输入的命令
  git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
  
  # 命令语法检测
  git clone https://github.com/zsh-users/zsh-syntax-highlighting $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
  ```

  在 `~/.zshrc` 中配置启用这些插件：

  ```bash
  plugins=(其他的插件...... autojump zsh-autosuggestions zsh-syntax-highlighting)
  ```

- 其他功能配置：

  ```bash
  # 关掉 URL 反斜杠转义
  echo "DISABLE_MAGIC_FUNCTIONS=true" >> ~/.zshrc
  
  # 禁用 on my zsh 自动更新
  echo " zstyle ':omz:update' mode disabled" >> ~/.zshrc
  ```

### Python

简单使用 iPython 还是建议装一下，平时调试会比较方便：

```bash
brew install ipython
```

不过个人还是建议使用 pyenv 来管理 Python。

pyenv 是一个强大 Python 包管理工具，可以灵活地切换各种 Python 版本，Linux 和 macOS 强烈建议使用 pyenv 来管理我们的 Python 版本，优雅高效且不会破坏掉系统自带的 Python 环境：

```bash
# 安装 pyenv
brew install pyenv
```

接着为 pyenv 配置 shell 环境，提高工作效率，可自动联想 Tab 补全我们本地安装的 Python 版本：

```bash
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

安装 Python 也很简单：

```bash
# 查看已经安装的Python版本
pyenv versions

# 查看当前的 Python 版本
pyenv version

# 查看可安装的版本
pyenv install -l

# 安装与卸载 pypy3.10-7.3.16
pyenv install pypy3.10-7.3.16
pyenv uninstall pypy3.10-7.3.16
```

版本切换确实很方便，所安装的版本都在 `~/.pyenv/versions` 目录下：

```bash
# global 全局设置 一般不建议改变全局设置
pyenv global <python版本>

# shell 会话设置 只影响当前的shell会话
pyenv shell <python版本>
# 取消 shell 会话的设置
pyenv shell --unset

# local 本地设置 只影响所在文件夹
pyenv local <python版本>
```

pyenv 的 global、local、shell 的优先级关系是：shell > local > global

## 🧩 一些我用不到的但是你可能用到的

### 启动台自定义行和列

```bash
# 设置列数
defaults write com.apple.dock springboard-columns -int 7

# 设置行数
defaults write com.apple.dock springboard-rows -int 6

# 重启 Dock 生效
killall Dock

# 恢复默认的列数和行数
defaults write com.apple.dock springboard-rows Default
defaults write com.apple.dock springboard-columns Default

# 重启 Dock 生效
killall Dock
```

### 防火墙

同时一些软件是破解版，屏蔽 Hosts 大法也太不优雅了，还是搞个正经的防火墙软件比较靠谱，国光这里主推：[Little Snitch](https://www.obdev.at/products/littlesnitch/download.html)

这个破解版不确定多不多，但是正版的序列号貌似可以多人复用，所以价格理论上也不贵的，师傅们可以自己去了解一下。[![16890783292455](https://image.liqiye.com/i/0/2024/01/22/z9m7tr-0.png)](https://image.liqiye.com/i/0/2024/01/22/z9m7tr-0.png)

### Git

如果要使用 Github 协作项目的话，那么 GitHub 会根据我们本地的 Git 配置去箱显示对应的 commit 记录的头像：

```bash
# 配置邮箱 
git config --global user.email "xxxxx@xxx.com"

# 配置用户名
git config --global user.name "张三"
```

### Java

无论是 [Oracle JDK](https://www.oracle.com/hk/java/technologies/downloads/) 还是近期比较流行的 [Azul Zulu JDK](https://www.azul.com/downloads/)，我们都可以先自己安装一遍，默认都在安装在

**/Library/Java/JavaVirtualMachines** 目录下：[![16902964292395](https://image.liqiye.com/i/0/2024/01/22/ywjlpn-0.png)](https://image.liqiye.com/i/0/2024/01/22/ywjlpn-0.png)

所以我们切换版本时候就不是很优雅，这里推荐使用 jevn 来切换我们的 Java 版本，类似于 pyenv 一样，很优雅：

```bash
# 安装 jenv
brew install jenv
```

brew 安装后我们得配置一下 zshrc 的环境：

```bash
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
```

然后新开个标签页即可正常使用 jenv 来管理我们的 Java 环境了，下面是 jenv 的基本使用：

```bash
# 查看当前的 Java 版本
jenv version

# 手动添加本地的 Java Home 路径
jenv add /Library/Java/JavaVirtualMachines/jdk-20.jdk/Contents/Home/
jenv add /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home/
jenv add /Library/Java/JavaVirtualMachines/jdk1.8.0_291.jdk/Contents/Home/
jenv add /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home/

# 列出目前 jenv 所有可切换管理的版本
jenv versions

#global 全局设置 一般不建议改变全局设置
jenv global <java 版本>

# shell 会话设置 只影响当前的shell会话
jenv shell <java 版本>
# 取消 shell 会话的设置
jenv shell --unset

# local 本地设置 只影响所在文件夹
jenv local <java 版本>
```

下面是简单的 jenv 使用演示效果图，真的很优雅：[![16902977603509](https://image.liqiye.com/i/0/2024/01/22/yyszty-0.png)](https://image.liqiye.com/i/0/2024/01/22/yyszty-0.png)

### MySQL

安装 MySQL：

```bash
# 搜索可以安装的版本
brew search mysql

# 安装对应的版本
brew install mysql@5.7

# 写入环境变量
echo 'export PATH="/opt/homebrew/opt/mysql@5.7/bin:$PATH"' >> ~/.zshrc

# 为了让编译器找到 mysql@5.7 还需要写入
echo 'export LDFLAGS="-L/opt/homebrew/opt/mysql@5.7/lib"' >> ~/.zshrc
echo 'export CPPFLAGS="-I/opt/homebrew/opt/mysql@5.7/include"' >> ~/.zshrc

# 为了让 pkg-config 找到 mysql@5.7 还需要写入
echo 'PKG_CONFIG_PATH="/opt/homebrew/opt/mysql@5.7/lib/pkgconfig"' >> ~/.zshrc
```

MySQL 服务相关：

```bash
# 查看 MySQL 服务状态
brew services info mysql@5.7
mysql.server status

# 启动 MySQL 服务
brew services start mysql@5.7
mysql.server start

# 重启 MySQL 服务
brew services restart mysql@5.7
mysql.server restart

# 停止 MySQL 服务
brew services stop mysql@5.7
mysql.server stop
```

接着初始化 MySQL 设置，主要配置一下 root 密码已经是否远程登录登，根据提示来操作就行了：

```bash
mysql_secure_installation
```

[![16890783845769](https://image.liqiye.com/i/0/2024/01/22/z3pdqe-0.png)](https://image.liqiye.com/i/0/2024/01/22/z3pdqe-0.png)

数据库外连，这是个可选操作 根据自己的实际情况自行决定是否开启（有被攻击的风险）：

```sql
mysql > grant all on *.* to root@'%' identified by '你设置的密码' with grant option;
mysql > flush privileges;
```

大家根据实际情况来决定是否开启外连。

### Redis

```bash
# 安装 redis
brew install redis

# 查看 redis 服务状态
brew services info redis

# 启动 redis 服务端
brew services start redis

# 启动 redis 客户端
redis-cli

# 编辑默认配置文件
sudo vim /opt/homebrew/etc/redis.conf
```

### proxychains-ng

终端命令行下代理神器，可以让指定的命令走设置好的代理，内网渗透、XX 上网必备工具：

```bash
# 安装
brew install proxychains-ng

# 配置文件
vim /opt/homebrew/etc/proxychains.conf
```

将结尾的 `socks4 127.0.0.1 9095` 改为我们自己的代理端口即可。

下面是常用的几个命令：

```bash
# 代理终端基本示例
proxychains4 curl https://www.google.com.hk

# 全局代理 bash shell
proxychains4 -q /bin/bash

# 全局代理 zsh shell
proxychains4 -q /bin/zsh
```

[![16890783936816](https://image.liqiye.com/i/0/2024/01/22/z5fj7m-0.png)](https://image.liqiye.com/i/0/2024/01/22/z5fj7m-0.png)如果发现你的 proxychains 并不能代理的话，尝试关掉 SIP 后再试试看。

### Gitbook

Gitbook 确实是一个写文档的神器，安装还是有坑的：就是使用高版本的 Node.js 安装会出各种玄学问题，换 10.X 的版本即可：

```bash
# 安装并切换老版本的 Node.js
nvm install v10.24.1
nvm use v10.24.1

# 安装苹果官方的 rosetta 兼容性工具
/usr/sbin/softwareupdate --install-rosetta --agree-to-license

# 安装 Gitbook-cli
npm install -g gitbook-cli

# 验证版本并安装相关依赖
gitbook -V
CLI version: 2.3.2
GitBook version: 3.2.3
```

### MkDocs

MkDoc 是有一个优雅的写文档神器，使用 Python 安装很方便：

```bash
# pyenv 切换合适的版本
pyenv local 3.9.17

# 安装 mkdocs
pip install mkdocs

# 安装 material 主题
pip install mkdocs-material
```

### Docker Desktop

```bash
# 使用 brew cask 可以很快的安装好 Docker 官方客户端
brew install --cask docker

# 跑个 Kali Linux 看看
docker pull docker.io/kalilinux/kali-rolling
docker run --name "KaliLinux" --tty --interactive kalilinux/kali-rolling
```

[![16890784023850](https://image.liqiye.com/i/0/2024/01/22/z774k4-0.png)](https://image.liqiye.com/i/0/2024/01/22/z774k4-0.png)

### OrbStack

[OrbStack](https://orbstack.dev/) 是一种在 macOS 上运行 Docker 容器和 Linux 机器的快速、轻便且简单的方法。可以将其视为强大的 WSL 和 Docker Desktop 替代方案，全部集成在一个易于使用的应用程序中。

```bash
# Homebrew Cask 安装更优雅一点
brew install orbstack

# docker 切换 OrbStack
docker context use orbstack
```

- Docker

  [![16890784106716](https://image.liqiye.com/i/0/2024/01/22/z7smxb-0.png)](https://image.liqiye.com/i/0/2024/01/22/z7smxb-0.png)

- Linux 子系统

  [![16890784158314](https://image.liqiye.com/i/0/2024/01/22/z85qxy-0.png)](https://image.liqiye.com/i/0/2024/01/22/z85qxy-0.png)

Docker 的一些镜像国内拉取很慢，我们可以配置一下一些国内的加速源：

```json
{
    "ipv6": true,
    "registry-mirrors": [
        "http://hub-mirror.c.163.com",
        "https://registry.docker-cn.com",
        "https://mirror.baidubce.com",
        "https://kn77wnbv.mirror.aliyuncs.com",
        "https://y0qd3iq.mirror.aliyuncs.com",
        "https://6kx4zyno.mirror.aliyuncs.com",
        "https://0dj0t5fb.mirror.aliyuncs.com",
        "https://docker.nju.edu.cn",
        "https://kuamavit.mirror.aliyuncs.com",
        "https://y0qd3iq.mirror.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

速度果然确快了很多：[![16890789523093](https://image.liqiye.com/i/0/2024/01/22/z8cx36-0.png)](https://image.liqiye.com/i/0/2024/01/22/z8cx36-0.png)

### Parallels Desktop

Parallels Desktop for mac Crack 18.1.1.53328 破解项目：https://git.icrack.day/somebasj/ParallelsDesktopCrack.git

根据教程下载指定版本的 PD：https://download.parallels.com/desktop/v18/18.1.1-53328/ParallelsDesktop-18.1.1-53328.dmg

正常安装好，先不要登录 PD 账号。接着克隆项目并运行自动化破解脚本：

```bash
# 克隆项目地址
git clone https://git.icrack.day/somebasj/ParallelsDesktopCrack.git

# 进项目文件夹并运行脚本
cd ParallelsDesktopCrack && chmod +x ./install.sh && sudo ./install.sh
```

破解过程还是很顺利的，Parallels Desktop 18 确实 YYDS：[![16890784223169](https://image.liqiye.com/i/0/2024/01/22/z8vhxp-0.png)](https://image.liqiye.com/i/0/2024/01/22/z8vhxp-0.png)

我们需要屏蔽以下的 Hosts：

```hosts
127.0.0.1 download.parallels.com
127.0.0.1 update.parallels.com
127.0.0.1 desktop.parallels.com
127.0.0.1 download.parallels.com.cdn.cloudflare.net
127.0.0.1 update.parallels.com.cdn.cloudflare.net
127.0.0.1 desktop.parallels.com.cdn.cloudflare.net
127.0.0.1 www.parallels.cn
127.0.0.1 www.parallels.com
127.0.0.1 www.parallels.de
127.0.0.1 www.parallels.es
127.0.0.1 www.parallels.fr
127.0.0.1 www.parallels.nl
127.0.0.1 www.parallels.pt
127.0.0.1 www.parallels.ru
127.0.0.1 www.parallelskorea.com
127.0.0.1 reportus.parallels.com
127.0.0.1 parallels.cn
127.0.0.1 parallels.com
127.0.0.1 parallels.de
127.0.0.1 parallels.es
127.0.0.1 parallels.fr
127.0.0.1 parallels.nl
127.0.0.1 parallels.pt
127.0.0.1 parallels.ru
127.0.0.1 parallelskorea.com
127.0.0.1 pax-manager.myparallels.com
127.0.0.1 myparallels.com
127.0.0.1 my.parallels.com
```

但是 Parallels Desktop 会很猥琐的去偷偷取消注释我们的 hosts 文件，所以我们一上来就安利的 Little Snitch 就很优雅，很有必要了。

最后发现 M1 下的 PD 虚拟机 120Hz 的 Windows 体验确实很丝滑：[![16890820228497](https://image.liqiye.com/i/0/2024/01/22/z91d8m-0.jpg)](https://image.liqiye.com/i/0/2024/01/22/z91d8m-0.jpg)

### 实用工具

- 命令增强

  ```bash
  # tree 命令列文件也很方便
  brew install tree
  
  # 查看系统状态信息
  brew install neofetch
  brew install fastfetch
  ```

- 网络相关

  ```bash
  # ip 命令 查看ip地址很方便
  ➜ brew install iproute2mac
  
  # frps 与 frpc 穿透神器
  brew install frps # 配置文件 frps -c /opt/homebrew/etc/frp/frps.ini
  brew install frpc # 配置文件 frpc -c /opt/homebrew/etc/frp/frpc.ini
  ```

- 媒体处理

  ```bash
  # 图片压缩使用开源的 imageoptim 很方便
  brew install imagemagick
  
  # you-get 数码下载神器
  brew install ffmpeg
  brew install you-get
  
  # 复制克隆离线镜像网站
  brew install httrack
  ```

### 安全工具

#### 主机探测

```bash
# 安装  nmap 与自带的 ncat 命令
brew install nmap

# 安装扫描速度更快的 masscan
brew install masscan

# 使用 ARP 协议来发现本地网络上的 IPv4 主机并指纹识别
brew install arp-scan
arp-scan --localnet
# 内容如下
Interface: en0, type: EN10MB, MAC: c8:89:f3:b3:24:1d, IPv4: 10.1.1.180
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
10.1.1.1    00:0c:29:7c:19:2f    VMware, Inc.
10.1.1.10    a0:36:9f:89:ad:30    Intel Corporate
10.1.1.11    00:0c:29:b1:fa:11    VMware, Inc.
10.1.1.100    00:11:32:fa:6e:7c    Synology Incorporated
10.1.1.218    a8:a1:59:9f:57:aa    ASRock Incorporation
10.1.1.128    ec:4d:3e:86:cb:2e    Beijing Xiaomi Mobile Software Co., Ltd
10.1.1.199    78:11:dc:7d:d5:9a    XIAOMI Electronics,CO.,LTD

# go 编写的快速高效的端口扫描工具
brew install naabu
```

#### 子域收集

```bash
# 快速被动子域枚举工具
brew install subfinder

# 新生代子域名检测工具
brew install findomain
```

#### SQL 注入

```bash
# 基本上 sqlmap 足够了
brew install sqlmap
```

#### 目录扫描

```bash
# 基本上 dirsearch 足够使用了
pip3 install dirsearch
```

#### 文件分析

```bash
# binwalk CTF MISC 神器
brew install binwalk

# EXIF 元数据信息查看
brew install exiftool
```

#### 移动安全

1. macOS 安装 adb

```bash
# brew 安装
brew install --cask android-platform-tools
```

#### 密码破解

```bash
# 密码破解神器
brew install hashcat

# 经典老牌的 UNIX 密码破解工具
brew install john

# WiFi 无线安全必备
brew install aircrack-ng
```

#### Metasploit

下载最新版本的安装包：https://osx.metasploit.com/metasploitframework-latest.pkg

安装很简单，双击 **metasploitframework-latest.pkg** 安装包，一步步往下安装就可以了，macOS 下手动升级 Metasploit 版本国光这里建议也这样升级，比较方便省心。

macOS 下 Metasploit 的可执行文件的位置为：`/opt/metasploit-framework/bin`，所以我们需要收到配置一下环境变量：

```bash
echo 'export PATH="$PATH:/opt/metasploit-framework/bin/"' >> ~/.zshrc
```

接着新开个终端即可正常识别到 msf 系列的命令了：

```bash
~ msfconsole
# 内容如下
** Welcome to Metasploit Framework Initial Setup **
   Please answer a few questions to get started.

# 输入 y 确定初始化一个新的数据库
Would you like to use and setup a new database (recommended)? y

# 认证信息保存在这里，我们了解一下就行
Writing client authentication configuration file /Users/security/.msf4/db/pg_hba.conf
```

[![16890785105921](https://image.liqiye.com/i/0/2024/01/22/ze9z6k-0.png)](https://image.liqiye.com/i/0/2024/01/22/ze9z6k-0.png)

#### Burp Suite

首先[官网下载](https://portswigger.net/burp/releases)截止 2023 年 07 月 09 日 最新的稳定版 2023.06.2：[![16890785208302](https://image.liqiye.com/i/0/2024/01/22/zefgh8-0.png)](https://image.liqiye.com/i/0/2024/01/22/zefgh8-0.png)

先正常安装打开的话是提示需要激活的，我们关掉 BP 先不管它。使用之前的 TrojanAZhen/BurpSuitePro-2.1 注册机并不能正常工作了，这是因为从 2022.9 开始提示 BP 官方换了注册机制，所以我们得使用新的注册机才可以。

新版注册机的地址为：[h3110w0r1d-y/BurpLoaderKeygen](https://github.com/h3110w0r1d-y/BurpLoaderKeygen)

下载下来，将其放入到 BP Jar 包的同级目录下：[![1689078526252](https://image.liqiye.com/i/0/2024/01/22/zeuwt3-0.png)](https://image.liqiye.com/i/0/2024/01/22/zeuwt3-0.png)

首先先带着注册机运行一下 BP：

```bash
cd /Applications/Burp\ Suite\ Professional.app/Contents/Resources/app && "/Applications/Burp Suite Professional.app/Contents/Resources/jre.bundle/Contents/Home/bin/java" "--add-opens=java.desktop/javax.swing=ALL-UNNAMED" "--add-opens=java.base/java.lang=ALL-UNNAMED" "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED" "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED" "--add-opens=java.base/jdk.internal.org.objectweb.asm.Opcodes=ALL-UNNAMED" "-javaagent:BurpLoaderKeygen.jar"  "-jar" "/Applications/Burp Suite Professional.app/Contents/Resources/app/burpsuite_pro.jar"
```

提示需要激活，先放这儿：[![16890785334135](https://image.liqiye.com/i/0/2024/01/22/zez7nt-0.png)](https://image.liqiye.com/i/0/2024/01/22/zez7nt-0.png)

另开一个终端，运行注册机：

```bash
/Applications/Burp\ Suite\ Professional.app/Contents/Resources/jre.bundle/Contents/Home/bin/java -jar /Applications/Burp\ Suite\ Professional.app/Contents/Resources/app/BurpLoaderKeygen.jar
```

像之前一样，常规走一下注册流程即可：[![16890785396644](https://image.liqiye.com/i/0/2024/01/22/zfcwjg-0.jpg)](https://image.liqiye.com/i/0/2024/01/22/zfcwjg-0.jpg)

但是不能每次启动都需要借助这两串命令行吧，这也太不优雅了，所以需要我们编辑 vmoptions.txt 文件，直接将之前的参数追加到 vmoptions.txt 后面：

```bash
echo "--add-opens=java.desktop/javax.swing=ALL-UNNAMED" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
echo "--add-opens=java.base/java.lang=ALL-UNNAMED" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
echo "--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
echo "--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
echo "--add-opens=java.base/jdk.internal.org.objectweb.asm.Opcodes=ALL-UNNAMED" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
echo "-javaagent:BurpLoaderKeygen.jar" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
echo "-Xmx2048m" >> /Applications/Burp\ Suite\ Professional.app/Contents/vmoptions.txt
```

效果如下：[![16890785469654](https://image.liqiye.com/i/0/2024/01/22/zfi27x-0.png)](https://image.liqiye.com/i/0/2024/01/22/zfi27x-0.png)

之后直接在应用程序里面启动 BP 就可以了，和官方正版使用毫无差别，优雅永不过时～[![16890785596406](https://image.liqiye.com/i/0/2024/01/22/zg053z-0.png)](https://image.liqiye.com/i/0/2024/01/22/zg053z-0.png)

#### 综合扫描

##### AWVS

使用 Docker 搭建 Acunetix Web Vulnerability Scanner（AWVS）扫描器的很方便的， 我的 M1 Macbook 测试也可以跑 x86 的 Dokcer 容器：

```bash
# 拉取 awvs 镜像
docker pull secfa/docker-awvs

# 将 容器的 3443 端口映射到 13443 端口
docker run -d --name "AWVS" -p 13443:3443 --cap-add LINUX_IMMUTABLE secfa/docker-awvs
```

搭建完成后访问：[https://YOUR_IP:13443/](https://your_ip:13443/) 即可

默认的用户名为：[admin@admin.com](mailto:admin@admin.com) 密码为：Admin123[![16890785645160](https://image.liqiye.com/i/0/2024/01/22/zg7knd-0.png)](https://image.liqiye.com/i/0/2024/01/22/zg7knd-0.png)

##### Nessus

Tenable Nessus® Essentials 是一款免费漏洞扫描程序，可作为漏洞评估的绝佳切入点。可获得无异于 Nessus Professional 订阅用户所享的强大扫描程序，支持扫描 16 个 IP 也足够我们个人使用了。

简而言之就是 Essentials 是 适用于教育工作者、学生以及网络安全领域的入门从业人员，功能和 Nessus Professional 没区别，只是批量扫描的 IP 变少了。

首先我们得使用企业域名注册获取激活码，注册地址：https://zh-cn.tenable.com/products/nessus/nessus-essentials

> 小 Tips：国内的 qq 和 163、gmail 这类大众域名多半是不行的，我这里使用的是 com 域名绑定的 QQ 邮箱注册的，这样很容易获取到激活码。

有激活码的话，Docker 搭建 Nessus 就简单很多了。

```bash
# 拉取镜像创建
docker pull tenableofficial/nessus

# 创建容器映射到宿主机的 8834 端口
docker run -d --name "Nessus"  -p 18834:8834 -e ACTIVATION_CODE=<你的激活码> -e USERNAME=<自定义用户名> -e  PASSWORD=<自定义密码>  tenableofficial/nessus
```

搭建完成后访问：[https://YOUR_IP:18834/](https://your_ip:18834/) 即可：[![16890817445667](https://image.liqiye.com/i/0/2024/01/22/zgnyul-0.jpg)](https://image.liqiye.com/i/0/2024/01/22/zgnyul-0.jpg)

访问出现没有出现 Nessus 界面？（移动网络可能会初始化识别，建议电信或者企业专线网络，或者挂代理或者软路由）

```bash
docker exec -it Nessus bash
cd /opt/scripts
./configure_scanner.py # 重新初始化操作
```

搭建好看了，看了可以看到我们的免费激活码支持做多 16 台设备，且插件都可以保持更新到最新版本，且激活码有效期有好几年呢，足够我们日常使用了：

##### OSV-Scanner

Google 新开源的漏洞扫描器，主要使用了 OSV-Scanner 来查找项目依赖漏洞。

漏洞来源全球各大漏洞库：

- https://github.com/github/advisory-database Github 安全公告
- https://github.com/pypa/advisory-database Python 的 pypy 安全公告
- https://github.com/golang/vulndb Go 的漏洞库
- https://github.com/RustSec/advisory-db Rust 的漏洞库
- https://github.com/cloudsecurityalliance/gsd-database 全球安全漏洞库
- https://github.com/google/oss-fuzz-vulns OSV 漏洞库
- …… 等

支持扫描自以下项目的漏洞：AlmaLinux、Alpine、Android、crates.io、Debian GNU/Linux、GitHub Actions、Go、Hex、Linux kernel、Maven、npm、NuGet、OSS-Fuzz、Packagist、Pub、PyPI、Rocky Linux、RubyGems……

使用细节大家可以参考官方文档：https://google.github.io/osv-scanner/usage/

这里只做简单的的使用：

```bash
osv-scanner -r /path/to/your/dir
```

[![16890827373626](https://image.liqiye.com/i/0/2024/01/22/zh7xk8-0.png)](https://image.liqiye.com/i/0/2024/01/22/zh7xk8-0.png)