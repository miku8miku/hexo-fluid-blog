---
title: 搭建 CPA 配合 CC-Switch 使用 Codex 与 Claude Code
date: 2026-09-13 17:00:00
tags:
  - AI
  - Codex
  - Claude Code
  - CPA
  - CLIProxyAPI
  - CC-Switch
  - 大模型
  - 效率工具
categories:
  - AI开发
  - 效率工具
index_img: https://pic1.imgdb.cn/item/69ce82e86ccec478dfad2a2d.png
description: 详细记录如何利用 CLIProxyAPI (CPA) 本地代理与 CC-Switch 助手，完成服务配置与模型映射，在 Codex 与 Claude Code 中流畅使用 GPT 模型的完整工作流。
copyright: true
---

一、下载CPA
1、CPA就是CliProxyAPI的简称 我们可以通过github搜索CLIProxyAPI 或者直接访问下面的链接进入仓库[GitHub - router-for-me/CLIProxyAPI: Wrap Gemini CLI, Antigravity, ChatGPT Codex, Claude Code as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemini 3.1 Pro, GPT 5.5, Claude model through API · GitHub](https://github.com/router-for-me/CLIProxyAPI)
2、点击Releases

![image](https://r2.miku2024.top/r2/2026/09/bfb65b67f738614be07e2849be9f051a.png)



3、下载程序 CLIProxyAPI_版本号_windows_amd64.zip

![image](https://r2.miku2024.top/r2/2026/09/88f0abad0fcc2d8628b0792ee428af05.png)


4、解压

![image](https://r2.miku2024.top/r2/2026/09/f446c1127be9ca967f93cbb7871c504d.png)


5、将解压出来的文件夹拷贝到D盘根目录

![image](https://r2.miku2024.top/r2/2026/09/abaf4c0ee4e456b69167af3c5afeba20.png)


6、右键 点击发送到桌面快捷方式

![image](https://r2.miku2024.top/r2/2026/09/e607304101c6b94577ef6ad847c55183.png)


7、桌面快捷方式重命名

![image](https://r2.miku2024.top/r2/2026/09/9a5d6480472c6721adc14cae058b9203.jpeg)


8、配置CPA密码，右键CPA打开文件所在位置，复制一份config.example.yaml 然后粘贴重命名为config.yaml 如果你看不见yaml也没有关系，因为你的文件扩展名显示没有打开

![image](https://r2.miku2024.top/r2/2026/09/50db5a15782fa758e746be98d1a826c9.png)


9、配置CPA的访问密码
右键config.yaml选择打开方式，选择其他应用，选择用记事本打开，找到secret-key设置为123456 记得保存。并记下有个port:8317 ，这个8317就是CPA的端口

![image](https://r2.miku2024.top/r2/2026/09/45cb9317edc03df9b8c41be9b65c9df0.png)


10、双击桌面快捷方式CPA运行

![image](https://r2.miku2024.top/r2/2026/09/c09f779e1f059414159fd7020bc26c86.png)


11、打开浏览器Edget或者Google，我自己喜欢使用Google浏览器。输入以下地址
http://127.0.0.1:8317/management.html 然后点击回车跳转到这个页面

![image](https://r2.miku2024.top/r2/2026/09/e7d1dadb400ffeda903fe19b88c63f95.png)


12、输入密码123456 进入主页面

![image](https://r2.miku2024.top/r2/2026/09/8102768e8f2975765d36bf3a5f75ffc9.jpeg)


13、点击配置面板，进入配置面板

![image](https://r2.miku2024.top/r2/2026/09/2e8aa6976d380819eeb9b6f90e640f15.jpeg)


14、配置密钥。点击认证配置，把默认3个密钥删除

![image](https://r2.miku2024.top/r2/2026/09/200d3721e3c820e811ebf2f0c7947e30.png)


点击添加API密钥->点击生成->点击添加。这里生成的sk-密钥字符串就是我们后面要用的密钥

![image](https://r2.miku2024.top/r2/2026/09/2c2692776bfed6cf7b2625dbe04e661d.png)


密钥不用记，我们可以复制

![image](https://r2.miku2024.top/r2/2026/09/1da0fa89345030f3f8ca7d6376836bab.png)


别忘记点击保存，每一步操作都要保存

![image](https://r2.miku2024.top/r2/2026/09/443afca8a33b11b4af015a093cfa6dbc.png)


15、系统配置 点击系统配置，进入网络配置，在代理url输入框输入[http://127.0.0.1:7897](http://127.0.0.1:7897/) 请注意这里特别重要。我这里使用的是Clash Verge默认端口是7897，如果你是使用其他的，但口号可能和我的不一样，但是这里一定要配置。
记得勾选商业模式

![image](https://r2.miku2024.top/r2/2026/09/eaf09ca786a2c7036bb161032f489014.png)


16、AI提供商，如果我们有openaikey就可以直接在这里配置。显然我们绝大数没有。所以这里不用管，了解即可

![image](https://r2.miku2024.top/r2/2026/09/1f39ba56084239f3c9d9cb1f659712a5.png)


17、登录GPT账号。点击OAuth登录，点击开始Codex登录，点击打开链接

![image](https://r2.miku2024.top/r2/2026/09/015a77d27dbc41d345989023d1dc9080.png)


18、登录GPT账号，这里就输入我们获取到的GPT账号，请使用plus以上的，免费会弹add phone.如何获取免费plus，截至5月6号23点前，可以看我上一个帖子。

![image](https://r2.miku2024.top/r2/2026/09/d4e9c362ddd5106c5cd988da1f526541.png)


19、登录成功后，点击认证文件，就可以看到刚才登录成功获取到的账号信息

![image](https://r2.miku2024.top/r2/2026/09/153117a7e377aa8efdf68e185ed7e50d.png)


20、查看行号额度。点击配合管理，点击刷新全部凭证。如果获取到了额度，说明CPA配置对了。如果不能获取，请检查代理url填写是否正确

![image](https://r2.miku2024.top/r2/2026/09/efd99f1e7198c1279dadf516e2ad097d.png)


到这里，CPA配置完成。



二、下载CC-Switch
1、同样在github搜索cc-switch或者直接访问下面的仓库链接
[GitHub - farion1231/cc-switch: A cross-platform desktop All-in-One assistant tool for Claude Code, Codex, OpenCode, openclaw & Gemini CLI. · GitHub](https://github.com/farion1231/cc-switch)

![image](https://r2.miku2024.top/r2/2026/09/a7b9d17f8a4ef6d942a3019889c8a6cb.png)


2、一直滚动找到下面页面点击show all

![image](https://r2.miku2024.top/r2/2026/09/d95b26c5387eb6990ee4a9c5369d38ba.png)


3、下载安装CC-Switch-版本号-Windows.msi

![image](https://r2.miku2024.top/r2/2026/09/bf71465b309884f6ab59081fea67a2ba.png)


4、双击傻瓜式一路安装

![image](https://r2.miku2024.top/r2/2026/09/06fe35e8e3a972afa2fce6c797c4fbdf.png)



![image](https://r2.miku2024.top/r2/2026/09/f6b6df5a5b6e76d6a50e7ae32ad8273f.jpeg)



三、配置CC-Switch
1、双击应用进入

![image](https://r2.miku2024.top/r2/2026/09/9c714318016568653283d60b98a4e96c.jpeg)


2、选择Codex

![image](https://r2.miku2024.top/r2/2026/09/6d7e7f4c55ed0fa363a3b00a6305678f.jpeg)


3、点击右上角的

![image](https://r2.miku2024.top/r2/2026/09/04b235078680884bba3076d26eda6f36.png)


4、默认，往下滚动

![image](https://r2.miku2024.top/r2/2026/09/7f5a058685258dda8332b15d2db1658d.png)


5、配置供应商名称 API Key:就是CPA里配置的密钥。API请求地址，就是CPA的请求地址：
http://127.0.0.1:8317/v1 不要问为什么，我们新手，照葫芦画瓢输入就行。然后继续向下滚动

![image](https://r2.miku2024.top/r2/2026/09/892f413a2e64aee5c92d508e598c39a0.png)


6、点击获取模型，如果出现下图，说明配置成功

![image](https://r2.miku2024.top/r2/2026/09/0331441f6b89fdaad9a77c5d186d4137.png)


7、先择要使用的模型，然后继续往下滚动

![image](https://r2.miku2024.top/r2/2026/09/a1d553c2bdcd93e8456cbc02aa4d01db.png)


8、1M上下文 确认写入配置，检查是否开启权限

![image](https://r2.miku2024.top/r2/2026/09/18cf6894e49dd330efda89b2dc9a84f0.png)


参考备份：
model_provider = “custom”
model = “gpt-5.5”
model_reasoning_effort = “xhigh”
disable_response_storage = true
sandbox_mode = “danger-full-access”
approval_policy = “never”
model_context_window = 1000000
model_auto_compact_token_limit = 900000
9、启用自定义配置

![image](https://r2.miku2024.top/r2/2026/09/7f9e7a46bd4bf05a1a2a6cea977c4de2.png)


10、点击测试，测试链接

![image](https://r2.miku2024.top/r2/2026/09/33bede3bc5e32503d4b4dc40c0a81482.png)



![image](https://r2.miku2024.top/r2/2026/09/96d28f33b86b8533eb1d4321f273c6e7.jpeg)


出现如下图提示代表正常

![image](https://r2.miku2024.top/r2/2026/09/d401a00a19617ea2d350aaa833a6ee20.png)


11、删除默认配置

![image](https://r2.miku2024.top/r2/2026/09/0bea2aaf283ebe2f7c51fe1d16a999e6.jpeg)


12、开启路由

![image](https://r2.miku2024.top/r2/2026/09/67fbd1fb535d6e63cf41da505b5b5e7d.png)



![image](https://r2.miku2024.top/r2/2026/09/82ca0f08cfbb6192485779994416024b.png)



四、配置Claude Code 访问GPT

![image](https://r2.miku2024.top/r2/2026/09/f06325ce330393ed66c31621cd303b5d.jpeg)


1、默认

![image](https://r2.miku2024.top/r2/2026/09/e367990df87d95f200246a343b981d02.png)


2、配置供应商名称 API Key 就是CPA的密钥。请求地址输入[http://127.0.0.1:8317](http://127.0.0.1:8317/)

![image](https://r2.miku2024.top/r2/2026/09/3fdca9afd05050fd3dcfa2723af5630e.png)


3、高级配置

![image](https://r2.miku2024.top/r2/2026/09/da7c22991a3ff42b270797b43058cd52.png)


4、点击获取模型

![image](https://r2.miku2024.top/r2/2026/09/25ccd7636cc8c98d5a5fac8549a04fb1.png)


5、映射模型配置

![image](https://r2.miku2024.top/r2/2026/09/4fa0a8226eb3e215dc850adfe5897826.png)


6、点击添加

![image](https://r2.miku2024.top/r2/2026/09/3e1ff45ddac591e7765e9e53afeeea06.png)


7、点击启用

![image](https://r2.miku2024.top/r2/2026/09/1e1c89c0fe7cefd58b94c2d4b7068b51.jpeg)


8、测试

![image](https://r2.miku2024.top/r2/2026/09/14f1f3be879c98a8285b81349b433a3a.png)


9、删除默认

![image](https://r2.miku2024.top/r2/2026/09/f87564c64c28921d6af9463b31d466f6.jpeg)



五、登录Codex
1、退出登录账号

![image](https://r2.miku2024.top/r2/2026/09/f8ccb6cee89798b65820bd206f42391f.png)


2、选择选中方式登录

![image](https://r2.miku2024.top/r2/2026/09/7a2c477f2a2cf6229d83a96ed0f6521a.png)


3、设置CPA 密钥，点击继续

![image](https://r2.miku2024.top/r2/2026/09/598cd63b2632ff285394685f2f12fe4d.png)


4、点击使用

![image](https://r2.miku2024.top/r2/2026/09/e83844a82c1aa76c8ac574f35ba887b0.jpeg)


5、测试 输入你好测试

![image](https://r2.miku2024.top/r2/2026/09/4b286416594c7757294fabf8e965d18d.png)



六、Claude Code 配置
1、打开Claude Code或者退出Claude Code.
鼠标点击左上角的 按钮 选择help 选择troubleshooting 选择enable developer mode

![image](https://r2.miku2024.top/r2/2026/09/6324151c1970d1e53f30660421bc3572.png)


2、启用

![image](https://r2.miku2024.top/r2/2026/09/6d0b665773399f5ee3a35d73f91b8899.png)


3、选择developer->选择config third party

![image](https://r2.miku2024.top/r2/2026/09/7d08977de43dccc03a76818876922860.png)


4、进入配置

![image](https://r2.miku2024.top/r2/2026/09/f869a014473fe01dd75ca996ee7b15d0.png)


5、获取base-url :[http://127.0.0.1:15721](http://127.0.0.1:15721/)

![image](https://r2.miku2024.top/r2/2026/09/8371b66888cf8a47032bdf2c185fe173.png)


6、填写base-url:[http://127.0.0.1:15721](http://127.0.0.1:15721/) API-KEY:PROXY_MANAGED

![image](https://r2.miku2024.top/r2/2026/09/624b94c840daa7c77f314d3fe5db08d2.png)


7、模型配置

![image](https://r2.miku2024.top/r2/2026/09/7e61c31e0c71b5cec1681d3d4ae8cb26.png)


8、重启

![image](https://r2.miku2024.top/r2/2026/09/7a3ed202b4b7411a65ee7837c6c157ed.png)


10、成功在Claude里使用GPT

![image](https://r2.miku2024.top/r2/2026/09/e768fa1d64bb2f288ab4680edff3927c.png)