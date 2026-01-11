---
title: 修改CDN地址解决图片访问报错
date: 2025-11-27 15:00:00
index_img: https://pic1.imgdb.cn/item/691543053203f7be00fb2f35.png
categories: 技术教程
tags:
  - CDN
  - jsDelivr
  - 图片访问
  - 网络问题
---

> 最近在使用jsDelivr的CDN服务时，发现图片访问报错，经过一番排查，发现是CDN的域名配置问题。本文将分享几种有效的解决方案。

<!-- more -->

# 起因

最近在使用jsDelivr的CDN服务时，发现图片访问报错，经过一番排查，发现是CDN的域名配置问题。在国内访问[jsDelivr](https://www.jsdelivr.com/)时，由于网络环境的限制，可能会出现访问不稳定或无法访问的情况。

# 解决方法

针对这个问题，我们可以使用一些国内可访问的替代域名来替换原有的CDN地址。

推荐使用的替代域名：

- `jsd.cdn.zzko.cn`
- `jsd.onmicrosoft.cn`
- `fastly.jsdelivr.net`
- `gcore.jsdelivr.net`
- `cdn.bili33.top`

其中，`cdn.bili33.top` 是一个较为稳定的国内加速域名：

```
https://cdn.bili33.top
```

## 替代域名列表

下面提供一些可替代 `cdn.jsdelivr.net` 的地址：

- jsd.cdn.zzko.cn
- jsd.onmicrosoft.cn
- testingcf.jsdelivr.net
- quantil.jsdelivr.net
- fastly.jsdelivr.net
- jsdelivr.b-cdn.net
- jsdelivr.codeqihan.com
- jsd.duolaa.top    
- cdn.bili33.top
- jsd.proxy.aks.moe
- cdn.jsdelivr.us
- purge.jsdelivr.net
- gcore.jsdelivr.net
- gh.776161.xyz
- originfastly.jsdelivr.net
- cdn.jsdmirror.com

## 使用方法

如果是 GitHub 的网址，需要先转换成 jsDelivr 地址。

GitHub 原地址：
```
https://raw.githubusercontent.com/用户名/仓库名/main/json/config.json
```

拼接转换后 jsDelivr 地址：
```
https://cdn.jsdelivr.net/gh/用户名/仓库名@main/json/config.json
```

然后使用上述任一地址替换 `cdn.jsdelivr.net` 部分即可。

例如，将：
```
https://cdn.jsdelivr.net/gh/username/repo@main/image.png
```

替换为：
```
https://cdn.bili33.top/gh/username/repo@main/image.png
```

## 从 GitHub 迁移到 jsDelivr

jsDelivr 是适用于 npm 和 GitHub 的免费、快速且可靠的开源 CDN。大多数 GitHub 链接都可以轻松转换为 jsDelivr 链接。

更多信息请访问：[jsDelivr GitHub 页面](https://www.jsdelivr.com/github)

# 总结

通过替换CDN域名的方式，可以有效解决因网络环境导致的图片访问问题。建议优先选择稳定性较好的国内加速域名，如 `cdn.bili33.top` 或 `fastly.jsdelivr.net`。