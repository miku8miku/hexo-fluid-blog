---
title: 用Cloudflare后获取真实的用户IP
date: 2026-1-12 14:43:00
index_img: https://pic1.imgdb.cn/item/6964611575db907620f560c0.png
tags: 
 -运维
 -cloudflare
 -IP地址
---


当我们为网站启用 **Cloudflare CDN（小橙云）** 后，所有访客流量都会先经过 Cloudflare 的全球网络节点，再转发到我们的源服务器。这就有个核心问题摆在面前────**服务器看到的所有请求都来自 Cloudflare 的 IP 地址，而不是真实的客户端 IP**

**这会导致：**

- **日志记录错误**：访问日志中全是 Cloudflare 的 IP
- **安全防护失效**：基于 IP 的访问控制、限流等功能失效
- **数据分析偏差**：无法准确统计访客地理位置等信息
- **应用功能异常**：依赖客户端 IP 的功能（如登录异常检测）无法正常工作

幸运的是，Cloudflare 在转发请求时，会在 **HTTP 头**中添加 **`CF-Connecting-IP`**，记录**真实的客户端 IP**。我们只要简单配置一下 Nginx，让它智能识别并使用这个请求头。

## 基于原理：**Nginx 的 RealIP 模块**
Nginx 内置了 `ngx_http_realip_module` 模块来处理这个问题。这个模块的功能是，从指定的 HTTP 头中提取真实 IP，并用它**覆盖 Nginx 内部的 `$remote_addr` 变量**。

其工作原理包含两个关键部分，缺一不可：

1. **信任代理 (`set_real_ip_from`)**: 定义一个或多个受信任的 IP 地址或地址段。Nginx 只会处理来自这些 IP 的请求头。这是至关重要的安全措施，可以防止恶意用户直接访问你的服务器并伪造 IP 请求头。接下来我们就是需要添加只信任来自 **Cloudflare IP 段**的请求
2. **指定头 (`real_ip_header`)**: 告诉 Nginx 去哪个 HTTP 头里寻找真实 IP。对于 Cloudflare，就是 **`CF-Connecting-IP`**。

当 Nginx 收到一个请求时，它会检查：

> “这个请求的来源 IP 是否在我的信任列表中？如果是，我就读取 `CF-Connecting-IP` 头，并用它的值作为真实 IP；如果不是，我就忽略这个头，保持来源 IP 不变。”

通过这个机制，我们就能安全、准确地恢复真实访客的 IP。

## 配置步骤

### 1️⃣创建配置文件并下载 Cloudflare 的 IP 地址范围

```bash
sudo touch /etc/nginx/conf.d/cloudflare-ips.conf
# IPv4
echo "# Cloudflare IPv4 ranges" | sudo tee /etc/nginx/conf.d/cloudflare-ips.conf > /dev/null
curl -s https://www.cloudflare.com/ips-v4 | sed 's/^/set_real_ip_from /' | sed 's/$/;/' | sudo tee -a /etc/nginx/conf.d/cloudflare-ips.conf > /dev/null

# IPv6
echo "" | sudo tee -a /etc/nginx/conf.d/cloudflare-ips.conf > /dev/null
echo "# Cloudflare IPv6 ranges" | sudo tee -a /etc/nginx/conf.d/cloudflare-ips.conf > /dev/null
curl -s https://www.cloudflare.com/ips-v6 | sed 's/^/set_real_ip_from /' | sed 's/$/;/' | sudo tee -a /etc/nginx/conf.d/cloudflare-ips.conf > /dev/null
```

如果一切正常，最终`/etc/nginx/conf.d/cloudflare-ips.conf`文件内容就像这样：



```nginx
# Cloudflare IPv4 ranges
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
... (更多IP段)
# Cloudflare IPv6 ranges
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
... (更多IP段)
```

当然，这个[**Cloudflare IP地址范围**](https://www.cloudflare.com/zh-cn/ips/)肯定会变的，不过我看最近一次更新还是2023 年 9 月 28 日；
也可以写一个定时脚本定期获取IP地址列表。

### 2️⃣编辑 `/etc/nginx/nginx.conf`，在 `http` 块中引入 Cloudflare IP 配置[#](https://blog.huan666.de/posts/get-real-user-ip-behind-cloudflare/#2编辑-etcnginxnginxconf在-http-块中引入-cloudflare-ip-配置)



```nginx
include /etc/nginx/conf.d/cloudflare-ips.conf;
```

### 3️⃣在站点配置文件的**`server`**模块中添加真实 IP 头



```nginx
real_ip_header CF-Connecting-IP;
```

**完整示例：**

**`/etc/nginx/nginx.conf`**文件：



```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    # 自动加载所有配置文件（推荐）
    include /etc/nginx/conf.d/*.conf;
    # 或者，如果想精确控制加载顺序：
	# include /etc/nginx/conf.d/cloudflare-ips.conf;
	# include /etc/nginx/conf.d/你的项目名.conf;
}
```

**`/etc/nginx/conf.d/你的项目名.conf`**：



```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 你的域名;

    # HTTPS强制重定向（如有证书，建议加上）
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    server_name 你的域名;

    # 从 Cloudflare 获取源客户端请求IP
    real_ip_header CF-Connecting-IP;

    # SSL 证书文件
    ssl_certificate /etc/nginx/ssl/Cloudflare公钥证书.pem;
    ssl_certificate_key /etc/nginx/ssl/私钥.key;

    # SSL/TLS 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    location / {
        proxy_pass http://127.0.0.1:端口号;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 日志、错误
    access_log /var/log/nginx/你的项目名.access.log;
    error_log /var/log/nginx/你的项目名.error.log warn;
}
```

### 4️⃣测试并应用配置



```nginx
# 测试配置语法
sudo nginx -t
# 热重载
sudo nginx -s reload
# 查看日志-访问IP
tail -f /var/log/nginx/你的项目名.access.log
```

