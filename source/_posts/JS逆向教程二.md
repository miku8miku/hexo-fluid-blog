---
title: JS逆向教程二：哈希算法与对称加密实战
date: 2025-11-05 10:00:00
index_img: https://cdn.bili33.top/gh/miku8miku/images@main//202511051029702.png
categories: 技术教程
tags:
  - JS逆向
  - 爬虫
  - 加密算法
---

> 本文详细介绍了JS逆向中常见的哈希算法、对称加密算法和非对称加密算法的特征与识别方法，通过实战案例帮助读者掌握加密参数的定位与破解技巧。

<!-- more -->

# 哈希算法特征（消息摘要算法）

## 1. 为什么要记"算法特征"
- 看到密文 → **秒猜算法** → 直接调用现成库，省去抠代码/分析混淆。  
- 哈希算法输出长度固定，**长度 = 第一判断依据**。

---

## 2. 常见哈希算法速查表（长度即指纹）
| 算法 | 长度（hex） | 长度（字节） | 备注 |
|---|---|---|---|
| MD5 | 32 | 16 | 最泛滥，32 位必优先怀疑 MD5 |
| SHA-1 | 40 | 20 | 谷歌已碰撞，但仍大量旧站用 |
| SHA-256 | 64 | 32 | 现代主流 |
| SHA-512 | 128 | 64 | 更长更安全 |
| HMAC-* | 与底层哈希一致（如 HMAC-MD5 仍 32） | 多一个"盐（key）"参数 |

---

## 3. 浏览器端"秒验证"技巧
1. **未知函数 → 输入 `"1"` → 看输出**  
   - 若等于 `c4ca4238a0b923820dcc509a6f75849b` → 标准 MD5(`"1"`)。  
   - 同理可验证 SHA-1 / SHA-256。  
2. **与现场密文对比** → 完全一致即确认算法，无需再抠实现。

---

## 4. crypto-js 一行调用
```bash
npm i crypto-js
```
```js
const CryptoJS = require('crypto-js');

CryptoJS.MD5('1').toString();           // 32 位小写
CryptoJS.SHA1('1').toString();          // 40 位
CryptoJS.SHA256('1').toString();        // 64 位
// HMAC 带盐
CryptoJS.HmacMD5('msg', 'key').toString();
```

---

## 5. HMAC 注意点
- 长度与底层哈希相同，但 **必须拿到"盐（key）"** 才能重放。  
- 盐可能来自：①后端下发 ②时间戳 ③固定写死 ④前端算一次 → 需向上跟栈定位。

---

## 6. 实战流程（遇到密文）
1. **看长度** → 猜算法  
2. **浏览器控制台** → 用 crypto-js 加密 `"1"` 对照  
3. **确认后** → 直接引用 crypto-js，不再抠代码  
4. **若是 HMAC** → 继续跟栈找 key → 缺啥补啥

---

## 7. 练习
- 新接口翻页参数 `sign=32 位密文` → 按上流程验证是否为 MD5。  
- 要求：本地复现 `sign` 生成，成功获取翻页数据。

![image-20251105090810313](https://cdn.bili33.top/gh/miku8miku/images@main//202511050908354.png)

---

# 对称加密算法

## 1. 对称加密简介
对称加密（**加密解密密钥相同**）：DES、3DES、AES、RC4。

这里不对对称加密的原理做详细解释，感兴趣的话，可以自行百度。以下是对称加密的一些特征：**对称式加密就是加密和解密使用同一个密钥**

**DES：**56位密钥，由于密钥太短，被逐渐被弃用。
**AES：**有128位、192位、256位密钥，现在比较流行。密钥长、可以增加破解的难度和成本。

**工作模式归纳**

**ECB模式** 全称Electronic Codebook模式，译为电子密码本模式，每个数据块独立进行加/解密。

**CBC模式** 全称Cipher Block Chaining模式，译为密文分组链接模式。

**CFB模式** 全称Cipher FeedBack模式，译为密文反馈模式

**OFB模式** 全称Output Feedback模式，译为输出反馈模式。

**CTR模式** 全称Counter模式，译为计数器模式。

**iv:** 防止同样的明文块、加密成同样的密文块。

参考：https://zhuanlan.zhihu.com/p/252551522

我经常见到的是ECB和CBC模式，对称加密只要知道了**秘钥key和偏移量iv**就搞定了。

## 2. JavaScript如何实现AES算法

```javascript
// 引用 crypto-js 加密模块
var CryptoJS = require('crypto-js')
function tripleAesEncrypt() {
    var key = CryptoJS.enc.Utf8.parse(aesKey),
        iv = CryptoJS.enc.Utf8.parse(aesIv),
        srcs = CryptoJS.enc.Utf8.parse(text),
        // CBC 加密方式，Pkcs7 填充方式
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();
}
function tripleAesDecrypt() {
    var key = CryptoJS.enc.Utf8.parse(aesKey),
        iv = CryptoJS.enc.Utf8.parse(aesIv),
        srcs = encryptedData,
        // CBC 解密方式，Pkcs7 填充方式
        decrypted = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);

}
var text = "I love Python!"       // 待加密对象
var aesKey = "6f726c64f2c2057c"   // 密钥，16 倍数
var aesIv = "0123456789ABCDEF"    // 偏移量，16 倍数
var encryptedData = tripleAesEncrypt()
var decryptedData = tripleAesDecrypt()
console.log("加密字符串: ", encryptedData)
console.log("解密字符串: ", decryptedData)
```

padding （填充方式）对于[加密解密](https://so.csdn.net/so/search?q=加密解密&spm=1001.2101.3001.7020)两端需要使用同一的PADDING模式，大部分PADDING模式为`PKCS5, PKCS7, NOPADDING` 。

## 3. 实战案例

案例：https://www.dns.com/login.html

目的：实现登录
逆向字段：password  /qTSTHuUA2JObO29aR/lbg==

先看看堆栈，发现有个login.html的栈，很大概率应该是这了![img](https://cdn.bili33.top/gh/miku8miku/images@main//202511050934884.png)
点进去看看

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202511050934861.png)
很明显有个aes函数对数据进行了加密，下断点，进行跟栈。是一个标准的AES，直接利用标准库实现，还是很简单的。

---

# 非对称加密算法

## 1. 非对称加密算法简介

与[对称加密算法](https://so.csdn.net/so/search?q=对称加密算法&spm=1001.2101.3001.7020)不同，非对称加密算法需要两个密钥：**公开密钥**`（publickey）`和**私有密钥**`（privatekey）`。公开密钥与私有密钥是一对，如果用公开[密钥对](https://so.csdn.net/so/search?q=密钥对&spm=1001.2101.3001.7020)数据进行加密，只有用对应的私有密钥才能解密；如果用私有密钥对数据进行加密，那么只有用对应的公开密钥才能解密。因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。

常见的非对称加密有：RSA、DSA。
[非对称加密算法](https://so.csdn.net/so/search?q=非对称加密算法&spm=1001.2101.3001.7020)私钥由数据接收方持有，不会在网络上传递，保证了密钥的安全。

非对称加密算法通常比对称加密算法计算复杂，性能消耗高。

非对称加密算法可用于数字签名。

## 2. 非对称加密算法特征

常见JavaScript调试算法

- 搜索关键词 `new JSEncrypt()`，`JSEncrypt` 等，一般会使用 `JSEncrypt`库，会有 new 一个实例对象的操作；
- 搜索关键词 `setPublicKey`、`setKey`、`setPrivateKey`、`getPublicKey` 等，一般实现的代码里都含有设置密钥的过程。

`RSA` 的私钥、公钥、明文、密文长度也有一定对应关系，也可以从这方面初步判断：

| 私钥长度 | 公钥长度 | 明文长度 | 密文长度 |
| :------- | :------- | :------- | :------- |
| 428      | 128      | 1~53     | 88       |
| 812      | 216      | 1~117    | 172      |
| 1588     | 392      | 1~245    | 344      |

### 2.1 JavaScript实现

```javascript
// npm install jsencrypt --save
// 引用 jsencrypt 加密模块
const JSEncrypt = require('jsencrypt');
// 生成 RSA 密钥对
const encrypt = new JSEncrypt();
encrypt.getKey();
// 获取公钥和私钥
const publicKey = encrypt.getPublicKey();
const privateKey = encrypt.getPrivateKey();
// 使用公钥加密数据
const data = 'Hello, World!';
const encrypted = encrypt.encrypt(data);
console.log('Encrypted:', encrypted);
// 使用私钥解密数据
const decrypt = new JSEncrypt();
decrypt.setPrivateKey(privateKey);
const decrypted = decrypt.decrypt(encrypted);
console.log('Decrypted:', decrypted);
```

## 3. 案例实战

**地址：https://www.dns.com/login.html

**登录接口分析**

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202511050940561.png)

pwd应该是加密参数。需要去分析。老规矩，还是先要定位加密位置。

这里最简单的还是要看Initiator，堆栈比较少。关键代码如下所示。

![img](https://i-blog.csdnimg.cn/direct/094c09a92002480198fde2186ec261c0.png)

在encryptedString处下断点，进行跟栈分析。
![img](https://cdn.bili33.top/gh/miku8miku/images@main//202511050940536.png)

这里的key_to_encode是不是一个字符串，需要看看在哪里生成的。**全局搜索**一下，发现在index.js里面生成。把代码直接扣下来。再定位encryptedString方法，在RSA.min.js文件里面，直接全扣，就搞定了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202511050940278.png)

---

# 参考资料
- [Bilibili视频教程](https://www.bilibili.com/video/BV1FTN1eeEQa/?spm_id_from=333.1387.upload.video_card.click&vd_source=2145442929686b6f5e136938f18fccfd)
- [摘要算法练习网页](https://www.mytokencap.com/all-cryptocurrencies/3/)
- [对称加密练习网页](https://www.dns.com/login.html)
- [非对称加密练习网页](https://www.dns.com/login.html)