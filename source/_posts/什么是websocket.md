---
title: WebSocket 协议完全指南：从入门到实战
date: 2024-09-20 10:00:00
index_img: https://pic1.imgdb.cn/item/68cadc53c5157e1a88132d66.png
category: 技术教程
tags:
  - WebSocket
  - 网络协议
  - 实时通信
  - Node.js
  - JavaScript
  - 前端开发
math: false
mermaid: true
# sticky: 1 # 置顶
---

> 在现代 Web 开发中，实时双向通信已经成为不可或缺的需求。WebSocket 作为一种全新的网络通信协议，完美解决了传统 HTTP 协议在实时通信方面的不足。本文将从 WebSocket 的基本原理入手，带您深入了解这一强大的技术，并提供完整的实战案例。

<!-- more -->


### 什么是WebSocket

#### 定义

Websocket是一个持久化的网络通信协议，可以在单个 TCP 连接上进行`全双工通讯`，没有了`Request`和`Response`的概念，两者地位完全平等，连接一旦建立，客户端和服务端之间实时可以进行双向数据传输

#### 关联和区别

- **HTTP**

1. HTTP是非持久的协议，客户端想知道服务端的处理进度只能通过不停地使用 `Ajax`进行轮询或者采用 `long poll` 的方式来，但是前者对服务器压力大，后者则会因为一直等待Response造成阻塞 ![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2308134eee1949129438e15b945792b9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
2. 虽然http1.1默认开启了`keep-alive`长连接保持了这个`TCP通道`使得在一个HTTP连接中，可以发送多个Request，接收多个Response，但是一个request只能有一个response。而且这个response也是被动的，不能主动发起。
3. websocket虽然是独立于HTTP的一种协议，但是websocket必须依赖 HTTP 协议进行一次`握手`(在握手阶段是一样的)，握手成功后，数据就直接从 TCP通道传输，与 HTTP 无关了，可以用一张图理解两者有交集，但是并不是全部。 ![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93f1390c965f4bb28f97eeced69652d0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- **socket**

1. socket也被称为`套接字`，与HTTP和WebSocket不一样，socket不是协议，它是在程序层面上对传输层协议（可以主要理解为TCP/IP）的接口封装。可以理解为一个能够提供端对端的通信的调用接口（API）
2. 对于程序员而言，其需要在 A 端创建一个 socket 实例，并为这个实例提供其所要连接的 B 端的 IP 地址和端口号，而在 B 端创建另一个 socket 实例，并且绑定本地端口号来进行监听。当 A 和 B 建立连接后，双方就建立了一个端对端的 TCP 连接，从而可以进行双向通信。WebSocekt借鉴了 socket 的思想，为 client 和 server 之间提供了类似的双向通信机制

#### 应用场景

WebSocket可以做弹幕、消息订阅、多玩家游戏、协同编辑、股票基金实时报价、视频会议、在线教育、聊天室等应用实时监听服务端变化

### Websocket握手

- Websocket握手请求报文：

```makefile
makefile 体验AI代码助手 代码解读复制代码GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

下面是与传统 HTTP 报文不同的地方：

```makefile
makefile 体验AI代码助手 代码解读复制代码Upgrade: websocket
Connection: Upgrade
```

表示发起的是 WebSocket 协议

```makefile
makefile 体验AI代码助手 代码解读复制代码Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

**Sec-WebSocket-Key** 是由浏览器随机生成的，验证是否可以进行Websocket通信，防止恶意或者无意的连接。

**Sec_WebSocket-Protocol** 是用户自定义的字符串，用来标识服务所需要的协议

**Sec-WebSocket-Version**  表示支持的 WebSocket 版本。

- 服务器响应：

```makefile
makefile 体验AI代码助手 代码解读复制代码HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

**101 响应码** 表示要转换协议。

**Connection: Upgrade** 表示升级新协议请求。

**Upgrade: websocket** 表示升级为 WebSocket 协议。

**Sec-WebSocket-Accept** 是经过服务器确认，并且加密过后的 Sec-WebSocket-Key。用来证明客户端和服务器之间能进行通信了。

**Sec-WebSocket-Protocol** 表示最终使用的协议。

至此，客户端和服务器握手成功建立了Websocket连接，HTTP已经完成它所有工作了，接下来就是完全按照Websocket协议进行通信了。

### 关于Websocket

#### WebSocket心跳

可能会有一些未知情况导致SOCKET断开，而客户端和服务端却不知道，需要客户端定时发送一个`心跳 Ping` 让服务端知道自己在线，而服务端也要回复一个`心跳 Pong`告诉客户端自己可用，否则视为断开

#### WebSocket状态

WebSocket 对象中的readyState属性有四种状态：

- 0: 表示正在连接
- 1: 表示连接成功，可以通信了
- 2: 表示连接正在关闭
- 3: 表示连接已经关闭，或者打开连接失败

### WebSocket实践

#### 服务端接收发送消息

WebSocket的服务端部分，本文会以Node.js搭建

安装`express`和负责处理WebSocket协议的`ws`：

```
 体验AI代码助手
 代码解读
复制代码npm install express ws
```

安装成功后的package.json:

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6d06563f597411698f354acd4eda279~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

接着在根目录创建server.js文件:

```javascript
javascript 体验AI代码助手 代码解读复制代码//引入express 和 ws
const express = require('express');
const SocketServer = require('ws').Server;

//指定开启的端口号
const PORT = 3000;

// 创建express，绑定监听3000端口，且设定开启后在consol中提示
const server = express().listen(PORT, () => console.log(`Listening on ${PORT}`));

// 将express交给SocketServer开启WebSocket的服务
const wss = new SocketServer({ server });

//当 WebSocket 从外部连接时执行
wss.on('connection', (ws) => {
  //连接时执行此 console 提示
  console.log('Client connected');

  // 对message设置监听，接收从客户端发送的消息
  ws.on('message', (data) => {
    //data为客户端发送的消息，将消息原封不动返回回去
    ws.send(data);
  });

  // 当WebSocket的连接关闭时执行
  ws.on('close', () => {
    console.log('Close connected');
  });
});
```

执行node server.js启动服务，端口打开后会执行监听时间打印提示，说明服务启动成功

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c183ba66addf4e05ac592959ed9f88c6~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在开启WebSocket后，服务端会在message中监听，接收参数data捕获客户端发送的消息，然后使用send发送消息

#### 客户端接收发送消息

分别在根目录创建index.html和index.js文件

- index.html

```xml
xml 体验AI代码助手 代码解读复制代码<html>
  <body>
    <script src="./index.js"></script>
  </body>
</html>
```

- index.js

```ini
ini 体验AI代码助手 代码解读复制代码// 使用WebSocket的地址向服务端开启连接
let ws = new WebSocket('ws://localhost:3000');

// 开启后的动作，指定在连接后执行的事件
ws.onopen = () => {
  console.log('open connection');
};

// 接收服务端发送的消息
ws.onmessage = (event) => {
  console.log(event);
};

// 指定在关闭后执行的事件
ws.onclose = () => {
  console.log('close connection');
};
```

上面的`url`就是本机`node`开启的服务地址，分别指定连接（onopen），关闭（onclose）和消息接收（onmessage）的执行事件，访问html，打印ws信息

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cb22cc2e46c43a4bdf87f6095cb8d54~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

打印了`open connection`说明连接成功，客户端会使用`onmessage`处理接收

其中`event`参数包含这次沟通的详细信息，从服务端回传的消息会在event的data属性中。

手动在控制台调用`send`发送消息，打印event回传信息:

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c7d7bbb10d0464cbe37ddb4e5b36d21~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 服务端定时发送

上面是从客户端发送消息，服务端回传。我们也可以通过`setInterval`让服务端在固定时间发送消息给客户端:

server.js修改如下:

```javascript
javascript 体验AI代码助手 代码解读复制代码//当WebSocket从外部连接时执行
wss.on('connection', (ws) => {
  //连接时执行此 console 提示
  console.log('Client connected');

+  //固定发送最新消息给客户端
+  const sendNowTime = setInterval(() => {
+    ws.send(String(new Date()));
+  }, 1000);

-  //对message设置监听，接收从客户端发送的消息
-  ws.on('message', (data) => {
-    //data为客户端发送的消息，将消息原封不动返回回去
-    ws.send(data);
-  });

  //当 WebSocket的连接关闭时执行
  ws.on('close', () => {
    console.log('Close connected');
  });
});
```

客户端连接后就会定时接收，直至我们关闭websocket服务

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d17c7333f0a4c428b22e9bf85ab3781~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

#### 多人聊天

如果多个客户端连接按照上面的方式只会返回各自发送的消息，先注释服务端定时发送，开启两个窗口模拟：

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c770e9d0ebd415abeb5686bcfc31d0b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如果我们要让客户端间消息共享，也同时接收到服务端回传的消息呢？

我们可以使用`clients`找出当前所有连接中的客户端 ，并通过回传消息发送到每一个客户端 中：

修改server.js如下:

```javascript
javascript 体验AI代码助手 代码解读复制代码...

//当WebSocket从外部连接时执行
wss.on('connection', (ws) => {
  //连接时执行此 console 提示
  console.log('Client connected');

-  //固定发送最新消息给客户端
-  const sendNowTime = setInterval(() => {
-    ws.send(String(new Date()));
- }, 1000);

+  //对message设置监听，接收从客户端发送的消息
+   ws.on('message', (data) => {
+    //取得所有连接中的 客户端
+    let clients = wss.clients;
+    //循环，发送消息至每个客户端
+    clients.forEach((client) => {
+      client.send(data);
+    });
+   });

  //当WebSocket的连接关闭时执行
  ws.on('close', () => {
    console.log('Close connected');
  });
});
```

这样一来，不论在哪个客户端发送消息，服务端都能将消息回传到每个客户端 ： ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/007495393def4861a410d314a5b49a4e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp) 可以观察下连接信息: ![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a17ca22d9b1645e7a3f723b082e721fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcb4d122ba4c4445a4814041620a569e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 总结 🥇

**纸上得来终觉浅，绝知此事要躬行**，希望大家可以把理论配合上面的实例进行消化，搭好服务端也可以直接使用[测试工具](https://link.juejin.cn?target=http%3A%2F%2Fwww.easyswoole.com%2Fwstool.html)好好玩耍一波

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b05457faf0ba45f38fbc876f4bbc8585~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 参考文章 📜

❤️ [阮一峰-WebSocket 教程](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F05%2Fwebsocket.html)

❤️ [Using WebSockets on Heroku with Node.js](https://link.juejin.cn?target=https%3A%2F%2Fdevcenter.heroku.com%2Farticles%2Fnode-websockets)

❤️ [WebSocket 是什么原理？为什么可以实现持久连接？](