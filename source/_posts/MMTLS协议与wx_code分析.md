---
title: 应用宝协议 / yyb 协议：MMTLS 协议与 wx_code 深度分析
date: 2026-11-24 10:00:00
index_img: https://r2.miku2024.top/r2/2026/11/7065546a0cf1a250879e358db5176caf.webp
categories:
  - 协议分析
  - 逆向工程
tags:
  - MMTLS
  - wx_code
  - 微信小程序
  - 应用宝协议
  - HybridECDH
  - 网络协议
description: 基于 yyb_go 源码的 MMTLS 协议与 wx_code 分析。
copyright: true
---

> 基于仓库 yyb_go 源码（internal/protocol 全量阅读）的逆向工程分析文章：完整还原微信 MMTLS 加密隧道、ManualAuth 登录、0-RTT 短连接与 wx_code（js-login）取码链路。

**MMTLS over TCP** · **ECDHE P-256** · **AES-128-GCM** · **HybridECDH** · **0-RTT PSK** · **js-login / wx_code**

## 目录

1. [应用宝协议 / yyb 协议是什么](#s1)
2. [协议栈全景与域名调度](#s2)
3. [MMTLS Record 层格式](#s3)
4. [MMTLS 全量握手（ECDHE）](#s4)
5. [MMTLS PSK 0-RTT 握手](#s5)
6. [ManualAuth 登录与 HybridECDH](#s6)
7. [wx_code（js-login）专项分析](#s7)
8. [getPhoneNumber / operateWxData](#s8)
9. [会话管理与工程化设计](#s9)

<a id="s1"></a>
## 一、应用宝协议 / yyb 协议是什么

本项目所说的「应用宝协议 / yyb 协议」，是指**微信小程序运行时（wxaruntime）在应用宝 / Windows 宿主环境下与微信云端通信的私有协议族**。它不是单一协议，而是一组 layered 协议的组合：

| 层次 | 协议 / 机制 | 实现文件 | 作用 |
| --- | --- | --- | --- |
| 传输加密 | MMTLS over TCP（类 TLS 1.3） | `mmtls_*.go` | 端云加密隧道 |
| 寻址 | NEW DNS（HTTPDNS） | `newdns.go` | 拉取 longcloud/shortcloud IP 列表 |
| 登录 | ManualAuth + HybridECDH | `ilink.go` | LoginBuffer 换会话密钥 |
| 业务承载 | ShortLink 0-RTT / wxaruntime_transfer | `shortlink.go` `ilink.go` | JSAPI 请求投递 |
| 业务语义 | js-login(1029) / js-getuserwxphone(1020) / js-operatewxdata(1133) | `pool.go` `ilink.go` | wx_code / 手机号 / 开放数据 |
| 序列化 | Protobuf 子集 + wpkg TLV + LZ4 | `bytes.go` `ilink.go` | 报文编解码 |

本项目的价值在于：**不依赖微信官方 SDK 和 PC 微信客户端，用纯 Go 在服务端复刻了这套协议栈**，使得一个 exe 就能托管多个微信账号的小程序调用能力。

<a id="s2"></a>
## 二、协议栈全景与域名调度

所有连接建立前，先通过 NEW DNS（`aedns.weixin.qq.com/cgi-bin/default/getdns`，明文 HTTP + JSON，UA 伪装 `MicroMessenger Client`）拿到两组目标：

| 域名 | 用途 | 协议/端口 |
| --- | --- | --- |
| `longcloud.weixin.com` | LongLink：MMTLS 全量握手 + ManualAuth 登录 | `mmtlsovertcp`，端口优先级 8080 > 80 > 443 > 5000，最多取 6 个候选 |
| `shortcloud.weixin.com` | ShortLink：0-RTT 快速投递业务包 | `http` :80（硬编码兜底 IP `120.241.131.173:80`） |

DNS 结果带 30 分钟进程内缓存；出站连接可选 SOCKS5 / HTTP-CONNECT 代理，代理失败自动回退直连（`TCPProxyFallbackDirect`）。

<a id="s3"></a>
## 三、MMTLS Record 层格式

MMTLS 报文与 TLS 1.3 Record 同构，但版本号是自定义的 `0xF103`（ClientHello 内版本为 `0x03F1`）：

```text
// buildRecord / parseRecords (mmtls_protocol.go)
+------------+--------------+----------------+
| ContentType| Version=0xF103| Length (u16)  |
|  (1 byte)  |  (2 bytes)    |  (2 bytes)    |
+------------+--------------+----------------+
|              Payload (≤ 0xFFFF)             |
+---------------------------------------------+
```

ContentType 枚举：

| 值 | 含义 |
| --- | --- |
| `0x15` | Alert |
| `0x16` | Handshake |
| `0x17` | AppData（业务数据） |
| `0x19` | PSK Handshake（0-RTT 专用） |

加密记录的 AEAD 构造与 TLS 1.3 一致：AES-128-GCM，nonce = IV XOR 大端序序列号，AAD 为 13 字节自定义结构 `[seq(u64) | contentType | 0xF1 0x03 | cipherLen(u16)]`（`buildRecordAAD`）。握手消息同样复用 TLS 布局：`4 字节总长 + 1 字节消息类型 + body`。

<a id="s4"></a>
## 四、MMTLS 全量握手（ECDHE）

### 4.1 ClientHello

客户端一次性提供**两个 ECDH P-256 公钥**（group 1 = secp256r1 与 group 2），封装在 KeyShare 扩展（type 0x01）中，套用密码套件 `0xC02B`（ECDHE-ECDSA-AES128-GCM-SHA256 的 TLS 编号），外加 32 字节随机数与 4 字节时间戳。

### 4.2 ServerHello 与密钥推导

服务器从 KeyShare 中选定 group 1（`groupSecP256R1 = 0x01`）并回传 65 字节公钥。客户端推导链（`mmtls_client.go: recvServerFlight`）：

```text
secret = SHA256(ECDH(g1_priv, server_pub))        // 32 字节共享秘密
h_ch_sh = SHA256(transcript[ClientHello..ServerHello])
handshake_keys = HKDF-Expand-Label(secret, "handshake key expansion", h_ch_sh, 56)
  → 客户端 Key(16) / 服务器 Key(16) / 客户端 IV(12) / 服务器 IV(12)
```

> MMTLS 的 HKDF 标签是明文 ASCII（如 `"expanded secret"`、`"application data key expansion"`），且只做 Expand 不做 TLS 标准的 Structured HkdfLabel 编码 —— 这是它与标准 TLS 1.3 的关键差异之一。

### 4.3 服务器飞行包与 Finished 校验

此后服务器在加密的 Handshake 记录里发送：EncryptedExtensions / CertificateVerify（`0x0F`）/ NewSessionTicket（`0x04`，携带 PSK 票据）/ Finished（`0x14`）。客户端每收到一条就喂进 transcript，当收到 Finished 时：

```text
h_final = SHA256(transcript[...全部握手消息...])
master  = HKDF-Expand(secret, "expanded secret", h_final, 32)
app_keys = HKDF-Expand(master, "application data key expansion", h_final, 56)
verify  = HMAC-SHA256(HKDF-Expand(secret, "server finished", ∅, 32), h_final)
```

verify 数据比对通过后，客户端再用自己的 `"client finished"` 标签构造 Finished，用握手密钥加密发回，握手完成，切换到 AppData 密钥。

### 4.4 PSK 票据

NewSessionTicket 中每张票据首字节为 PSK 类型：`1 = PSK_ACCESS`、其余为 `PSK_REFRESH`。派生公式：`PSK = HKDF-Expand(secret, "PSK_ACCESS"/"PSK_REFRESH", h_certv, 32)`。本项目只挑选**未过期的 PSK_ACCESS 票据**（`pickAccessPSK`）用于后续 0-RTT。

<a id="s5"></a>
## 五、MMTLS PSK 0-RTT 握手

登录一次后，后续所有业务请求走 ShortLink 的 **PSK 0-RTT**通道（`shortlink.go: build0RTTRequest`），单次 HTTP 往返即完成“握手 + 业务请求”：

```text
// 一次性发出的 4 条记录（HTTP POST /mmtls/{timestamp}，Upgrade: mmtls）
Rec#0  ct=0x19 明文      PSK ClientHello（ticket_entry 回贴，cipher 0x00A8）
Rec#1  ct=0x19 加密      type8 记录（16字节魔数前缀 + 时间戳）
Rec#2  ct=0x17 加密      业务 envelope（AppData，0-RTT 提前发送！）
Rec#3  ct=0x15 加密      early Alert（7字节固定，标记请求结束）
```

early data 密钥推导：对 PSK ClientHello 原文做 SHA256 得 `h_early`，`early_keys = HKDF-Expand(psk, "early data key expansion", h_early, 28)`（单向 16 字节 Key + 12 字节 IV，序列号从 1 开始）。

响应解析（`parse0RTTResponse`）有一段值得注意的**容错设计**：由于无法确定服务器 transcript 的拼接顺序，代码用 3 种候选（CH+SH / CH+type8+SH / CH+SH+type8）× 3 种序列号（2,1,3）共 9 种组合逐一尝试 AES-GCM 解密 —— 这是逆向工程中对未完全确认的服务器行为做的实用主义兜底。解出的 AppData 即 shortlink 包，再用会话 `RecvKey` 做 AES-GCM + LZ4 解出业务明文。

<a id="s6"></a>
## 六、ManualAuth 登录与 HybridECDH

拿到 LongLink 的 MMTLS 隧道后，第一件事是发 `ManualAuth`（cmd `0x0D7D`）把 LoginBuffer 兑换成业务会话密钥。

### 6.1 LoginBuffer 结构

LoginBuffer 是 base64 的 protobuf，关键字段：`f1 = Ticket`（登录票据）、`f2 = DeviceID`、`f3 = HostAppID`（默认宿主 `wxd44977328b36e647`，即应用宝侧宿主 AppID）。

### 6.2 HybridECDH 双层加密

请求体的加密比 MMTLS 本身还要复杂，是**两层混合加密**（`hybridECDHEncrypt`）：

```text
第一层：临时 ECDH(P-256) 与内置服务器公钥 serverPub 协商
        secret = SHA256(shared)
        hash1  = SHA256("1" || "415" || eph_pub)
        CEK(32B 随机) ← AES-GCM(secret[:24], aad=hash1) 封装    // CEK 信封

第二层：prk = HKDF-Extract(salt="security hdkf expand", ikm=CEK)
        okm = HKDF-Expand(prk, hash1, 56)
        hash2 = SHA256("1" || "415" || eph_pub || encCEK)
        业务明文 LZ4 压缩 → AES-GCM(okm[:24], aad=hash2)        // 内容加密

输出 protobuf: f1=1, f2={415, eph_pub}, f3=encCEK, f5=encBody
```

响应解密（`hybridECDHDecrypt`）用同一临时私钥与服务器响应公钥再协商一次 ECDH，AAD 由 `okm[24:56] || compBody || "415" || serverRespPub || credType` 拼出 —— 客户端加密时留下的中间状态参与了响应 AAD，形成请求-响应绑定，防重放/防篡改。

### 6.3 wpkg 头与会话密钥

ManualAuth 请求头部是一段自定义 TLV（`wpkgHead`），包含 30 余个整数/字节字段：客户端版本 `524545`、设备 ID、环境伪装标识（11 = Windows）等。响应解出后 `extractSession` 提取：

| 字段 | 含义 |
| --- | --- |
| `SendKey / RecvKey` | 后续业务包的 AES-GCM 收发密钥 |
| `F9` | 会话 wpkg 头字段 27（防重放票据） |
| `UIN` | 账号数字 ID（写回账号库） |
| `Ticket` | 会话票据 |

<a id="s7"></a>
## 七、wx_code（js-login）专项分析

**wx_code 即小程序的 `wx.login()` 返回值**，对应服务端命令 `js-login`（cmdID `1029`，URL `/cgi-bin/mmbiz-bin/js-login`）。完整链路（`pool.go: GetCode`）：

### 7.1 请求构造

```text
// buildJSAPIPlaintext — JSAPI 外层信封（protobuf）
f1: sessionInfo(uin32, "Windows", 随机MAC设备)   // 会话描述
f2: "/cgi-bin/mmbiz-bin/js-login"                // 目标 CGI
f3: hostAppID（应用宝宿主 wxd44977328b36e647）
f4: 5
f5: loginReq（js-login 内层：sessionInfo + app_id + 常量位）
f6: app_id
f7: 1029                                         // cmdID
f8: 1610627409 / f10: 573651281                   // 版本魔数
f9: "WindowsxWebPlugin"                          // 端侧伪装

// sessionInfo（内层会话块）
f1: "sessionkey" 字面量, f2: uin, f3: 随机MAC设备ID,
f4: 1661404927（会话客户端版本）, f5: "UnifiedPCWindows"
```

### 7.2 传输封装

```text
JSAPI 明文 → LZ4 压缩 → AES-GCM(SendKey)          // 会话层加密
        → wpkg 会话头（含 uin、F9、deviceID）
        → shortlink 包：magic 0x1110, ver 0x076D, cmd 0x0B41 (transfer), seq 0
        → 外层信封：URL "/ilink/ilinkapp/mp/wxaruntime_transfer"
                    Host "shortcloud.weixin.com"
        → MMTLS 0-RTT 记录流 → HTTP POST :80
```

即业务命令 `wxaruntime_transfer (0x0B41)` 是一个**承载通道**，真正的 CGI（js-login 等）作为明文内嵌其中，形成“MMTLS → transfer → CGI”三层路由。

### 7.3 响应提取

响应经 GCM/LZ4 解出明文后，`extractCode` 按 protobuf 路径 `f2 → f3` 取出 code 字符串，最终对外返回：

```json
{"code": "081AbC0H0Zc3...", "errMsg": "login:ok"}
```

> wx_code 是一次性票据（5 分钟有效），由微信后端用小程序的 AppSecret 可换取 openid/session_key。本服务只是“取码器”，不持有任何小程序 AppSecret，code 的校验仍由小程序开发者服务器调用微信 jscode2session 完成 —— 这保证了与官方 `wx.login()` 语义完全兼容。

<a id="s8"></a>
## 八、getPhoneNumber / operateWxData

- **getPhoneNumber（cmdID 1020，`/cgi-bin/mmbiz-bin/js-getuserwxphone`）**：内层结构与 loginReq 类似（sessionInfo + app_id），响应为 JSON 或 protobuf 自动识别（`parseRawResponse`），透传手机号加密数据结构。
- **operateWxData（cmdID 1133，`/cgi-bin/mmbiz-bin/js-operatewxdata`）**：payload 支持 `{data:{api_name:...}}` 嵌套或扁平结构（`extractOperatePayload` 自动归一化），JSON 序列化后放入内层 f3，覆盖开放数据类 JSAPI（如 getUserInfo 等）。

<a id="s9"></a>
## 九、会话管理与工程化设计

- **两级缓存**：ManualAuth 得到的 `WmpfSession`（SendKey/RecvKey/F9/UIN/Ticket + PSK + ShortLink 目标）整体 JSON blob 化存入 SQLite `sessions` 表，按「账号 + 代理」维度隔离，TTL 30 分钟且不超过 PSK 有效期。
- **并发控制**：登录信号量 32（`MaxLoginConcurrency`）、短连接信号量 1000；同账号并发请求通过 per-key 互斥锁串行化，防止重复 ManualAuth。
- **多目标容错**：LongLink 最多试 6 个候选 IP，ShortLink 遍历全部候选；代理失败自动降级直连。
- **状态机闭环**：业务调用失败 → 作废会话 → 刷新 LoginBuffer（`RefreshLoginBuffer`）→ 重新 ManualAuth；凭证彻底失效 → HTTP 409 提示重新扫码。
- **协议安全小结**：传输层 MMTLS（ECDHE 前向安全 + PSK 0-RTT）；应用层 HybridECDH（CEK 信封 + 请求响应 AAD 绑定）；会话层对称 GCM + LZ4 + F9 防重放票据 —— 三层加密各自独立，密钥互不混用。

> **与 WMPF 云玩方案的衔接**：本协议栈输出的 `wx_code / getPhoneNumber / operateWxData` 正好对应 WMPF 小程序运行时最核心的三个宿主侧 JSAPI。服务端代持账号凭证 + 按需取码，意味着 Android 云玩端无需本地微信环境即可完成小程序登录与鉴权闭环，这正是项目 V2.0 方案中「字段级 API 契约」的底层实现基础。

《应用宝协议 / yyb 协议：MMTLS 协议与 wx_code 分析》 · 基于 yyb_go 源码逆向分析 · 2026-09
