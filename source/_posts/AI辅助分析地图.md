---
title: AI 辅助分析高德地图逆向实战
date: 2026-04-22 23:39:00
index_img: https://pic1.imgdb.cn/item/69cd1fb00d45b9ceac3ed8ec.png
category: 逆向工程
tags:
  - 高德地图
  - AI辅助
  - 逆向工程
  - JSVMP
  - 设备指纹
math: false
mermaid: true
---

# 前言

为什么要分析高德地图呢？这个是因为本人在网页中进行搜索的时候，在不登录的情况下时不时会弹出登录页面，出于好奇就决定分析一手。

高德地图是典型的阿里体系安全防护机制，其中包含 **高度混淆**、**多层嵌套 VM**、**严格的设备指纹检测**、**JSVMP 技术** 等，如果想要成功分析出它的话，还是很考验操作者的逆向能力的，而且需要花费的时间是巨大的。

目前有了 AI 的存在，这些复杂的工作可以使用 AI 来辅助完成，你可以把自己想象成一个设计者，只要规定好最终的目标，并在适当的时候给予正确的指导即可。

话不多说，让我们一起分析一下，开干！

# 一、挑战：高德地图

## 1.1 设备指纹检测

设备指纹检测是 **通过收集浏览器、操作系统、硬件等多维度信息，生成唯一 ID 来识别设备的风控技术**。它旨在识别虚假设备（模拟器、Root/越狱），实现反欺诈、金融安全及风控。主要通过 SDK、JavaScript 采集特征，利用 AI 算法锁定设备并识别风险。

## 1.2 JSVMP

JSVMP（JavaScript Virtual Machine Protection，JS 代码虚拟化保护）是 **一种企业级的 JavaScript 代码高强度加密混淆技术**。

它通过 **将原始 JS 代码转换为一种特定的、自定义的字节码**，并在浏览器或 Node.js 中运行私有的解析器，使代码反编译和逆向分析极度困难，常用于保护 Web 应用的关键算法。

## 1.3 高度混淆

将代码中具有意义的变量名、函数名修改为无意义的符号（如 `a`、`_0x4a2b`）或动态生成变量值。

**目的**：使反编译后的代码难以理解，保护知识产权，防止恶意修改。

# 二、AI 辅助分析

## 2.1 接口信息

```http
GET https://www.amap.com/detail/get/detail?id={poi_id}
```

## 2.2 请求头参数

![请求头参数](https://cdn.bili33.top/gh/miku8miku/images@main/202604222339536.webp)

其中最核心的参数是 `bx-ua`，参数 `x-dc` 测试不携带虽然也能成功，但是这个参数也是必要的，因为服务端也会验 `x-dc` 参数，只不过你少量请求不封你而已。这里面有一点要特别说明：高德地图需要登录，不登录请求几次就会弹出登录界面，而且不登录情况下接口的 curl 请求可能重发一次就失效了。

`bx-ua` 参数是以 `231！` 开头的，这个特征明显是采用了阿里的安全防护机制。

## 2.3 JS SDK 加载链路

浏览器中的加载顺序：

![加载顺序](https://cdn.bili33.top/gh/miku8miku/images@main/202604222339361.webp)

关键调用链（main.js 中）：

![关键调用链](https://cdn.bili33.top/gh/miku8miku/images@main/202604222339900.webp)

## 2.4 bx-ua 生成分析

```javascript
fireyejs 加载后通过 AWSCInner.register("fyModule", "fy", TB) 注册模块。

通过 AWSC.configFYEx(callback, options, timeout) 初始化：
1. 内部调用 AWSC.use("fy", ...) 加载 fy 模块
2. 调用 fyObj.init(options, callback) 初始化环境采集
3. init 内部创建 50ms 轮询链等待采集完成
4. 采集完成后调用 callback，设置 getFYToken 和 getUidToken

init 超时问题：
- init 内部有 CSS 动画检测（animationend 事件）和 postMessage timing 检测

getFYToken 内部调用 VM 的 opcode 58，需要：
- 完整的 WebGL mock（getUniformLocation, getContextAttributes, getShaderParameter 等）

baxiaCommon 在加载时通过 init$3() hook XHR：
- 关键条件：!getStore(CONST_BAXIA_PROMPT_INIT) 必须为 true

最终方案：手动补环境（如果自己手补环境实在补不出来，也可用 jsdom 库，测试也可以补出来结果） + canvas + HookableXHR + WebGL mock 
→ fireyejs register 成功 
→ configFYEx callback 触发 
→ getFYToken 返回 1200+ 字符的 token（格式 "231!..."）
```

## 2.5 bx-dc 生成分析

```javascript
x-dc 的生成流程：
1. webTracker.init(config) 初始化 mapTracker，传入完整配置（包含 AES 密钥）
2. mapTracker hook 'XMLHttpRequest.prototype.send' 为 p 函数
3. 当 XHR 请求匹配 checkApiPath 时，p 函数通过 x 函数异步计算 x-dc
4. x 函数使用 crypto.subtle.importKey + crypto.subtle.encrypt 进行 AES-CBC 加密
5. 加密结果通过 R 回调设置到 setRequestHeader('x-dc', value)

关键配置参数：
webTracker.init({
    mpl: 100, mcl: 10, mwl: 5, kpl: 6,
    mpi: 20, mci: 0, mwi: 500, kpi: 200,
    checkApiPath: ['detail', 'poiInfo', 'regeoWithName'],
    ks: '73DD8F91DBFA1E27',    // AES-128 密钥
    is: '1234567812345678',     // AES-CBC 初始化向量
    lto: 5000,
    keyIndex: 800,
});
```

**补环境方案：**

![补环境方案](https://cdn.bili33.top/gh/miku8miku/images@main/202604222339149.webp)

**mapTracker VM 循环执行顺序：**

```javascript
第一次调用 '_(number)'（IIFE 内部）：
- 'f=3' 循环：组装模块对象
- 'd=43' 循环：初始化 'oa=u'、'jc'、'Wa'

第二次调用 '_(opts)'（webTracker.init）：
- 'I=43' 循环：环境检测 → hook XHR → 注册事件回调
```

**x-dc 加密流程：**

```javascript
p() [send hook]
  → 外层 VM (var c=1): 初始化 + 遍历解密数据
  → try 块:
    → 定义 C (编码函数), R (header 设置回调), S (错误回调)
    → 内层 VM (var l=13):
      → 遍历 y 数组 (解密 checkApiPath 匹配逻辑)
      → g = wn.checkApiPath.some(C) — URL 匹配检查
      → T = k._url — 获取请求 URL
      → D = x(this._url) — 异步加密 (返回 Promise)
      → D.then(R) — Promise resolve 后调用 R
        → R(encryptedValue):
          → k.setRequestHeader('x-dc', encryptedValue)
          → oe.send(k, m) — 调用原始 send
```

## 2.6 效果展示

![效果展示](https://cdn.bili33.top/gh/miku8miku/images@main/202604222339691.webp)

## 2.7 AI + 补环境方案

主要用到的技术就是 Chrome DevTools MCP + 补环境技术完成整个的逆向过程。需要特殊说明的是 **高德地图收集了很多的设备指纹，所以在补环境的过程中需要让 AI 分析都收集了哪些环境并进行补充，而且最好账号登录后再分析，因为未登录的话逆向出来的参数也有可能请求失败，登录也可以排除账号因素，验证逆向参数是否正确。**

# 三、总结

## 3.1 AI 辅助的优势

1. **处理复杂 VM 逻辑**：对于上述过程中提到的 VM 中有大量的循环以及 case 分支，分析起来这个工作量是十分巨大的，但是 AI 恰好最擅长这个方面
2. **加快分析周期**：AI 可以加快整个分析的周期，原来可能要一两个月搞定的，在 AI 的辅助下可能能缩减一半的时间
3. **代码生成**：AI 可以根据你的需要生成你需要的代码语言及形式

## 3.2 AI 的局限性

1. **AI 也会偷懒**：当它分析大的 VM 流程的时候，它会感觉过于复杂，从而投机取巧想要使用 Playwright 方案 + 无头浏览器解决，这种可能并不是我们想要的方案。所以也 **不要什么都不看，一味的让 AI 向下执行，当它做的事情不符合你的预期时，及时阻止它，并引导它去做你想要的方案**。

2. **AI 也不是万能的**：AI 在分析 VM 的时候，它默认采取的方式是猜测代码本地调试，但是对于那种代码中存在大量 case 分支的情况，走不同的分支会有不同的结果，这个时候不要让 AI 去猜测，这样得到的结论往往是荒唐的。**正确的做法是：给 AI 足够的上下文信息，让它在有足够信息情况下去分析，比如说代码中检测了设备指纹，那么就让 AI 结合浏览器的正常运行环境进行分析，之后再进行本地实现。**

# 四、展望

AI 确实很强大，但是不要做无脑使用 AI 的人，学会使用 AI，正确支配 AI 做事，不要成为被 AI 支配的人。

Harness Engineering 为 AI 提供了好的运行环境，AI 的性能得到了质的提升。我们要做的就是成为 AI 的大脑，指挥它在正确的时机做正确的事情。
