---
title: APP绕过sslpinning（转载）
date: 2025-12-12 14:43:00
index_img: https://pic1.imgdb.cn/item/69645f4575db907620f55f40.png
tags: [网络安全, 移动安全, SSL, HTTPS, 抓包]
---



> 本文详细介绍了SSL Pinning技术的原理及其在移动应用安全中的重要性，并提供了多种绕过SSL Pinning的实用方法。主要内容包括：
> 1. **基础知识**：讲解了HTTPS协议、单向验证与双向验证、SSL Pinning的概念及工作原理
> 2. **工具介绍**：介绍了Fiddler、BurpSuite、Wireshark等常见的抓包工具及其使用方法
> 3. **绕过方法**：重点介绍了使用Frida、Xposed+JustTrustMe、r0capture、Objection等多种技术绕过SSL Pinning的具体实现
> 4. **实践技巧**：提供了针对不同Android版本的抓包解决方案，包括Android7、Android10等系统的特殊处理方法

<!-- more -->

# 0x01 前言

随着移动应用的发展和推广，APP应用安全越来越受到重视。在APP中各类防抓包的机制的出现，让测试无法正常进行分析

分析APP时都免不了抓包这一环节，想要抓到包就要看APP用的是什么通信协议。由于HTTP存在不安全性，当前大部分的APP基本采用HTTPS通信协议。许多时候安装 app 时 app 的自带证书就安置到了手机中，且此证书也存在在服务端，另外 app 的代码是开启了 SSL Pinning 的，当我们用 burp 抓包时需要导入手机证书，那劫持 https 的流量就是用 burp 的证书加解密的，而 burp 的证书和 app 的自带证书不一致，所以直接失效，证书的一致性是通过 sha/256 来进行比较的

对抓包工具来说，不论是使用Burp、Fiddler还是Wireshark，这些工具的基本原理都是采用的中间人的方式，工具作为中间人，对客户端伪装成服务端，对服务端伪装成客户端

开始之前，我们先了解一些基础知识，如下介绍

## 1.1 HTTPS之吻？

http即超文本传输协议，是互联网上应用最为广泛的一种网络协议 ，是一个客户端和服务器端请求和应答的标准（TCP），用于从WWW服务器传输超文本到本地浏览器的传输协议，它可以使浏览器更加高效，使网络传输减少。然而他也存在着一些缺点，比如通信使用明文，内容极易被窃听；不验证通信方的身份，因此有可能遭遇伪装；无法证明报文的完整性，所以有可能遭到篡改。因此，http的加强版https应运而生。https中的s是ssl或者tls，就是在原HTTP的基础上加上一层用于数据加密、解密、身份认证的安全层。

数据在会话的初始阶段，客户端第一次发送请求时，通过明文进行发送的，为了防止信息泄露，服务端在返回时则返回一个公钥和证书给客户端。客户端验证证书是否是认证机构颁发，证书是否在有效期内，若没问题则进行下一次请求。在下一次客户端发送请求的时，通过公钥对核心数据进行加密，服务端在接收到数据时，获取对称加密的密钥。此后请求就是通过对称加密的密钥进行加密

- 已了解HTTP，那什么是HTTPS？

```
HTTP + 加密 + 认证 + 完整性保护 = HTTPS
```

https需要CA证书，之前文章说的中间人需要对客户端伪装成真正的服务端，要求就是当客户端向我们发送网络请求时，我们必须能够给指定域名签发公钥证书，且公钥证书能够通过系统的安全校验。对于我们是不是真正的客户端，通常来说服务器是不太会关心的，他是不会去关心你是谷歌浏览器还是百度浏览器，当然了也会有例外。接下来要说的双向验证就是如此

## 1.2 单向验证与双向验证

首先，了解一下什么是https的单双向验证，主要说一下双向验证，双向验证相比较单向验证，增加了服务端对客户端的认证

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121425743.png)

双向认证详细过程如下：

- 客户端发起HTTPS请求，将SSL协议版本的信息发送给服务端。
- 服务端去CA机构申请来一份CA证书，在前面提过，证书里面有服务端公钥和签名。将CA证书发送给客户端
- 客户端读取CA证书的明文信息，采用相同的hash散列函数计算得到信息摘要（hash目的：验证防止内容被修改），然后用操作系统带的CA的公钥去解密签名（因为签名是用CA的私钥加密的），对比证书中的信息摘要。如果一致，则证明证书是可信的，然后取出了服务端公钥
- 客户端发送自己的客户端证书给服务端，证书里面有客户端的公钥：C_公钥
- 客户端发送支持的对称加密方案给服务端，让其选择
- 服务端选择完加密方案后，用刚才得到的C_公钥去加密选好的加密方案
- 客户端用自己的C_私钥去解密选好的加密方案，客户端生成一个随机数（密钥F），用刚才等到的服务端B_公钥去加密这个随机数形成密文，发送给服务端。
- 服务端和客户端在后续通讯过程中就使用这个密钥F进行通信了。和之前的非对称加密不同，这里开始就是一种对称加密的方式

![image-20251212142755330](https://cdn.bili33.top/gh/miku8miku/images@main//202512121427864.png)

## 1.3 SSL Pinning

SSL Pinning是一种防止中间人攻击（MITM）的技术，主要机制是在客户端发起请求–>收到服务器发来的证书进行校验，如果收到的证书不被客户端信任，就直接断开连接不继续求情。

可以发现中间人攻击的要点的伪造了一个假的服务端证书给了客户端，客户端误以为真。所以在遇到对关键请求开启SSL Pinning的APP时，我们抓包就只能看到APP上提示无法连接网络或者请求失败之类的提示；而在抓包工具上面，要么就只能看到一排 CONNECT 请求，获取到证书却没有后续了，要么就是一些无关的请求，找不到想要的接口。解决思路就是，客户端也预置一份服务端的证书，对比客户端与服务端的证书就知道谁真谁假。

介绍一下证书相关的概念，以及证书校验的相关知识：

- 可信CA：

CA(Certificate Authority)是数字证书认证中心的简称，是指发放、管理、废除数字证书的机构。CA的作用是检查证书持有者身份的合法性，并签发证书，以防证书被伪造或篡改，以及对证书和密钥进行管理。

- 双向锁定：

在客户端锁定服务端证书的基础上，服务端对客户端的证书也进行锁定，需要客户端再做一次证书预埋。多见于金融业务。

- 证书链：

证书链就是Root CA签发二级Intermediate CA，二级Intermediate CA可以签发三级Intermediate CA，也可以直接签发用户证书。从Root CA到用户证书之间构成了一个信任链：信任Root CA，就应该信任它所信任的二级Intermediate CA，从而就应该信任三级Intermediate CA直至信任用户证书。

- 逐级验证：

客户端对于收到的多级证书，需要从站点证书(leaf certificate)开始逐级验证，直至出现操作系统或浏览器内置的受信任CA 根证书(root certificate)

SSL Pinning技术指的是在应用程序中只信任固定证书或是公钥。应用程序开发人员在程序中使用SSL Pinning技术作为应用流量的附加安全层。实现SSL Pinning的方法主要有两种：

**证书固定**：开发者将SSL证书的某些字节码硬编码在用程序中。当应用程序与服务器通信时，它将检查证书中是否存在相同的字节码。如果存在，则应用程序将请求发送到服务器。如果字节码不匹配，它将抛出SSL证书错误。此技术可防止攻击者使用自己的自签名证书。

**公钥固定**：在客户访问网站时进行公钥固定中，服务器将其公钥固定（通过注入）在客户端（客户）浏览器中。当客户端重新访问同一网站时，服务器将标识其公共密钥以检查连接的完整性。此技术还可以防止攻击者使用它的自签名证书

SSL Pinning的两种方式：

- 证书锁定（Certificate Pinning）
- 公钥锁定（ Public Key Pinning）

1. 证书锁定

需要在客户端代码内置仅接受指定域名的证书，而不接受操作系统或浏览器内置的CA根证书对应的任何证书，通过这种授权方式，保障了APP与服务端通信的唯一性和安全性，因此客户端与服务端（例如API网关）之间的通信是可以保证绝对安全。但是CA签发证书都存在有效期问题，缺点是在证书续期后需要将证书重新内置到APP中

1. 公钥锁定

提取证书中的公钥并内置到客户端中，通过与服务器对比公钥值来验证连接的正确性。制作证书密钥时，公钥在证书的续期前后都可以保持不变（即密钥对不变），所以可以避免证书有效期问题，一般推荐这种做法

### 1.3.1 SSL Pinning/双向验证的区别

SSL Pinning实际上是客户端锁定服务器端的证书, 在要与服务器进行交互的时候, 服务器端会将CA证书发送给客户端, 客户端会调用函数对服务器端的证书进行校验, 与本地的服务器端证书(存放在.asset目录或resraw下)进行比对。而双向认证是添加了客户端向服务器发送CA证书, 服务器端对客户端的证书进行校验的部分。在app上，https双向认证的方案也可以防止中间人劫持，但这种双向认证开销较大，且安全性与SSL Pinning一致，目前大多数app都采用SSL Pinning这种方案

### 1.3.2 SSL Pinning趋势

使用SSL Pinning目前已经成为了趋势，绕过的方法有如下几种：

- 使用低版本的安卓手机抓包
- 使用iOS端手机抓包
- 使用Frida绕过证书处理

## 1.4 客户端证书处理逻辑分类

客户端关于证书的处理逻辑，按照安全等级可做如下分类:

| 安全等级 | 策略                                              | 信任范围                                                     | 破解思路                                                     |
| :------- | :------------------------------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 0        | 完全兼容策略                                      | 信任所有证书包括自签发证书                                   | 无需特殊操作                                                 |
| 1        | 系统/浏览器默认策略                               | 信任系统或浏览内置CA证书以及用户安装证书                     | 设备安装代理证书                                             |
| 2        | System CA Pinning                                 | 只信任系统根证书，不信任用户安装的证书(Android7.0支持配置network-security-config.xml) | 注入或者root后将用户证书拷贝到系统证书目录                   |
| 3        | CA Pinning Root(intermediate) Certificate Pinning | 信任指定CA颁发的证书                                         | hook注入等方式篡改锁定逻辑                                   |
| 4        | Leaf Certificate Pinning                          | 信任指定站点证书                                             | hook注入等方式篡改锁定逻辑，如遇双向锁定需将app自带证书导入代理软件 |

## 1.5 校验接口

在做证书校验的时候，有两个接口很重要

- `javax.net.ssl.X509TrustManager`接口，用来校验证书是否被信任。通常会校验 CA 是否为系统内置权威机构，证书有效期等。这个接口有三个方法，分别用来校验客户端证书、校验服务端证书、获取可信证书数组

```
// 该方法检查客户端的证书，若不信任该证书则抛出异常
@Override
public void checkClientTrusted(X509Certificate[] chain, String authType)
throws CertificateException {
    ... ...
}

// 该方法检查服务器的证书，若不信任该证书同样抛出异常
@Override
public void checkServerTrusted(X509Certificate[] chain, String authType)
throws CertificateException {
    ... ...
}

// 返回受信任的X509证书数组
@Override
public X509Certificate[] getAcceptedIssuers() {
    return new X509Certificate[0];
}
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121427130.png)

通常系统信任的证书会被安装在以下的目录中：

```
/system/etc/security
/data/misc/keychain/cacerts-removed
/data/misc/keychain/cacerts-added
```

- `javax.net.ssl.HostnameVerifier`接口，其只有一个方法，用来校验域名信息。通常会比对当前请求的域名是否在证书的常用名称（CN）和主题备用名称（Subject Alternative Name）中

```
final HostnameVerifier hostnameVerifier = new HostnameVerifier() {@
    Override
    public boolean verify(String hostname, SSLSession session) {
        return true;
    }
}
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121428416.png)

# 0x02 工具

## 2.1 抓包工具

很多APP应用的客户端与服务器端之间进行数据通信时也存在明文数据传输、数据弱加密、中间人攻击等问题，大家应该也想到了，我们可以抓取数据包看看有没有敏感信息或可利用的数据包信息等，现在主流的抓包工具种类有很多，按照协议来分类主要包含HTTP、HTTPS、SMTP等。

常用的抓包工具：

- Fiddler（支持截取HTTP和HTTPS的数据包）
- Wireshark（支持所有协议的抓取）

看着跟我们平时常用的抓包工具差不多，但这两种抓包工具在移动安全中的使用前提必须是抓包工具和手机设备在同一个网段

- 组网环境

组网是指网络组建技术，分为以太网组网技术和ATM局域网组网技术。以太网组网非常灵活和简便，可使用多种物理介质，以不同拓扑结构组网，是国内外应用最为广泛的一种网络，已成为网络技术的主流

在正式渗透前，必须要保证抓包工具和手机设备在同一个网段，如下图：

但上图抓包的缺点是抓包工具截获的数据包是所有通过路由器的网络数据，无用的数据包会很多，为了减少误报，可以开启Wi-Fi热点，用手机设备连接计算机的Wi-Fi，然后在手机设备中设置代理IP和端口，这样手机中的流量通过笔记本电脑端的代理Wi-Fi，大大的减少了无用的数据包

打开电脑点击开启移动热点即可，如下：

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121428996.png)

### 2.1.1 Fiddler

Fiddler是一个http协议调试代理工具，它能够记录并检查所有你的电脑和互联网之间的http通讯，设置断点，查看所有的“进出”Fiddler的数据（指cookie,html,js,css等文件）。Fiddler 要比其他的网络调试器要更加简单，因为它不仅仅暴露http通讯还提供了一个用户友好的格式

Fiddler是作用于应用层，使用时需要配置全局代理，很容易被检测，容易被绕过。举个例子，假如说APP使用的是Okhttp框架，那只需要在源代码上加入`proxy(Proxy.NO_PROXY)`就可以让Fiddler抓不到包，当然这个时候你可以hook掉它

网络库在构造http请求类的时候，如果传入Proxy.NO_PROXY，比如okhttp3的：

```
OkHttpClient client=new OkHttpClient.Builder()
        .proxy(Proxy.NO_PROXY)
        .build();
```

**注**：传入`Proxy.NO_PROXY`这个参数后，发起请求之前都会先检测有没有使用代理（可以前往文章中的系统代理检测有介绍），并且绕过代理直接向真实服务器发起请求。绕过的方法有两种：第一种就是找到请求的类进行hook，将接受`Proxy.NO_PROXY`的方法参数置空；第二种就是使用流量转发的app，比如Drony，它的功能类似VPN，能实现流量转发，将流量转发到Drony后，Drony再将其通过代理服务器(抓包软件)发送出去，从而绕过APP的代理检测，`Proxy.NO_PROXY`具体例子代码如下，实例是networktest2使用okhttp3发送http请求的代码，这里主要是设置了一个NO_PROXY，接着向www.baidu.com发送post请求

```
private void sendRequestWithOkHttp(){
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    //创建client对象和request对象，调用client的newcall传request进去进行http请求
                    OkHttpClient client=new OkHttpClient.Builder()
                            .proxy(Proxy.NO_PROXY)
                            .build();
                    //如果要post请求，加个requestbody对象，在request对象加上.post(requestbody)
                    RequestBody requestBody=new FormBody.Builder()
                            .add("username","admin")
                            .add("password","123456")
                            .build();
                    // 设置请求信息，比如请求头，请求url等
                    Request request=new Request.Builder()
                            .header("Cookie", "xxx")
                            .url("https://www.baidu.com")
                            .post(requestBody)
                            .build();
                    //调用client.newCall发起请求并获取返回值
                    Response response=client.newCall(request).execute();
                    String responseData=response.body().string();
                    showResponse(responseData);
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }).start();
    }
```

### 2.1.2 Tcpdump

TCPDump可以将网络中传送的数据包完全截获下来提供分析。它支持针对网络层、协议、主机、网络或端口的过滤，并提供and、or、not等逻辑语句来帮助你去掉无用的信息

下载地址：https://www.tcpdump.org

### 2.1.3 BurpSuite

Burp Suite 是用于攻击web 应用程序的集成平台，包含了许多工具。Burp Suite为这些工具设计了许多接口，以加快攻击应用程序的过程。所有工具都共享一个请求，并能处理对应的HTTP 消息、持久性、认证、代理、日志、警报

#### 2.1.3.1 APN来设置Burp Suite

按照下面的步骤可以使安卓设备与后台之间的所有通信都经过代理。

- 点击Settings按钮
- 入口无线和网络

![image-20251212143005883](https://cdn.bili33.top/gh/miku8miku/images@main//202512121430054.png)

- 移动网络

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121429645.png)

- 接入点名称(APN)
- 新建APN
- 在Edit access point（编辑接入点）界面中，分别填入代理和端口（填写APN，IP填上电脑查看到的ip，端口随便(只要Burp配置的时候配置成该端口就行)，apn其他相关信息参考本机默认apn设置）
- 代理设置完成后，会出现如下图所示的界面

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121430104.png)

- Burp配置对应的代理（手机中配置的IP和端口）IP以及端口

![image-20251212143057950](https://cdn.bili33.top/gh/miku8miku/images@main//202512121430122.png)

#### 2.1.3.2 通过Wi-Fi设置代理

最简单的设置代理的方法是通过Wi-Fi，在设置代理之前，需要先连接Wi-Fi并进行认证。检查你是否能连接互联网

- 选择已连接的Wi-Fi网络
- 长按直至弹出上下文菜单，点击修改网络

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121431873.png)

- 勾选【显示高级选项】，然后代理选项下拉框中选择【手动】，然后配置代理主机IP和端口

![image-20251212143154087](https://cdn.bili33.top/gh/miku8miku/images@main//202512121431273.png)

- 保存设置，并确认代理信息

可能会提示证书不正确，浏览器无法对这个证书发行者进行认证，从而触发了一个证书警告。为了绕过证书警告和HSTS，访问`http://burp/`下载CA证书，安装Burp 的PortSwigger CA 证书，通过将证书添加到设备的受信任证书存储区，就能“欺骗”应用，使其误认为Burp的证书是可信的。

![image-20251212143236025](https://cdn.bili33.top/gh/miku8miku/images@main//202512121432223.png)

把.der后缀改为.cer，然后将证书文件保存到安卓文件系统中，使用下面的命令安装证书：

```
adb push cacert.cer /mnt/sdcard
```

**备注**：也可以将证书文件拖放到设备中。根据所使用的设备和安卓系统版本，用于存放证书的目录可能各有不同

最后想查看是否安装成功，可进入受信任的凭据里面来查看证书是否安装成功：

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121432853.png)

### 2.1.4 Wireshark

Wireshark（前称Ethereal）是一个网络封包分析软件。网络封包分析软件的功能是截取网络封包，并尽可能显示出最为详细的网络封包资料。Wireshark使用WinPCAP作为接口，直接与网卡进行数据报文交换

在过去，网络封包分析软件是非常昂贵的，或是专门属于盈利用的软件。Ethereal的出现改变了这一切。在GNUGPL通用许可证的保障范围底下，使用者可以以免费的途径取得软件与其源代码，并拥有针对其源代码修改及客制化的权利。Ethereal是全世界最广泛的网络封包分析软件之一

在日常分析Android协议的时候Wireshark反而用到不多，因为它相对于Fiddler跟Charles，它会展示服务器与客户端的每次交互的数据包，包括详细的握手流程，重复、缺失、乱序的TCP请求，重连请求等都可以看到。一般情况下，每一次只需要分析某一个get或者post请求，所以一般情况下使用的频率不高

**注意**：抓包工具不单单只有上面列举的这几种，Android中可用的抓包软件有fiddler、burpsuite、Charls、HttpCanary、Packet Capture、tcpdump、wireshark等等。tcpdump和wireshark可以解决部分不是使用HTTP/HTTPS协议传输数据的APP，用tcpdump抓包，用wireshark分析数据包

### 2.1.5 Android7 抓包问题解决

目前在Android 7.0或以上的系统有启用了对第三方证书的限制，但在Android 7.0以下依旧可以将Fiddler/Charles/Burp的证书安装在用户的CA集中抓取https请求

将Burp或者Charles的证书作为系统级别的信任证书安装。建议重新生产burp证书并重启burp后再导出。系统级别的受信任证书以特殊格式存储在/system/etc/security/cacerts文件夹中。我们可以将Burp的证书写入此位置。

导出一个Burp/Charles证书之后，adb push到模拟器，然后修改后缀为crt直接安全，这种方式在Android 6及之前的版本可用，从Android 7.0开始，Android更改了信任用户安装的证书的默认行为，应用程序仅信任系统级CA。这样就导致安装证书后，如果尝试通过Burp或者Charlse代理访问https网站，系统会提示“该证书并非来自可信的授权中心”

对于Android 7.0 (API 24) 之后，做了些改动，使得系统安全性增加了，导致：

- APP 默认不信任用户域的证书

- - 之前把抓包工具的ssl证书，通过【从SD卡安装】安装到受信任的凭据 -> 用户。就没用了，因为不再受信任了
  - 只信任（安装到）系统域的证书
  - 导致无法抓包https，抓出来的https的请求，都是加了密的，无法看到原文了

对此，总结出相关解决思路和方案：

- 让系统信任抓包工具的ssl证书

- - 作为app的开发者自己：改自己的app的配置，允许https抓包（得到或本身有app的源码，把证书放到受系统信任的系统证书中去）
  - 把证书放到受系统信任的系统证书中去（root权限）

- 绕开https不去校验

- - 借助于其他（JustTrustMe等）工具绕开https的校验（例如XPosed、太极XPosed等框架）

Android7抓包问题，解决方法：

1. 导出Burp的证书后，使用openssl来做一些改动，最后上传到`/system/etc/security/cacerts`

![image-20251212143332551](https://cdn.bili33.top/gh/miku8miku/images@main//202512121433765.png) 

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121433580.png)

```
root@kali:~# openssl x509 -inform DER -in cert-der.crt -out PortSwiggerCA.pem
root@kali:~# openssl x509 -inform PEM -subject_hash_old -in PortSwiggerCA.pem|head -1
root@kali:~# mv PortSwiggerCA.pem 9999.0
```

1. adb传输文件报错`couldn‘t create file：Read-only file system`解决方法

![image-20251212143436278](https://cdn.bili33.top/gh/miku8miku/images@main//202512121434395.png)

```
D:\>adb shell
VOG-AL00:/ # mount -o remount -o rw /system
mount -o remount -o rw /system
VOG-AL00:/ # exit;
exit;

D:\>adb root
adbd is already running as root

D:\>adb remount
remount succeeded

D:\>adb push 9999.0 /system/etc/security/cacerts
330 KB/s (1330 bytes in 0.003s)

D:\>adb shell chmod 644 /system/etc/security/cacerts/9999.0
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121434016.png)

再次输入adb push就能正常传输文件

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121434044.png)

### 2.1.6 Android10 抓包问题解决

Android10以上需要刷入Magisk,在模块里搜索move Cert ,安装模块，重启后证书就已经被移动到系统目录（system/etc/security/cacerts），可以正常抓包了

下载地址：https://github.com/topjohnwu/Magisk

# 0x03 绕过SSL Pinning

**Hook**：Hook 英文翻译过来就是「钩子」的意思，那我们在什么时候使用这个「钩子」呢？在 Android 操作系统中系统维护着自己的一套事件分发机制。应用程序，包括应用触发事件和后台逻辑处理，也是根据事件流程一步步地向下执行。而「钩子」的意思，就是在事件传送到终点前截获并监控事件的传输，像个钩子钩上事件一样，并且能够在钩上事件时，处理一些自己特定的事件

在程序中将其理解为”劫持“可能会更好理解，我们可以通过hook技术来劫持某个对象，从而控制它与其他对象的交互

Hook 的这个本领，使它能够将自身的代码「融入」被勾住（Hook）的程序的进程中，成为目标进程的一个部分。API Hook 技术是一种用于改变 API 执行结果的技术，能够将系统的 API 函数执行重定向。在 Android 系统中使用了沙箱机制，普通用户程序的进程空间都是独立的，程序的运行互不干扰。这就使我们希望通过一个程序改变其他程序的某些行为的想法不能直接实现，但是 Hook 的出现给我们开拓了解决此类问题的道路。当然，根据 Hook 对象与 Hook 后处理的事件方式不同，Hook 还分为不同的种类，比如消息 Hook、API Hook 等

HOOK分类：

- API语言划分

- 分为Hook Java和Hook Native

- - Hook Java主要通过反射和代理来实现，用于在SDK开发环境中修改Java代码
  - Hook Native则应用于在NDK开发环境和系统开发中修改Native代码

进程划分：

- 分为应用程序进程Hook和全局Hook

- - 应用程序进程Hook只能Hook当前所在的应用程序进程
  - 应用程序进程是Zygote进程fork出来的，如果对Zygote进行Hook，就可以实现Hook系统所有的应用程序进程，这就是全局Hook。

- 实现方式划分

- - 通过反射和代理实现，只能Hook当前的应用程序进程
  - 通过Hook框架实现，比如Xposed，可以实现全局Hook，但是需要root。

常用的 Hook 框架：

- 关于 Android 中的 Hook 机制，大致有两个方式：

- - 要 root 权限，直接 Hook 系统，可以干掉所有的 App
  - 免 root 权限，但是只能 Hook 自身，对系统其它 App 无能为力

`SSL Pinning=证书绑定=SSL证书绑定`，说白了就是对方的app内部，只允许承认其自己的特定证书，导致抓包工具的证书不能被识别，所以不被允许，造成无法解密看到https的明文数据

当使用自定义的SSL Pinning方案替代Google提供的官方方法时，事情变得更加困难。大体上，绕过Android SSL Pining的方案都是基于操控 SSL Context来完成的。Frida里的一个Javascript脚本提供了一个通用的解决方法，实现步骤如下：

从设备上加载流氓CA；

- 创建自己的密钥库（KeyStore），其中包含了我们想要信任的 CA
- 创建一个TrustManager，它信任密钥库里的所有证书
- 当应用程序初始化自身的SSLContext时，会调用SSLContext.init()方法，这个时候劫持它，并替换第二个参数（原本是应用程序的TrustManager，将其替换为我们事先创建好的TrustManager），类似这样：SSLContext.init(KeyManager, TrustManager, SecuRandom)

此处采用Frida Hook绕过，当然并不是只有这种方法，例如重打包修改smali里的关键代码或删除等其它方法，大家根据需求选用

目前在Android 7.0或以上的系统有启用了对第三方证书的限制，但在Android 7.0以下依旧可以将Fiddler/Charles/Burp的证书安装在用户的CA集中抓取https请求

Frida：

- https://github.com/frida/frida
- https://frida.re

Frida是个轻量级别的hook框架， 是Python API，用JavaScript调试来逻辑。Frida的核心是用C编写的，并将Google的V8引擎注入到目标进程中，在这些进程中，JS可以完全访问内存，挂钩函数甚至调用进程内的本机函数来执行，可运行在 android、ios、linux、win等各个平台，主要使用的动态二进制插桩技术

使用Python和JS可以使用无风险的API进行快速开发。Frida可以帮助您轻松捕获JS中的错误并为您提供异常而不是崩溃

frida是平台原生app的Greasemonkey，说的专业一点，就是一种动态插桩工具，可以插入一些代码到原生app的内存空间去，（动态地监视和修改其行为），这些原生平台可以是Win、Mac、Linux、Android或者iOS。而且frida还是开源的

Greasemonkey可能大家不明白，它其实就是firefox的一套插件体系，使用它编写的脚本可以直接改变firefox对网页的编排方式，实现想要的任何功能。而且这套插件还是外挂的，非常灵活机动。

Frida框架主要分为两部分：

- 运行在系统上的交互工具frida CLI
- 运行在目标机器上的代码注入工具 frida-server

## 3.1 开胃小菜

若要进行移动APP动态分析，有可能会发现更多的严重性漏洞，比如：身份验证和授权缺陷、内容欺骗、内存泄露、应用程序逻辑缺陷以及跨站脚本攻击

目前的应用程序为了防止中间人攻击使用了SSL Pinning技术，使得客户端在SSL握手之后，也可以通过再次验证服务器证书来避免中间人攻击

- 绕过SSL Pinning

SSL Pinning是一种防止中间人攻击（MITM）的技术，主要机制是在客户端发起请求–>收到服务器发来的证书进行校验，如果收到的证书不被客户端信任，就直接断开连接不继续求情。

可以发现中间人攻击的要点的伪造了一个假的服务端证书给了客户端，客户端误以为真。

为了保证网络传输内容的安全性，在Android、iOS上开发的APP程序通常会开启SSL Pinning(称为“安全会话绑定”或“证书绑定”)。APP允许使用自签名的CA来构建HTTPS通信网络。在所有的通信过程中，对SSL通信证书合法性的验证由KeyStore提供的API来完成，在分析第三方APK的通信流量过程中，SSL Pinning是摆在分析员面前的第一座堡垒。Xposed、sslkillswitch插件的流行，使得绕过SSL Pinning不再是难事

假设，我们要在设备和服务器之间安全地交换一些数据。SSL传输层加密将使数据传输安全可靠？在数据传输之前，如果服务器的SSL证书与请求的主机名和受信任的根证书匹配，则客户端会检查该证书

它不能确保提供的证书是服务器为请求的主机名提供的实际证书。因此，依赖设备的可信存储证书不会使数据传输“安全”

证书锁定（Certificate pinning）是远程服务器在应用程序本身中信任的硬编码证书，因此它将忽略设备证书存储，并将信任自己的硬编码证书，进一步的应用程序将使用该硬编码证书“安全地”与远程服务器通信

当对大多数移动应用程序的HTTP请求进行动态分析时，SSL pinning绕过是需要完成的主要步骤，因为现如今组织对数据隐私和通过网络的数据安全传输变得更加重视，像一些来自中间人攻击的威胁也成为了他们重点关注的对象。

Frida是一个框架，它将脚本注入到原生应用中，以在运行时操作应用程序的逻辑，这是一种更为动态的方法，可用于移动应用的渗透测试任务

**推荐一本书 [Android应用安全实战]，里面详细介绍了Frida 抓包以及各种 hook等技巧(另外本书****配有270分钟二维码视频，帮助读者迅速、深入地掌握Frida框架的使用方法****)，Android 逆向、移动安全渗透等实战中，值得一看的一本书，感兴趣的同学可前往如下京东链接购买**：



1）安装Frida环境

**注**：要安装Frida的前提是有Python安静，建议使用Python3

- pip安装frida-tools

```
pip3 install frida-tools
```

2）一个ADB + 一个Android设备或Android模拟器

ADB的集合工具包，用Android Studio里面的就好了，方便快捷：https://developer.android.google.cn/studio/

![image-20251212143512546](https://cdn.bili33.top/gh/miku8miku/images@main//202512121435756.png)

- 打开开发者选项里的USB调试

- - 设置里面，关于本机，然后狂点系统版本号，即可开启开发者模式
  - 返回设置的关于本机界面，会多一个开发者选项（有些是狂点版本号后直接跳转到开发者选项界面）
  - 点击开启USB调试开关按钮

- 获取当前模拟器的CPU，好选择frida-server的版本

```
adb shell getprop ro.product.cpu.abi
```

Android CPU架构：

| CPU架构     | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| armeabi     | 第5代 ARM v5TE，使用软件浮点运算，兼容所有ARM设备，通用性强，速度慢 |
| armeabi-v7a | 第7代 ARM v7，使用硬件浮点运算，具有高级扩展功能             |
| arm64-v8a   | 第8代，64位,包含 Aarch32、Arch64两个执行状态对应32、64bit    |
| x86         | intel32位，一般用于平板电脑                                  |
| x86_64      | intel64位，一般用于平板电脑                                  |
| mips        | 少接触                                                       |
| mips64      | 少接触                                                       |

- 在手机上运行Frida服务端：

```
adb shell 
su
cd /data/local/tmp/
chmod 777 frida-server-15.1.21-android-x86
./frida-server-15.1.21-android-x86
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121435837.png)

**注**：有些APP会检测本地是否启动了frida-server，以及监听是否开启了27042端口。有反调试的话，可以将名字重新改成别的，fshbbx86之类的，以及更改端口，此处不介绍反检测绕过的知识，感兴趣的同学可以私下自行了解

```
./data/local/tmp/fshbbx86 -l 0.0.0.0:8080  (8080为自定义端口)
```

- 启动frida并修改监听端口（防止部分app监测默认端口）【可选】

```
adb shell /data/local/tmp/frida-server-15.1.21-android-x86 -l 0.0.0.0:8080
```

- 转发frida端口

```
adb forward tcp:27042 tcp:27042
adb forward tcp:27043 tcp:27043
adb forward tcp:38089 tcp:38089
```

- android-ssl-pinning-demo APK样本

一个使用SSL固定来阻止HTTPS MitM拦截的小型演示应用程序，下载地址：https://github.com/httptoolkit/android-ssl-pinning-demo

按下每个按钮将发送具有相应配置的HTTP请求，按钮最初或在请求中时为紫色，然后在请求成功（绿色）/失败（红色）或(带有相应的图标，并弹出错误消息以显示失败)

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121435364.png)

配置Wi-Fi通过Burp抓包后，再次点击对应的案例，颜色变咯，(宝ᴗ宝)们

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121435139.png)

- 下载hook的JS（命名为：fridascript.js）脚本，并上传到Android设备中

注入脚本使用某国外大神写的基于JS的注入脚本：https://techblog.mediaservice.net/wp-content/uploads/2017/07/frida-android-repinning_sa-1.js

```
/* 

   Android SSL Re-pinning frida script v0.2 030417-pier

$ adb push burpca-cert-der.crt /data/local/tmp/cert-der.crt

   $ frida -U -f it.app.mobile -l frida-android-repinning.js --no-pause

https://techblog.mediaservice.net/2017/07/universal-android-ssl-pinning-bypass-with-frida/

   

   UPDATE 20191605: Fixed undeclared var. Thanks to @oleavr and @ehsanpc9999 !

*/

setTimeout(function(){

    Java.perform(function (){

     console.log("");

     console.log("[.] Cert Pinning Bypass/Re-Pinning");

var CertificateFactory = Java.use("java.security.cert.CertificateFactory");

     var FileInputStream = Java.use("java.io.FileInputStream");

     var BufferedInputStream = Java.use("java.io.BufferedInputStream");

     var X509Certificate = Java.use("java.security.cert.X509Certificate");

     var KeyStore = Java.use("java.security.KeyStore");

     var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");

     var SSLContext = Java.use("javax.net.ssl.SSLContext");

// Load CAs from an InputStream

     console.log("[+] Loading our CA...")

     var cf = CertificateFactory.getInstance("X.509");

     

     try {

      var fileInputStream = FileInputStream.$new("/data/local/tmp/cert-der.crt");

     }

     catch(err) {

      console.log("[o] " + err);

     }

     

     var bufferedInputStream = BufferedInputStream.$new(fileInputStream);

    var ca = cf.generateCertificate(bufferedInputStream);

     bufferedInputStream.close();

var certInfo = Java.cast(ca, X509Certificate);

     console.log("[o] Our CA Info: " + certInfo.getSubjectDN());

// Create a KeyStore containing our trusted CAs

     console.log("[+] Creating a KeyStore for our CA...");

     var keyStoreType = KeyStore.getDefaultType();

     var keyStore = KeyStore.getInstance(keyStoreType);

     keyStore.load(null, null);

     keyStore.setCertificateEntry("ca", ca);

     

     // Create a TrustManager that trusts the CAs in our KeyStore

     console.log("[+] Creating a TrustManager that trusts the CA in our KeyStore...");

     var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();

     var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);

     tmf.init(keyStore);

     console.log("[+] Our TrustManager is ready...");

console.log("[+] Hijacking SSLContext methods now...")

     console.log("[-] Waiting for the app to invoke SSLContext.init()...")

SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(a,b,c) {

      console.log("[o] App invoked javax.net.ssl.SSLContext.init...");

      SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);

      console.log("[+] SSLContext initialized with our custom TrustManager!");

     }

    });

},0);
```

如果选用上面的JS脚本需推送代理的 CA 证书到设备中：

- 为了能够拦截流量，frida需要访问我们的Burpsuite CA证书，将证书推送到设备里
- 将证书推送到设备并放置在与frida-server相同的位置，cacert.der改为cert-der.crt（因为此名称和路径已在fridascript.js中提到，所以将改为cacert.der改为cert-der.crt）

```
adb push cert-der.crt /data/local/tmp/
```

或另外一个版本

```
setTimeout(function(){
Java.perform(function() {
    var array_list = Java.use("java.util.ArrayList");
    var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');
 
    ApiClient.checkTrustedRecursive.implementation = function(a1, a2, a3, a4, a5, a6) {
        // console.log('Bypassing SSL Pinning');
        var k = array_list.$new();
        return k;
        }
    });
},0);
```

- 通过`frida-ps -U`找包名

```
# 要先Android 设备里面启动frida-server，以及转发frida端口后才能使用
frida-ps -U
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121435294.png)

以上查看app包，显示出来太多了，你根本不知道哪个才是我们需要的包名，可以使用下面的命令查看

```
adb shell pm list packages：打印设备上的所有软件包
 
adb shell pm list packages -f：输出包和包相关联的文件
 
adb shell pm list packages -d：只输出禁用的包由于本机禁用没有，输出为空
 
adb shell pm list packages -e：只输出启用的包
 
adb shell pm list packages -s：只输出系统的包
 
adb shell pm list packages -3：只输出第三方的包
 
adb shell pm list packages -i：只输出包和安装信息（安装来源）
 
adb shell pm list packages -u：只输出包和未安装包信息（安装来源）
 
adb shell pm list packages --user ：根据用户id查询用户的空间的所有包，USER_ID代表当前连接设备的顺序，从零开始
```

或使用adb 直接找到当前运行APP的package name

```
adb shell "dumpsys window | grep mCurrentFocus"
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121435729.png)

- 通过ps命令找到要注入的，正在运行APP的package name

```
ps | grep ech.httptoolkit.pinning_demo
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436498.png)

```
frida -U -f tech.httptoolkit.pinning_demo -l D:\t\fridascript.js --no-paus
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436008.png)

注意：这里是我脚本代码复制的时候出了点问题，重新复制一下国外大神的即可，如下：

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436174.png)

如上图，应用程序调用了四次SSLContext.init()，这意味着它验证了四个不同的证书

但貌似绕过的效果不怎么好呀，咋们换一个JS脚本试试：

```
setTimeout(function(){
Java.perform(function() {
    var array_list = Java.use("java.util.ArrayList");
    var ApiClient = Java.use('com.android.org.conscrypt.TrustManagerImpl');
 
    ApiClient.checkTrustedRecursive.implementation = function(a1, a2, a3, a4, a5, a6) {
        // console.log('Bypassing SSL Pinning');
        var k = array_list.$new();
        return k;
        }
    });
},0);
```

Burp记得要设置代理，指向电脑的Burp监听端口，Burp即可截取到通信过程的包，如下：

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121438849.png)

**注**：另外一个脚本貌似效果更好一点，大家根据实际情况选择需求使用

## 3.2 SSL Pinning（代码校验）

SSL PINNING是Google官方推荐的校验方式，SSL PINNING 就是说通过客户端检查服务端证书是否真的是服务端证书来判断是否被中间人攻击。由于客户端需要验证服务端证书的正确性，那大原则上就是说客户端必须要有能判断正确性的依据。对于Android APP来说通常有两种方式：

- 客户端持有证书公钥hash
- 客户端持有证书文件

OkHttp3 中使用 public final class CertificatePinner extends Object 定义类来约束和设置哪些证书可信，一般类似如下代码：

```
rivate static final String CA_DOMAIN = "*.xxx.com";
    private static final String CA_PUBLIC_KEY = "sha256/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

    .....

    CertificatePinner pinner = new CertificatePinner.Builder()
                .add(CA_DOMAIN, CA_PUBLIC_KEY)
                .build();

    .....

    OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder()
            .certificatePinner(pinner);
```

------

这里多啰嗦一句：OkHttp是一个关于网络请求的第三方类库，其中封装了网络请求的get、post等操作的底层实现，是Android端目前最为火热的网络请求框架之一

get同步请求：首先使用new创建OkHttpClient对象。然后调用OkHttpClient对象的newCall方法生成一个Call对象，该方法接收一个Request对象，Request对象存储的就是我们的请求URL和请求参数。最后执行Call对象的execute方法，得到Response对象，这个Response对象就是返回的结果。

get异步请求：首先使用new创建OkHttpClient对象。然后调用OkHttpClient对象的newCall方法生成一个Call对象，该方法接收一个Request对象，Request对象存储的是我们的请求URL和请求参数。最后执行Call对象的enqueue方法，该方法接收一个Callback回调对象，在回调对象的onResponse方法中拿到Response对象，这就是返回的结果。总结：get的同步方法和异步方法的差别在于同步方法需要手动开启一个线程执行，而异步方法不需要（其实是使用了内部的线程）。

post同步请求: post方法的同步请求和get方法的同步请求几乎是一样的 post方法的同步请求和get方法的同步请求的区别在于，post方法生成Request对象时多执行了post(RequestBody)方法， 而RequestBody对象的子类是FormBody类，所以可以使用FormBody对象创建键值对参数。

post异步请求: 异步请求post方法的异步请求和get方法的异步请求也是非常相似的，区别也是同步请求的区别。

Retrofit是一个RESTful的HTTP网络请求框架，它是基于OkHttp的。它是通过注解配置网络参数的，支持多种数据的解析和序列化：

- 添加网络请求的接口
- 创建Retrofit对象
- 创建网络请求接口实例
- 发送网络请求

------

以OkHttp网络框架为例，下面的代码段也是通过这两种方式进行了证书验证。这样代理软件充当服务端的时候发给APP的证书就不能通过SSL PINNING验证，示列代码如下：

```
/*
* https协议 SSL Pinning
* 证书公钥绑定：验证证书公钥 baidu.com 使用CertificatePinner
* 证书文件绑定：验证证书文件 bing.com  使用SSLSocketFactory
*/
button_SSL_PINNING_with_key.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        new Thread(new Runnable(){
            @RequiresApi(api = Build.VERSION_CODES.N)
            @Override
            public void run() {
                final String CA_DOMAIN = "www.baidu.com";
                //获取目标公钥: openssl s_client -connect www.baidu.com:443 -servername www.baidu.com | openssl x509 -pubkey -noout | openssl rsa -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
                final String CA_PUBLIC_KEY = "sha256//558pd1Y5Vercv1ZoSqOrJWDsh9sTMEolM6T8csLucQ=";
                //只校验公钥
                CertificatePinner pinner = new CertificatePinner.Builder()
                        .add(CA_DOMAIN, CA_PUBLIC_KEY)
                        .build();
                OkHttpClient pClient = client.newBuilder().certificatePinner(pinner).build();
                Request request = new Request.Builder()
                        .url("https://www.baidu.com/?q=SSLPinningCode")
                        .build();
                Message message = new Message();
                message.what = 1;
                try (Response response = pClient.newCall(request).execute()) {
                    message.obj = "https SSL_PINNING_with_key access baidu.com success";
                    Log.d(TAG, "https SSL_PINNING_with_key access baidu.com success return code:"+response.code());
                } catch (IOException e) {
                    message.obj = "https SSL_PINNING_with_key access baidu.com failed";
                    Log.d(TAG, "https SSL_PINNING_with_key access baidu.com failed");
                    e.printStackTrace();
                }


                try {
                    // 获取证书输入流
                    // 获取证书 openssl s_client -connect bing.com:443 -servername bing.com | openssl x509 -out bing.pem
                    InputStream openRawResource = getApplicationContext().getResources().openRawResource(R.raw.bing); //R.raw.bing是bing.com的正确证书，R.raw.bing2_so是hostname=bing.com的so.com的证书，可视为用作测试的虚假bing.com证书
                    Certificate ca = CertificateFactory.getInstance("X.509").generateCertificate(openRawResource);
                    // 创建 Keystore 包含我们的证书
                    KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
                    keyStore.load(null, null);
                    keyStore.setCertificateEntry("ca", ca);
                    // 创建一个 TrustManager 仅把 Keystore 中的证书 作为信任的锚点
                    TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm()); // 建议不要使用自己实现的X509TrustManager，而是使用默认的X509TrustManager
                    trustManagerFactory.init(keyStore);
                    // 用 TrustManager 初始化一个 SSLContext
                    sslContext = SSLContext.getInstance("TLS");  //定义：public static SSLContext sslContext = null;
                    sslContext.init(null, trustManagerFactory.getTrustManagers(), new SecureRandom());

                    OkHttpClient pClient2 = client.newBuilder().sslSocketFactory(sslContext.getSocketFactory(), (X509TrustManager) trustManagerFactory.getTrustManagers()[0]).build();
                    Request request2 = new Request.Builder()
                            .url("https://www.bing.com/?q=SSLPinningCAfile")
                            .build();
                    try (Response response2 = pClient2.newCall(request2).execute()) {
                        message.obj += "\nhttps SSL_PINNING_with_CA_file access bing.com success";
                        Log.d(TAG, "https SSL_PINNING_with_CA_file access bing.com success return code:"+response2.code());
                    } catch (IOException e) {
                        message.obj += "\nhttps SSL_PINNING_with_CA_file access bing.com failed";
                        Log.d(TAG, "https SSL_PINNING_with_CA_file access bing.com failed");
                        e.printStackTrace();
                    }

                } catch (KeyStoreException | CertificateException | IOException | NoSuchAlgorithmException | KeyManagementException e) {
                    e.printStackTrace();
                }
                mHandler.sendMessage(message);
            }
        }).start();
    }
});
```

- 配置文件

通过res/xml/network_security_config.xml配置文件对证书进行校验是官方推荐使用的方法，配置方式可以细分为两种，使用证书校验和公钥校验，具体示列如下:

```
    <domain-config>
        <domain includeSubdomains="true">bing.comdomain>
        <trust-anchors>
            
            <certificates src="@raw/bing"/>
        trust-anchors>

    domain-config>

    
    <domain-config>
        <domain includeSubdomains="true">so.comdomain>
        
        <pin-set expiration="2099-01-01">
            <pin digest="SHA-256">XCXZ8ud+eneT+di9eIMfC7Z2x+p2cr2KJ3e7TnIEOx4=pin>
        pin-set>
    domain-config>  
```

### 3.2.1 绕过方式：利用Frida对上述证书绑定进行动作Hook，阻断绑定

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436093.png)

开启抓包后，无法再成功发送HTTPS的请求

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436583.png)

adb shell logcat 查看一下

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436986.png)

关键报错信息：`javax.net.ssl.SSLHandshakeException: java.security.cert.CertPathValidatorException: Trust anchor for certification path not found`

原因是Burp自签名证书没有经过CA认证，抛出的异常，那么绕过的方案就是忽略https的证书校验，需要hook掉OpenSSLSocketImpl

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436344.png) 

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121436840.png)

hook掉https的校验后，可以看到成功hook掉bing.com的SSLSocketFactory校验，但baidu的公钥是失败了，接着看看日志

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121437034.png) ![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121437512.png)

- **SSL Pinning（代码校验）JS 脚本**

**注**：并不是所有的SSL Pinning代码校验都是该脚本绕过，需结合实际情况来编写JS脚本

```
/*  Android ssl certificate pinning bypass script for various methods

	Run with:
	frida -U -f [APP_ID] -l fridascript.js --no-pause
*/
setTimeout(function() {
Java.perform(function () {
    // 绕过OpenSSLSocketImpl Conscrypt
    var OpenSSLSocketImpl = Java.use('com.android.org.conscrypt.OpenSSLSocketImpl');
	OpenSSLSocketImpl.verifyCertificateChain.implementation = function (certRefs, JavaObject, authMethod) {
	     console.log('[+] Bypassing OpenSSLSocketImpl Conscrypt');
	};

	// Bypass check$okhttp
	var okhttp3_cheak = Java.use('okhttp3.CertificatePinner');
	okhttp3_cheak['check$okhttp'].implementation = function (a, b) {
		console.log('[+] Bypassing okhttp3_cheak OK: ' + a);
	};
});
}, 0);
```

**注**：根据特征搜list``，如下代码所示，然后可以发现CertificatePinner.check()方法的声明，知道了传入的参数是string类型和Certificate的List类型，并且声明了一个SSLPeerUnverifiedException异常，接下来就是hook掉对应的方法即可。多提一下就算是APK做了魂系，但几个关键的类名是系统自带类，是无法混淆的，例如`"List"`

```
public void check(String hostname, List peerCertificates)
      throws SSLPeerUnverifiedException
```

从上可以看出，此处校验使用了okhttp库，其实绝大多数APP都采用的是 Okhttp 这个库， 在 OKhttp 中实现 SSL Pining 十分简单。默认情况下, okhttp信任主机平台的证书须发机构。此策略最大化了连接,但它会受到证书须发机构攻击,如2011 DigiNotar攻击。它还假设您的https服务器的证书是由证书须发机构签名的。使用CertificatePinner 限制信任哪些证书和证书须发机构。证书固定增加了安全性,但限制了服务器团队更新其TLS证书的能力。未经服务器的tls管理员许可,请勿使用证书固定。

Okhttp代码实现：

```
public CertificatePinning() {
  client = new OkHttpClient.Builder()
      .certificatePinner(new CertificatePinner.Builder()
          .add("publicobject.com", "sha256/afwiKY3RxoMmLkuRW1l7QsPZTJPwDS2pdDROQjXw8ig=")
          .build())
      .build();
}
public void run() throws Exception {
  Request request = new Request.Builder()
      .url("https://publicobject.com/robots.txt")
      .build();

  Response response = client.newCall(request).execute();
  if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

  for (Certificate certificate : response.handshake().peerCertificates()) {
    System.out.println(CertificatePinner.pin(certificate));
  }
}
```

此外，另一种实现，是直接在 AndroidManifest.xml 中指定：

```
<network-security-config>
    <domain-config>
        <domain includeSubdomains="false">sha512.badssl.comdomain>
        <pin-set>
            <pin digest="SHA-256">5kJvNEMw0KjrCAu7eXY5HZdvyCS13BbA0VJG1RSP91w=pin>
        pin-set>
    domain-config>
network-security-config>
```

通过SSL PINNING绑定证书以后，设置系统代理，即使将抓包工具的证书导入到系统目录，抓包时依然会发现App报错，报错的原因是APP预置的证书信息与服务端返回的证书信息校验不一致，导致握手失败，报错信息如下：

- `javax.net.ssl.SSLPeerUnverifiedException: Certificate pinning failure!`
- `javax.net.ssl.SSLHandshakeException: java.security.cert.CertPathValidatorException: Trust anchor for certification path not found.`

## 3.3 SSL Pinning（配置文件）

通过res/xml/network_security_config.xml配置文件对证书进行校验是官方推荐使用的方法，配置方式为两种：

- 公钥校验
- 证书校验

res/xml/network_security_config.xml：

```
<network-security-config xmlns:tools="http://schemas.android.com/tools">
    
    <base-config cleartextTrafficPermitted="true"
        tools:ignore="InsecureBaseConfiguration" />
    
    <domain-config>
        <domain includeSubdomains="true">sogou.comdomain>
        <trust-anchors>
            
            <certificates src="@raw/sogou"/>
        trust-anchors>
    domain-config>

    
    <domain-config>
        <domain includeSubdomains="true">zhihu.comdomain>
        
        <pin-set expiration="2099-01-01"
            tools:ignore="MissingBackupPin">
            <pin digest="SHA-256">vzXV96/gpZMyyNNhyTdjtX0/NUVYTtmYqWcVVaUtTdQ=pin>
        pin-set>
    domain-config>
network-security-config>
```

配置好以后就可以对上述指定的域名进行https访问，将会自动对证书进行校验，请求代码：

```
/*
* https协议 SSL PINNING
* 证书绑定验证 配置在 @xml/network_security_config 中
* sogou.com 使用 sogou.pem 验证证书
* so.com 使用 sha256 key 验证
*/
button_SSL_PINNING_with_CA.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        new Thread(new Runnable(){
            @RequiresApi(api = Build.VERSION_CODES.N)
            @Override
            public void run() {
                OkHttpClient pClient = client.newBuilder().build();
                Request request = new Request.Builder()
                        .url("https://www.sogou.com/web?query=SSLPinningXML")
                        .build();
                Request request2 = new Request.Builder()
                        .url("https://www.zhihu.com/")
                        .build();
                Message message = new Message();
                message.what = 1;
                try (Response response = pClient.newCall(request).execute()) {
                    message.obj = "https SSL_PINNING_with_CA, config in xml with CA.pem file access sogou.com success";
                    Log.d(TAG, "https SSL_PINNING_with_CA, config in xml with CA.pem file access sogou.com success return code:"+response.code());
                } catch (IOException e) {
                    message.obj = "https SSL_PINNING_with_CA, config in xml with CA.pem file access sogou.com failed";
                    Log.d(TAG, "https SSL_PINNING_with_CA, config in xml with CA.pem file access sogou.com failed");
                    e.printStackTrace();
                }
                try (Response response = pClient.newCall(request2).execute()) {
                    message.obj += "\nhttps SSL_PINNING_with_CA, config in xml with key access zhihu.com success";
                    Log.d(TAG, "https SSL_PINNING_with_CA, config in xml with key access zhihu.com success return code:"+response.code());
                } catch (IOException e) {
                    message.obj += "\nhttps SSL_PINNING_with_CA, config in xml with key access zhihu.com failed";
                    Log.d(TAG, "https SSL_PINNING_with_CA, config in xml with key access zhihu.com failed");
                    e.printStackTrace();
                }
                mHandler.sendMessage(message);
            }
        }).start();
    }
});
```

### 3.3.1 绕过方式：该证书绑定实现，绕过方式同SSL PINNING（代码校验）绕过

```
/*  Android ssl certificate pinning bypass script for various methods

	Run with:
	frida -U -f [APP_ID] -l fridascript.js --no-pause
*/
setTimeout(function() {
Java.perform(function () {

    // 绕过OpenSSLSocketImpl Conscrypt
    var OpenSSLSocketImpl = Java.use('com.android.org.conscrypt.OpenSSLSocketImpl');
	OpenSSLSocketImpl.verifyCertificateChain.implementation = function (certRefs, JavaObject, authMethod) {
	     console.log('[+] Bypassing OpenSSLSocketImpl Conscrypt');
	};

});
}, 0);
```

- 不嫌麻烦的话，也可以用apktool将APK进行反编译，修改smali对应的内容：

```
java -jar apktool.jar d -f httpstest.apk -o httpstest
```

将里面的配置文件的证书以及密钥替换掉，即可，BurpSuite 导出的证书生成Pem，使用openssl命令：

```
openssl x509 -inform der -in xxxx.der -outform pem -out test.pem
```

## 3.4 思考：能否绕过所有APP SSL Pinning机制？

- 比如，一些银行类APP，安全防护机制比较健全，会进行注入的检测，所以无法使用Frida进行注入，需要进入绕过反检测机制才能抓到包，本文叙述的方法适用大部分APP

- 那么是否能抓到所有通信包？

- - 需要看具体APP业务逻辑，现在有一些APP的重要接口或者新接口会走socket通信，目前对于socket通信的包，还没有比较好的截取办法

- 是否可以使用Fiddler、Charles、HttpCanary等工具抓包？

- - 可以，但有些需要导出抓包工具的证书来用JS绕过

# 0x04 其它抓包姿势

## 4.1 安卓模拟器

APP开发目前主流的都是用的前后端分离开发，随着版本的迭代，可能就会存在不同版本的后端接口存在，而且新版的接口和老版的接口其实返回的数据差异性很小，为什么会这样呢？因为兼容性，会依旧留下旧版接口，因为每个用户使用的手机不一样，安卓或者IOS版本不同，系统版本也就会不同，且老款手机因为内存太小，不会更新新版的APP包等多方面因素，结果就是会留下旧版接口，而且这个旧版接口安全性比新版低很多，所以可用低版本的饿安卓机来抓包，就正常的抓包流程即可，不出意外的话，可能还用的普通的http请求

为什么高版本的安卓就抓不到包呢？因为高版本的（安卓7以上）开始，安卓自带了一些安全机制，本质上就是只信任系统证书，不再信任用户自己安装的证书了，我们装的SSL代理证书因为是自己装的就不再被系统信任了

使用低版本安卓模拟器，模拟低版本安卓然后抓包，对证书信任，修改APP设置

## 4.2 HttpCanary

HttpCanary，手机抓包大师，最强Android抓包工具。无需ROOT权限，安卓专业强大的HTTP协议抓包和分析工具，支持对HTTP1.0/1.1/2/HTTPS/WebSocket/TLS/SSL等网络协议抓取和注入，支持静态注入和动态注入模式，对抓包内容请求参数，修改请求参数、请求头、请求体、响应码、响应头和响应体等数据

下载地址：https://github.com/MegatronKing/HttpCanary

**注**：Android7以及以下可以抓包，Android10反正不行

## 4.3 VirtualApp

开始测试之前，一般看这个app是否是自有app，如果是自有的，谷歌有debug模式，该模式下让app默认可以信任用户域的证书（trust-anchors）,如果是非自有，用xposed+JustTrustMe即可，但是使用Xposed框架需要root，网上那些微信魔改小功能，什么自动抢红包，防消息撤回之类的就是用的xposed框架改的，用JustTrustMe来信任用户安装的证书

目前市面上有VitualXposed、太极等虚拟的框架，不用root也可以操作。

太极Xposed：https://taichi.cool/zh/

- 太极-阴（免root）
- 太极-阳（需要root）

太极Xposed针对有些app的话，太极-阴不适用，只能太极-阳

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121437014.png)

此外，VirtualApp是一款运行于Android系统的沙盒产品，可以理解为轻量级的“Android虚拟机”。其产品形态为高可扩展，可定制的集成SDK，您可以基于VA或者使用VA定制开发各种看似不可能完成的项目。VA目前被广泛应用于插件化开发、无感知热更新、云控自动化、多开、手游租号、手游手柄免激活、区块链、移动办公安全、军队政府保密、手机模拟信息、脚本自动化、自动化测试等技术领域。

VirtualApp可以创建一个虚拟空间，你可以在虚拟空间内任意的安装、启动和卸载APK，这一切都与外部隔离，如同一个沙盒，APK无需在外部安装，可以免root操作，然后正常抓包https

## 4.4 Xposed + JustTrustMe

xposed 是一款 Android 端的 Hook 工具，利用它我们可以 Hook App 里面的关键方法的执行逻辑，绕过 HTTPS 的证书校验过程。

JustTrustMe是Github上面的一个开源项目，是xposed中的一个模块，用于禁止SSL证书验证

JustTrustMe 几乎 hook 住了所有有关证书验证的操作通过修改返回值、忽略证书错误等方法来进行绕过。但是 JustTrustMe 没有 hook public OkHttpClient.Builder hostnameVerifier（Okhttp 中如果不指定 HostnameVerifier 默认调用的是 OkHostnameVerifier.verify 进行服务器主机名校验；如果设置了 HostnameVerifier，则默认调用的是自定义的 verify 方法，而 OkHttpClient.Builder 是用来对 OkHttpClient 进行设置的），所以这里就很可能出问题

JustTrustMe模块的局限性：JustTrustMe使用HOOK的方式去修改证书校验的结果，但是开发人员也可以使用代码混淆的办法来对抗hook。开发人员只需要将书校验的那部分代码混淆，就能够防止通用的SSL unpinning方法。这时候就只能反编译代码，自己去寻找代码中进行证书校验的位置，然后自己编写hook代码去进行SSL pinning的绕过

当然基于 Xposed 的类似插件也有很多，如 SSLKiller、sslunpining 等等，可以自行搜索，不过 Xposed 的安装必须要 ROOT，如果不想 root 的话，可以使用VirtualXposed

下载地址：https://github.com/Fuzion24/JustTrustMe

## 4.5 Frida+r0capture

r0capture 是一个 python 脚本，基于 frida_ssl_logger 开发，侧重点不同在于 frida_ssl_logger 是抓 ssl 和跨平台，而 r0capture 旨在抓到所有的包，其中安卓7、8、9、10 测试可用。

优势：

- 无视所有证书校验或绑定，不用考虑任何证书的事情
- 通杀TCP/IP四层模型中的应用层中的全部协议
- 通杀协议包括：Http,WebSocket,Ftp,Xmpp,Imap,Smtp,Protobuf 等等、以及它们的SSL版本
- 通杀所有应用层框架，包括 HttpUrlConnection、Okhttp1/3/4、Retrofit/Volley等等
- 无视加固，不管是整体壳还是二代壳或VMP，不用考虑加固的事情

下载地址：https://github.com/bin-maker/r0capture

## 4.6 Frida+Objection

Objection 是一个基于 Frida 开发的命令行工具，它可以很方便的 Hook Java 函数和类，并输出参数，调用栈，返回值。

因为 Objection 是基于 Frida 的所以必须先安装 Frida 然后才能安装 Objection

## 4.7 Proxifier+Android模拟器+BurpSuite

Proxifier 软件是一款极其强大的 socks5 客户端，同时也是一款强大的工具。Proxifier 支持 TCP，UDP 协议，支持Xp，Vista，Win7，支持 socks4，socks5，http 代理协议，可以让不支持通过代理服务器工作的网络程序能通过HTTPS 或 SOCKS 代理或代理链。

利用 Proxifier 代理 PC 中模拟器的进程流量，并与 BurpSuite 联动来抓包

## 4.8 Drony+BurpSuite

Drony 支持 App 定向的 http,https 抓包。手机上装的 app 多了，会很多数据上来，要加过滤规则，正式环境测试环境都要加连上了代理，有些普通使用的 app （非抓包 app）会没法使用，会出现经常要设置代理，关闭代理，需要又要设置（有些手机会保存代理 ip 还好，不保存的还要每次手写）

将手机上的所有流量都重定向到 drony 自身，这样 drony 就可以管理所有手机上的网络流量，然后对手机上不同 APP 的流量进行单独配置，再转发到 BurpSuite上

Drony 可以解决上述痛点，不需要手机在 wifi 里设置代理。可以通过该 app 直接指定目标 app 才走代理，对其他 app 不可见

下载地址：https://www.apkshub.com/app/org.sandroproxy.drony

## 4.9 VitualXposed框架+JustTrustMe模块

VitualXposed可以在不需要设备root的情况下，修改App的行为。此应用的工作原理类似于应用分身功能，会将应用安装到一个虚拟独立的环境当中，其内部会自带一个已经激活了的Xposed工具

只需要将想要的软件安装到 VirtualXposed 里面就能使用 Xposed 的功能了，然后配合 JustTrustMe 插件也能解决 SSL Pining 的问题

下载地址：

- vxposed：https://vxposed.com
- JustTrustMe：https://github.com/Fuzion24/JustTrustMe

将VitualXposed安装到真机中，点击应用按钮->添加应用，将要调试的App、JustTrustMe.apk进行安装

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121437238.png)

打开Xposed，选择左上角导航栏->模块，勾选JustTrustMe

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121437177.png)

重启VitualXposed应用，重新打开APP，通过Fiddler抓包，可以看到App请求正常，https请求能抓到

## 4.10 特殊改写

对一些关键的校验方法进行了 Hook 和改写，去除了一些校验逻辑。但对于一些代码混淆后的 App 来说，其校验 HTTPS 证书的方法名直接变了，那么 JustTrustMe 这样的插件就无法 Hook 这些方法，因此也就无效了

## 4.11 强制全局代理

很多APP中会设置如下检测：

```
String property = System.getProperty("https.proxyHost");
String property = System.getProperty("https.proxyPort");
if(!TextUtils.isEmpty(property)){
	return new Proxy(Proxy,Type.HTTP, new InetSockerAddress(Property, Integer.parseInt(property2)))
}
```

为了绕过系统代理检测，可以使用Proxy Droid。手机root后，使用Proxy Droid 或Postern实现强制全局代理，让ssl代理证书生效，proxy Droid可以在UpToDown，ApkHere等的地方下载

1）对ProxyDroid进⾏配置（基本配置）

- Auto Setting不勾选，⼿动进⾏配置

- - Host：输⼊代理服务器IP
  - Port：输⼊代理服务器端⼝

- Proxy Type选择代理服务器提供服务类型：选择HTTP

- Auto Connect为当2G/3G/WIFI⽹络开启时，⾃动开启代理服务。不勾选，⼿动启动，以获取最⼤灵活性

- Bypass Addresses：相当于⿊名单列表，选择排除代理的IP范围，有需要的可以⾃⼰⼿动设置

2）认证信息配置

- Enable Authentication：如果代理服务器需要账户、密码认证，勾选
- User：认证账户名
- Password：认证密码
- NTLM Authentication：NTLM/ NTLM2，Windows早期的⼀种认证⽅式，不⽤勾选

3） 特征设置

- Global Proxy：⼀定要勾选，即为全局代理，代理所有App
- Individual Proxy：单独代理所选App，勾选了第⼀条的不⽤管
- Bypass Mode：勾选了代表第⼆条中所选App不代理，勾选了第⼀条的不⽤管
- DNS Proxy：开启DNS代理。

4）通知设置

- Ringtone：选择通知铃声

5）都设置完成后，开启Proxy Switch即可。注意：如果使⽤ProxyDroid，⽆需在系统wifi处设置代理

下载地址：https://apkpure.com/proxydroid/org.proxydroid

Postern是Android系统里一款非常流行的代理/ 虚拟专用网络管理程序，是一个Android下的全局代理工具，可以说是安卓版surge，它可以添加规则，屏蔽广告。

Postern支持的代理协议有:

- SSH隧道
- Shadowsocks
- SOCKS5代理
- HTTPS/HTTP CONNECT method隧道
- gfw.press

下载地址：https://apkpure.com/postern/com.tunnelworkshop.postern

## 4.12 VPN抓包

Packet Capture 一款依托安卓系统自身 VPN 来达到免 Root 抓取数据包的应用程序。它是一个强大的调试应用，可以捕获 Android 手机上的任何网络流量，它利用 Android 系统的 VPN service 完成网络请求的捕获，无需root，并可以通过中间人技术解密抓取到的 https 请求

下载地址：

- PCAPdroid：https://github.com/emanuele-f/PCAPdroid
- Packet Capture：https://apkpure.com/packet-capture/app.greyshirts.sslcapture

**注**：Android 10该方法不行，建议低版本使用

## 4.13 魔改JustTrustMe

在JustTrustMe插件上增加一个可以运行时根据实际情况调整ssl检测的功能，对hook增加动态适配

看雪论坛里找到一个魔改版JustTrustMePlus：https://files.cnblogs.com/files/Eeyhan/JustMePlush--8.25.0.10.apk

## 4.14 SSL Unpining

此Xposed模块比 JustTrustMe 更稳定、hook 的更全面，一般可以直接 hook 抓包，而且由于它同样不需要我们编写代码，是最方便新手的了。

下载地址：https://github.com/ac-pm/SSLUnpinning_Xposed

## 4.15 tcpdump

在Android 本地直接抓全部网卡流量，保存到test.pcap，再到本地过滤数据包，最后放到抓包工具中进行重放

```
./tcpdump -i any -w test.pcap
```

下载地址：https://www.androidtcpdump.com/android-tcpdump/downloads

```
# adb push tcpdump /data/local/tmp
# adb shell
# su
# chmod 755 tcpdump
# ./tcpdump -i any -p -s 0 -w /sdcard/capture.pcap
$ adb pull /sdcard/capture.pcap /pcpath
使⽤Wireshark打开 pcap⽂件
$ wireshark /pcpath/capture.pcap
```

## 4.16 BurpSuite透明代理模式

使用Burp的透明代理模式，在BurpSuite中监听80和443这两个端口，并且将其设置为透明代理模式：

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121437632.png)

打开模拟器，输入以下命令开启DNAT转发，将Android中的所有流量转发给Burp：

```
adb shell
su
iptables -t nat -A OUTPUT -d 0.0.0.0/0 -p tcp -j DNAT --to 172.20.10.3（模拟器iP）
```

## 4.17 反编译APP包（重打包+修改smali/xml文件）

如果是 App 的开发者或者把 apk 逆向出来了，那么可以直接通过修改 AndroidManifest.xml 文件，在 apk 里面添加证书的信任规则即可

用apktools修改配置文件里的ssl证书检测部分，可利用jadx等工具分析源码，然后重新打包，再抓包分析

apkshell 查一下壳，App是否有加固：https://github.com/bin-maker/apkshell

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121438219.png)

提示该App并没有加固，但不一定是用的国内或常规的加壳方式，可能还需要结合手工判断是否加固。如果加壳了，还要先脱壳，脱壳的方法很多，机脱/手脱/半手脱 等等，大部分脱壳都是从内存、从Android源码层Hook的一键式脱壳，不过像最新企业bb等加固，则要用静态手脱

用apktool将APK进行反编译，反编译成功后会得到pinning-demo 文件

```
java -jar apktool.jar d -f pinning-demo.apk -o pinning-demo
```

反编译后，我们可以看到 AndroidManifest 文件，AndroidManifest 官方解释是应用清单，每个应用的根目录中都必须包含一个，并且文件名必须一模一样。这个文件中包含了APP的配置信息，系统需要根据里面的内容运行APP的代码，显示界面。

我们打开 AndroidManifest ,找到 application 标签，添加内容：

```
android:debuggable="true" android:networkSecurityConfig="@xml/network_security_config"
```

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121438148.png)

ebuggable="true" 是开启允许我们调试，方便打印输出日志，networkSecurityConfig 是Android 7.0新增的安全功能，允许我们在不修改App应用本身代码的情况下，来自定义管理网络安全配置文件：

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202512121438334.png)

下面介绍一下网络安全配置文件的一些信息

### 4.16.1 配置自定义CA

假设您要连接到使用自签名 SSL 证书的主机，或者连接到其 SSL 证书由您信任的非公共 CA（如公司的内部 CA）颁发的主机。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <domain-config> 
    <domain includeSubdomains="true">example.comdomain>  
    <trust-anchors> 
      <certificates src="@raw/my_ca"/> 
    trust-anchors> 
  domain-config> 
network-security-config>
```

以 PEM 或 DER 格式将自签名或非公共 CA 证书添加到 `res/raw/my_ca`

#### 4.16.1.1 限制可信 CA 集

如果应用并不一定想要信任系统信任的所有 CA，则可以自行指定，即缩减要信任的 CA 集。这样可防止应用信任由任何其他 CA 颁发的欺诈性证书。

限制可信 CA 集的配置与针对特定网域信任自定义 CA 相似，不同的是，前者要在资源中提供多个 CA。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <domain-config> 
    <domain includeSubdomains="true">secure.example.comdomain>  
    <domain includeSubdomains="true">cdn.example.comdomain>  
    <trust-anchors> 
      <certificates src="@raw/trusted_roots"/> 
    trust-anchors> 
  domain-config>
network-security-config>
```

以 PEM 或 DER 格式将可信 CA 添加到 res/raw/trusted_roots。请注意，如果使用 PEM 格式，文件必须仅包含 PEM 数据，且没有额外的文本。您还可以提供多个 ``，而不是只提供一个

#### 4.16.1.2 信任附加CA

应用可能需要信任系统不信任的其他 CA，出现此情况的原因可能是系统还未包含此 CA，或 CA 不符合添加到 Android 系统中的要求。应用可以通过为一个配置指定多个证书源来实现此目的。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <base-config> 
    <trust-anchors> 
      <certificates src="@raw/extracas"/>  
      <certificates src="system"/> 
    trust-anchors> 
  base-config>
network-security-config>
```

### 4.16.2 配置用于调试的 CA

调试通过 HTTPS 连接的应用时，您可能需要连接到没有为生产服务器提供 SSL 证书的本地开发服务器。为了支持此操作，而又不对应用的代码进行任何修改，您可以通过使用 debug-overrides 指定仅在 android:debuggable 为 true 时才可信的仅调试 CA。通常，IDE 和构建工具会自动为非发布 build 设置此标记。

这比一般的条件代码更安全，因为出于安全考虑，应用商店不接受被标记为可调试的应用。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <debug-overrides> 
    <trust-anchors> 
      <certificates src="@raw/debug_cas"/> 
    trust-anchors> 
  debug-overrides>
network-security-config>
```

### 4.16.3 选择退出明文通信

仅适用于面向 Android 8.1（API 级别 27）或更低级别的应用。从 Android 9（API 级别 28）开始，系统默认情况下已停用明文支持

打算连接到仅使用安全连接的目标的应用可以选择不对这些目标提供明文（使用未加密 HTTP 协议而非 HTTPS）支持。此选项有助于防止应用因外部源（如后端服务器）提供的网址发生变化而意外回归。如需了解详情，请参阅 NetworkSecurityPolicy.isCleartextTrafficPermitted()。

例如，应用可能需要确保所有与 secure.example.com 的连接始终通过 HTTPS 完成，以防止来自恶意网络的敏感流量。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <domain-config cleartextTrafficPermitted="false"> 
    <domain includeSubdomains="true">secure.example.comdomain> 
  domain-config>
network-security-config>
```

### 4.16.4 固定证书

一般情况下，应用信任所有预装 CA。如果有预装 CA 颁发了欺诈性证书，则应用将面临被中间人攻击的风险。有些应用选择通过限制信任的 CA 集或通过固定证书来限制其接受的证书集。

如需固定证书，您可以通过按公钥的哈希值（X.509 证书的 SubjectPublicKeyInfo）提供证书集。然后，只有至少包含一个已固定公钥的证书链才有效。

请注意，固定证书时，您应始终包含一个备用密钥，这样，当您被强制切换到新密钥或更改 CA 时（固定到某个 CA 证书或该 CA 的中间证书时），应用的连接性不会受到影响。否则，您必须推送应用更新以恢复连接性。

此外，可以设置证书固定的到期时间，在该时间之后不再固定证书。这有助于防止尚未更新的应用出现连接性问题。不过，设置证书固定的到期时间可能会绕过证书固定。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <domain-config> 
    <domain includeSubdomains="true">example.comdomain>  
    <pin-set expiration="2018-01-01"> 
      <pin digest="SHA-256">7HIpactkIAq2Y49orFOOQKurWxmmSFZhBCoQYcRhJ3Y=pin>  
        
      <pin digest="SHA-256">fwza0LRMXouZHRC8Ei+4PyuldPDcf3UKgO/04cDM1oE=pin> 
    pin-set> 
  domain-config>
network-security-config>
```

### 4.16.5 配置继承行为

未在特定配置中设置的值将被继承。此行为允许进行更复杂的配置，同时又能保证配置文件易读。

如果未在特定条目中设置值，将使用来自更通用条目中的值。例如，未在 domain-config 中设置的值将从父级 domain-config（如果已嵌套）或者 base-config（如果未嵌套）中获取。未在 base-config 中设置的值将使用平台默认值。

例如，所有与 example.com 的子网域的连接必须使用自定义 CA 集。此外，允许流向这些网域的明文流量，但连接到 secure.example.com 时除外。通过在 example.com 的配置中嵌套 secure.example.com 的配置，不需要重复 trust-anchors。

res/xml/network_security_config.xml：

```
<network-security-config> 
  <domain-config> 
    <domain includeSubdomains="true">example.comdomain>  
    <trust-anchors> 
      <certificates src="@raw/my_ca"/> 
    trust-anchors>  
    <domain-config cleartextTrafficPermitted="false"> 
      <domain includeSubdomains="true">secure.example.comdomain> 
    domain-config> 
  domain-config>
network-security-config>
```

### 4.16.6 配置文件格式

网络安全配置功能使用 XML 文件格式。文件的整体结构如以下代码示例所示：

```
    <network-security-config>
        <base-config>
            <trust-anchors>
                <certificates src="..."/>
                ...
            trust-anchors>
        base-config>

        <domain-config>
            <domain>android.comdomain>
            ...
            <trust-anchors>
                <certificates src="..."/>
                ...
            trust-anchors>
            <pin-set>
                <pin digest="...">...pin>
                ...
            pin-set>
        domain-config>
        ...
        <debug-overrides>
            <trust-anchors>
                <certificates src="..."/>
                ...
            trust-anchors>
        debug-overrides>
    network-security-config>
```

以下部分将介绍语法与文件格式的其他详细信息

### 4.16.7 配置文件格式语法与文件格式

#### 4.16.7.1 ``

可包含：

```
0 或 1 个 
任意数量的 
0 或 1 个 
```

#### 4.16.7.2 ``

语法：

```
<base-config cleartextTrafficPermitted=["true" | "false"]>
        ...
    base-config>
```

可包含：

```

```

说明：

```
目标不在 domain-config 涵盖范围内的所有连接所使用的默认配置
未设置的任何值均使用平台默认值
```

以 Android 9（API 级别 28）及更高版本为目标平台的应用的默认配置如下所示：

```
<base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        trust-anchors>
    base-config>
```

- 以 Android 7.0（API 级别 24）到 Android 8.1（API 级别 27）为目标平台的应用的默认配置如下所示：

```
<base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        trust-anchors>
    base-config>
```

- 以 Android 6.0（API 级别 23）及更低版本为目标平台的应用的默认配置如下所示：

```
<base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        trust-anchors>
    base-config>
```

#### 4.16.7.3 ``

语法：

```
<domain-config cleartextTrafficPermitted=["true" | "false"]>
        ...
    domain-config>
```

可包含：

```
1 个或更多 
0 或 1 个 
0 或 1 个 
任意数量的嵌套 
```

说明：

```
用于按照 domain 元素的定义连接到特定目标的配置。
请注意，如果有多个 domain-config 元素涵盖某个目标，将使用匹配网域规则最具体（最长）的配置。
```

#### 4.16.7.4 ``

语法：

```
<domain includeSubdomains=["true" | "false"]>example.comdomain>
```

属性：includeSubdomains

```
如果为 "true"，此网域规则将与相应网域及所有子网域（包括子网域的子网域）匹配。否则，该规则仅适用于精确匹配项。
```

#### 4.16.7.5 ``

语法：

```
<debug-overrides>
        ...
    debug-overrides>
```

可包含：

```
0 或 1 个 
```

说明：

```
在 android:debuggable 为 "true" 时将应用的替换，IDE 和构建工具生成的非发布 build 通常属于此情况。在 debug-overrides 中指定的信任锚会添加到所有其他配置，并且当服务器的证书链使用其中一个仅调试信任锚时不固定证书。如果 android:debuggable 为 "false"，则完全忽略此部分
```

#### 4.16.7.6 ``

语法：

```
<trust-anchors>
    ...
    trust-anchors>
```

可包含：

```
任意数量的 
```

说明：用于安全连接的信任锚集

#### 4.16.7.7 ``

语法：

```
<certificates src=["system" | "user" | "raw resource"]
                  overridePins=["true" | "false"] />
```

说明：

```
用于 trust-anchors 元素的 X.509 证书集
```

属性：

- src：CA 证书的来源。每个证书可以是以下项之一：

```
1）指向包含 X.509 证书的文件的原始资源 ID。证书必须以 DER 或 PEM 格式编码。如果为 PEM 证书，则文件不得包含额外的非 PEM 数据，例如注释。
2）"system"，表示预装系统 CA 证书
3）"user"，表示用户添加的 CA 证书
```

- overridePins

指定此来源的 CA 是否绕过证书固定。如果为 "true"，则不针对由此来源的某个 CA 签名的证书链固定证书。这对于调试 CA 或测试针对应用安全流量的中间人攻击非常有用。

默认值为 "false"，除非在 debug-overrides 元素中另外指定（在这种情况下，默认值为 "true"）

#### 4.16.7.8 ``

语法：

```
<pin-set expiration="date">
    ...
    pin-set>
```

可包含：

```
任意数量的 
```

说明：一组公钥固定。若要信任某个安全连接，信任链中必须有一个公钥位于固定集内。如需了解固定的格式，请参阅 ``

属性：

- expiration

- - 采用 yyyy-MM-dd 格式的日期，证书固定会在该日期过期，因而将停止固定证书。如果未设置该属性，则证书固定不会过期
  - 设置到期时间有助于防止未获得其固定集更新（例如，在用户停用应用更新时）的应用出现连接问题

#### 4.16.7.9 ``

语法：

```
<pin digest=["SHA-256"]>base64 encoded digest of X.509
        SubjectPublicKeyInfo (SPKI)pin>
```

属性：

- digest

- - 用于生成证书固定的摘要算法。目前仅支持 "SHA-256"

## 4.17 AndServer中转

AndServe原理就是把一个安卓机在本地作为一台服务器，然后找到数据接口，更多的适用于获取app的sign/token时获取接口

下载地址：https://github.com/yanzhenjie/AndServer

## 4.18 绕过证书锁定

安卓设备带有一组可信的CA，而且安卓设备会检查目标服务器的证书是否是由这些可信的CA颁发的。虽然这提高了数据传输的安全性，能够防止中间人攻击，但是很容易受到欺骗，攻击者很容易“欺骗”设备的受信任证书存储区，安装一个伪造的证书，使设备信任这些服务器，而这些服务器的证书不是由可信的CA颁发的。证书锁定技术可以阻止向设备的受信任证书存储区添加证书，并且影响SSL连接

有了证书锁定技术，可假设应用知道它在跟哪个服务器通信，然后能够获得服务器的SSL证书，把它添加到应用中。这样，应用就不需要依赖设备的受信任证书存储区，它会自行检查并验证所连接的服务器的证书是否已经添加到应用中。这就是证书锁定技术的工作方式

Twitter是最早采用SSL证书锁定技术的流行应用之一。有很多种方法可以绕过安卓应用的证书锁定，其中一种最简单的方法就是反编译应用的二进制文件，并打上SSL验证补丁

## 4.19 AndroidSSLTrustKiller绕过证书锁定

使用AndroidSSLTrustKiller绕过Twitter安卓应用（5.42.0版本）的SSL证书锁定。可以从下面下载AndroidSSLTrust Killer：

下载地址：https://github.com/iSECPartners/Android-SSLTrustKiller/releases

当安卓应用启用了证书锁定，Burp Suite不能拦截应用的任何流量。因为应用中锁定的证书与Burp代理的证书不匹配。在安卓设备上安装Cydia Substrate和AndroidSSLTrustKiller扩展工具。安装完成后，需要重启设备才能使更改生效。重启设备后，重新检测Twitter应用的流量，我们可以看到如下图所示的界面。

## 4.20 自己修改app去增加配置，允许https抓包

通过修改app的配置，使得允许https抓包，而修改app的配置，又分两种：

- 已获得app源码

- - 可以通过修改源码的方式去添加允许https抓包的配置

- 无获得app源码，只有APK

- - 借助第三方工具修改apk，增加配置，允许https抓包（有些APK加了壳，需要先进行脱壳处理，再通过apktool等工具进行反编译）

通过修改app源码去增加配置允许htts抓包，具体操作过程如下：

- 修改AndroidManifest.xml，在application标签中增加`android:debuggable="true" android:networkSecurityConfig="@xml/network_security_config"`，如下：

```
  <manifest ... >
    <application android:networkSecurityConfig="@xml/network_security_config"
                  ... >
    ...
    application>
  manifest>
```

在res目录下新建一个xml文件夹，再新建文件：

```
res/xml/network_security_config.xml
```

network_security_config.xml内容分为：

- 手机中已正确安装抓包工具的证书
- 手机中没安装抓包工具证书，但是已有抓包工具证书文件

手机中已正确安装抓包工具的证书

```
  <network-security-config>
    <domain-config>
      <domain includeSubdomains="true">你要抓取的域名domain>
      <trust-anchors>
          
          <certificates src="system" />
          
          <certificates src="user" />
      trust-anchors>
  domain-config>
network-security-config>
```

手机中没安装抓包工具证书，但是已有抓包工具证书文件：

- 要去res目录下新建一个raw文件夹，将手机上安装的证书文件放入res/raw/目录下

- - 支持的证书格式：pem，ca

```
    <network-security-config>
        <domain-config>
        <domain includeSubdomains="true">你要抓取的域名domain>
        <trust-anchors>
        <certificates src="@raw/证书文件名"/>
        trust-anchors>
    domain-config>
network-security-config>
```

## 4.21 用工具修改apk增加配置允许https抓包

比如借助第三方工具AddSecurityExceptionAndroid，即可给apk增加允许https抓包的配置了，然后就可以继续用抓包工具抓包https

https://github.com/levyitay/AddSecurityExceptionAndroid

```
./addSecurityExceptions.sh xxx.apk
```

## 4.22 用其他工具绕开https校验实现https抓包

用其他工具绕开ssl的验证，抓包到https被解密变成明文的数据

- 

- - Android：已root，安装Xposed等工具
  - iOS：已越狱，安装Cydia等工具

1. 手机已root或越狱



- 基于Cydia的SSL Kill Switch 2
- 旧版本：基于Cydia的iOS SSL Kill Switch
- 基于Xposed的JustTrustMe，JustTrustMe的限制：只能支持Android 7.0之前的安卓（超过Android 7.0就没用了）
- 基于Cydia的Android-SSL-TrustKiller
- Android：
- iOS：

1. 利用绕开/禁止SSL pinning的插件

## 4.23 强制信任证书

前提是手机必须要 ROOT，而且需要计算证书 Hash Code 并对证书进行重命名

Android7系统只信任系统区的证书，只要把抓包工具的证书放到系统区，即可以抓取https包

- 系统信任的地方

- - 对应安卓的设置中的：受信任的凭据 -> 系统
  - 对应安卓系统目录：/system/etc/security/cacerts/
  - 对应的系统证书的名字有特定规则
  - 需要找到工具根据规则计算出名字后
  - 才能再去把证书放到系统区中

- 详细步骤如下（手机已root）：

- - adb命令把证书推到手机上：`adb push 9999.0 /sdcard`
  - 复制到系统目录并修改权限：
  - `mount -o rw,remount /system`【不修改没法写入】
  - `mount -o rw,remount /`
  - 移动文件到系统：`mv /sdcard/9999.0 /etc/security/cacerts/`
  - 修改用户组：`chown root:root /etc/security/cacerts/9999.0`
  - 修改权限 ：`chmod 644 /system/etc/security/cacerts/9999.0`
  - `openssl x509 -inform DER -in cert-der.crt -out PortSwiggerCA.pem`
  - `openssl x509 -inform PEM -subject_hash_old -in PortSwiggerCA.pem|head -1`
  - 计算证书名
  - 算出数值，比如3a1074b3
  - 证书文件改名
  - 然后把原抓包工具证书PortSwiggerCA.pem改名为 9999.0`mv PortSwiggerCA.pem 9999.0`
  - 放到系统分区
  - 放到/system/etc/security/cacerts/

安卓10版本有更高的保护机制，即使root了也没法把证书导入到系统证书目录里

## 4.24 使用iOS端手机抓包

因为，苹果端的appstore管理得很严，不能加些自己独特的东西，但是加ssl是可以的，但是很多app并没有加我就不知道了，这个情况就很简单，需要一台iphone，其他都是正常抓包操作，然后安装证书，把证书信任下





**参考链接**：

- https://blog.csdn.net/re_psyche/article/details/104878458
- https://blog.csdn.net/w1590191166/article/details/106308028
- https://www.cnblogs.com/Eeyhan/p/12916162.html
- https://github.com/levyitay/AddSecurityExceptionAndroid
- https://developer.android.com/training/articles/security-config?hl=zh-cn
- http://binmake.com/post/manual-sslp/
- https://curz0n.github.io/2020/08/15/android-ssl-and-intercept/
- https://mp.weixin.qq.com/s/EB0MAJQs1CIEUHezmTFxtg
- https://crifan.github.io/app_capture_package_tool_charles/website/how_capture_app/complex_https/https_ssl_pinning/
- https://mp.weixin.qq.com/s/A-bPf6uNGiEQVu-dFvHnVw
- https://www.ol4three.com/2021/12/06/Android/APP测试常见问题总结/

也许每个人出生的时候都以为这世界都是为他一个人而存在的，当他发现自己错的时候，他便开始长大
少走了弯路，也就错过了风景，无论如何，感谢经历