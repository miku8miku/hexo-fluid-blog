# 起因
最近在使用jsdeliver的CDN服务，但是发现图片访问报错，经过一番排查，发现是CDN的域名配置问题。

# 解决方法

https://cdn.bili33.top

cdn.jsdelivr.net 国内无法访问的替代加速域名网址

替代域名
下面提供一些可替代 cdn.jsdelivr.net 的地址。

- jsd.cdn.zzko.cn

- jsd.onmicrosoft.cn

- testingcf.jsdelivr.net
- quantil.jsdelivr.net
- fastly.jsdelivr.net

- jsdelivr.b-cdn.net
- jsdelivr.codeqihan.com
- jsd.duolaa.top    

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


使用方法
如果是 GitHub 的网址，需要先转换成 jsdelivr 地址。

GitHub 原地址：

https://raw.githubusercontent.com/用户名/仓库名/main/json/config.json

拼接转换后 jsdelivr 地址：

https://cdn.jsdelivr.net/gh/用户名/仓库名@main/json/config.json

然后使用上述任一地址替换 cdn.jsdelivr.net 部分即可。

从 GitHub 迁移到 jsDelivr

jsDelivr 是适用于 npm 和 GitHub 的免费、快速且可靠的开源 CDN。大多数 GitHub 链接都可以轻松转换为 jsDelivr 链接。

https://www.jsdelivr.com/github
