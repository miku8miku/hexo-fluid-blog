---
title: JS逆向教程一：基础入门与实战技巧
date: 2025-11-03 16:00:00
index_img: https://pic1.imgdb.cn/item/68f658973203f7be00835cbe.png
categories: 技术教程
tags:
  - JS逆向
  - 爬虫
  - 开发工具
---

> 本文详细介绍了JS逆向的基础知识、浏览器开发者工具的使用要点、hook代码实现快速定位以及扣JS代码的实战技巧，帮助读者掌握前端逆向分析的核心技能。

<!-- more -->

# JS基础

## 1. 前置要求
- Python 基本语法  
- JS 基本语法（本篇重点）  
- Node.js 环境已安装并能正常运行  

---

## 2. 教程大纲速览
| 阶段 | 内容 |
|------|------|
| 基础 | JS 语法、浏览器调试、扣代码、对称/非对称加密特征 |
| 进阶 | Webpack、OB 混淆、Cookie 反爬、滑块/验证码实战 |

---

## 3. 变量声明与作用域
| 关键字 | 作用域 | 可否重复赋值 | 备注 |
|--------|--------|--------------|------|
| `var` | 函数级或全局 | ✅ | 存在提升，易污染全局 |
| `let` | 块级 | ✅ | 推荐；无提升 |
| `const` | 块级 | ❌ | 声明常量，引用不可重新赋值 |

> 函数内部用 `let/const` 声明的变量，函数执行完即销毁，外部访问会 `ReferenceError: xxx is not defined`。

---

## 4. 函数三种常见写法
1. **普通命名函数**  
   ```js
   function demo1() {
       console.log('hello world');
   }
   demo1();          // 调用
   ```

2. **匿名函数表达式**  
   ```js
   const func = function (x, y) {
       return x + y;
   };
   console.log(func(1, 2)); // 3
   ```

3. **自执行函数（IIFE）**  
   ```js
   !function () {
       console.log(123);
   }();              // 立即打印 123
   ```

---

## 5. 全局导出技巧
在自执行或庞大混淆代码中，把关键函数挂到全局，方便后续 Python 调用：
```js
const test = (function () {
    function test1() {
        console.log('TST');
    }
    return test1;   // 暴露内部函数
})();
// 外部直接 test() 即可
```

---

## 6. 对象（≈ Python dict）
```js
const obj = { a: 1, b: 2, c: 3 };

// 取值
console.log(obj.a);      // 1
console.log(obj['b']);   // 2

// 对象里可放函数
obj.add = function () {
    return this.a + this.b + this.c;
};
const res = obj.add();   // 6
```

---

## 7. JSON ↔ 字符串互转
| 方向 | API | 示例 |
|------|-----|------|
| 对象 → 字符串 | `JSON.stringify(obj)` | 方便传输/存储 |
| 字符串 → 对象 | `JSON.parse(str)` | 拿到数据后还原成对象 |

---

## 8. 浏览器调试口诀
- F12 → Sources → 断点 / Step over（F10） / Step into（F11）  
- Console 直接试调用、打印变量  
- Network 抓包看请求头、参数、Cookie；对照调用栈"扣代码"

---

## 9. 下一步预告
- 对称加密（AES/DES）特征与定位  
- 非对称加密（RSA）公钥私钥识别  
- Webpack 整体打包结构 & 导出口寻找  
- OB 混淆还原技巧  
- Cookie 反爬与滑块验证码实战

# 开发者工具使用要点

## 1. 浏览器开发者工具面板的使用

### 1.1 打开开发者工具

打开方式：F12键、ctrl+shift+I组合键、点击浏览器右上角的三个点->更多工具->开发者工具。介绍这么多种，是有因为有些网址直接按F12无法打开开发者工具，这时可以采用其他方法。

打开开发者工具后，有一些面板需要重点认识一下（下图框选部分）：

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511031610087.png)

**Elements面板**: 展示html标签的面板，可以用来查看html页面中感兴趣的**文本或者图片**。

**Console面板**: 可以执行一些js代码，可以**查看加密函数的运行结果、注入hook代码**等。

**Source面板**：这是js调试主要在这个面板进行，重点关注一下调试区。**Breakpoints**可以查看我们下的断点，XHR/fetch Breakpoints可以**下xhr断点**，Event Listener Breakpoints可以下**事件监听断点**，如js加载的断点，到时**调试瑞数**会用到。这个面板相对而言比较复杂，但是用多了就会认识全了。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511031609489.png)

**Network面板**：这里记录了操作浏览器时发送的一些数据包。点击**放大镜图标**可以搜索我们**感兴趣的文字**，点击Fetch/XHR可以看到发送的xhr请求，**动态数据**就在这里查看。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511031609598.png)

**Application面板**：查看cookies，遇到cookie反爬则用得较多。

## 2. 定位数据包

前面简单认识了开发者工具，下一步就是要在Network面板中找到感兴趣的数据包，以方便开发爬虫程序。

- 最简单的是在Network面板中直接搜索文本内容，如果可以搜到就直接可以定位数据包了。这里搜索"为人父母"，则可以搜到相应的数据包，在左侧面板中点击即可快速定位到目标数据包。

  ![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511031610998.png)

- 可以通过数据包的大小来定位，点一下size列，可以按数据包大小进行排列，有时也能快速定位。

- xhr数据，一般涉及逆向的数据包很大概率是xhr接口，因此可以直接在xhr数据包中快速定位。

![image-20251103161542953](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511031615222.png)
![image-20251103161713818](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511031617084.png)

curl请求转换工具网站：
- [https://curlconverter.com/](https://curlconverter.com/)
- [https://spidertools.cn](https://spidertools.cn)

# Hook代码实现快速定位

前面了解了浏览器开发者工具并能快速定位数据包接口，后面就是要分析该接口是不是存在加密点，也就是找到需要逆向的位置。

通常需要**逆向的位置**一般在**Request headers、Payload、Response和Cookie**中。下图中数据包的url的查询关键字中有一个analysis的是无法看懂的，这个就是**密文，需要着重分析。**

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041453903.png)

## Hook方法

hook技术可以改变js函数的执行行为，**针对一些加密函数可以去快速定位**。Javascript中的JSON.stringnify和JSON.parse两个方法是处理JSON数据常用的方法，某些站点传输响应数据时会用到这两个方法。

```javascript
(function() {
    var _parse = JSON.parse;
    JSON.parse = function(ps) {
        console.log("Hook JSON.parse ——> ", ps);
        debugger;
        return _parse(ps);  // 不改变原有的执行逻辑 
    }
})();
```

将上述代码放入Console控制台运行即可。这里将JSON.parse赋值给_parse变量，当调用了JSON.parse方法时则输出相应的JSON字符串并执行debugger语句，会立即断下 ，且**不改变原来函数的执行逻辑**。其他方法的hook代码可以以此为模板进行编写。

## Hook XHR请求

在Javascript中，可以利用`XMLHttpRequest.open方法发送xhr请求，因此可以对其进行hook。`

```
经过脱敏的练习网址：aHR0cHM6Ly93d3cucWltYWkuY24v
在payload中存在analysis，是一个密文，则需要对其进行逆向分析。可以看到该数据包是一个xhr请求，可以尝试去hook XMLHttpRequest.open方法。
```

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041450264.png)

```javascript
(function () {
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        if (url.indexOf("analysis") != -1) {
            debugger;
        }
        return open.apply(this, arguments);
    };
})();
```

url.indexOf("analysis") != -1这行代码表示在url中存在analysis，此时会执行debugger语句，立即断住。此时**向上跟栈，可以定位加密位置**。通过该方法可以很快地定位加密点。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041450258.png)

关于xhr请求，`XMLHttpRequest.send, XMLHttpRequest.setRequestHeader和XMLHttpRequest.`onreadystatechange这几个方法很重要，需要重点关注。

同时我们也要注意**发包的流程**，首先**初始化javascript>>执行加密逻辑>>发包>>返回相应>>解密响应体**。执行加密逻辑可能会在请求**Interceptors** （拦截器）中进行。

## Hook Cookie

对于一些cookie反爬，则可以hook相应的cookie来进行**定位。****hook cookie的代码是固定的，可以直接拿来使用。**

练习网址：aHR0cHM6Ly93d3cuMTBqcWthLmNvbS5jbi8=

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041453623.png)

cookie是以键值对的形式存储的，其中键名为v的值是需要逆向分析的。可以使用以下代码进行hook。

```javascript
(function () {
  var cookieTemp = '';
  Object.defineProperty(document, 'cookie', {
    set: function (val) {
      if (val.indexOf('v') != -1) {
        debugger;
      }
      console.log('Hook捕获到cookie设置->', val);
      cookieTemp = val;
      return val;
    },
    get: function () {
      return cookieTemp;
    },
  });
})();
```

当document.cookie中含有键名为v时，则会执行debugger语句。此时可以快速定位加密位置。

# 扣JS代码

## 1. 分析目标
- **场景**：网页翻译接口返回「密文」，前端展示「明文」→ 需本地还原「加密/解密」逻辑。  
- **突破口**：  
  1. 表单参数 `sn`（加密）  
  2. 响应体密文 → 前端明文（解密）

---

## 2. 定位加密/解密函数通用套路
| 步骤 | 操作 | 工具/技巧 |
|---|---|---|
| ① 抓包 | 确认「密文字段」与「时间戳」等关联字段 | Network 面板 |
| ② 搜关键字 | 字段名 + 冒号（英文） `sn:` → 缩小到 44 个 → 再叠加其他表单字段 → 个位数 | Sources - Search |
| ③ 下断点 | 所有疑似赋值处全部打断点 | Ctrl+F 局部搜索 |
| ④ 触发请求 | 重新输入、点击发送 | 让代码跑进断点 |
| ⑤ 单步跟栈 | 观察局部变量、参数来源 | Call Stack / Scope |

---

## 3. 加密案例复盘（sn 生成）
- **函数链**：  
  `固定值 e` + `时间戳 a` → 经 `s()` → 内部调用 `_.md5(e.toString())`  
- **扣代码原则**：  
  缺什么补什么，按依赖链从底向上复制；遇到大型对象 `I` 先打印，对比官方库特征 → 直接用 `require('crypto')` 或 `crypto-js` 替换，省去逆向整套库。

---

## 4. 解密案例复盘（密文 → 明文）
- **Hook 点选择**：  
  前端必调 `JSON.parse(解密后字符串)` → 在控制台注入 `JSON.parse = function(x){ debugger; return orig(x); }`  
- **两次断点**：  
  第一次断到「密文」，第二次断到「明文」→ 两次调用栈之间即为 **解密函数**。  
- **算法识别**：  
  参数出现 `key`, `iv`, `decodeData` → 典型 **AES** 特征，直接抠 `decode()` 函数即可。

---

## 5. 扣代码实操口诀
1. **复制顺序**：从最里层被调用函数→向外层展开，保证依赖已定义。  
2. **全局冲突**：把大对象改名再 `require`，如 `const crypto = require('crypto-js');`  
3. **常量写死**：固定密钥/盐值直接硬编码，方便后续 Python 直调。  
4. **验证一致**：浏览器 Network 里拿到的 `sn` 值 vs 本地运行结果必须 **完全一致**（包括大小写、长度）。  

---

## 6. 常用 Hook 模板（收藏）
```js
// 1. JSON.parse 断明文
(function(){
    const orig = JSON.parse;
    JSON.parse = function(){
        debugger;
        return orig.apply(this, arguments);
    };
})();

// 2. JSON.stringify 断加密
(function(){
    const orig = JSON.stringify;
    JSON.stringify = function(){
        debugger;
        return orig.apply(this, arguments);
    };
})();

// 3. 通用 XHR 断点
(function(){
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        if (arguments[1].includes('webtranslate')) debugger; // URL 关键词
        return open.apply(this, arguments);
    };
})();
```

---

## 7. 工具链速查
| 任务 | 推荐 |
|---|---|
| 静态搜索 | Sources - Search（正则/冒号过滤） |
| 动态调试 | Chrome DevTools、Fiddler/Charles |
| 本地运行 | Node.js + crypto-js / axios |
| 代码美化 | Prettier、js-beautify |
| 混淆对抗 | AST 解混淆（babel-parser）、动态执行 |

在定位好要逆向的接口后，快速浏览[请求头](https://so.csdn.net/so/search?q=请求头&spm=1001.2101.3001.7020)、请求载荷、响应和cookie等位置，看到类似密文的字段需要特别注意，当然像uuid和csrf-token这类密文是不需要逆向的。

### 1. JS定位的几种方式

案例网址：aHR0cHM6Ly9mYW55aS55b3VkYW8uY29tL2luZGV4Lmh0bWwjLw==

查找逆向参数：payload中有sign签名加密

![img](https://i-blog.csdnimg.cn/direct/0bcea100d33246b9809d04d7b3ec55bd.png)

再看响应，是密文，需要解密处理，因此需要解决sign和解密[响应体](https://so.csdn.net/so/search?q=响应体&spm=1001.2101.3001.7020)两个问题。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523692.png)

#### 1.1 直接搜索

关于签名加密sign，可以直接搜索sign，按ctrl+shift+F全局搜索，可以在所有js文件中搜索相应的内容。如下图，搜到了376个，这样搜的话，太多了，很难定位。直接搜其实也是有技巧的。

![img](https://i-blog.csdnimg.cn/direct/e1f1b7cc1a1f4f3f8caa84bce01baf58.png)

可以尝试搜sign:，搜索的结果是29个，冒号是要英文的。如下图，结果大大减少。这是在可疑的地方可以下断点，方便调试。

![img](https://i-blog.csdnimg.cn/direct/322acd448f924435bc23f82528cccc84.png)

下了断点后，重新触发该接口，可以断住。sign的值是由S函数加密生成的，传入了两个参数，o和e。后续需要对S函数进行分析。

![img](https://i-blog.csdnimg.cn/direct/84a98e14e1ed451f930062a1a9a235ed.png)

#### 1.2 XHR断点

如果搜索不到，则可以通过xhr断点来定位。同样是该接口，复制路径/webtranslate，到source面板xhr断点处设置断点。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523623.png)

再次触发该接口（随便输入文字即可），会断住,如下图。

![img](https://i-blog.csdnimg.cn/direct/7e748b2825b848c696a1fce2f991726b.png)

此时向上跟栈，定位到加密函数的位置。向上跟到I栈时，发现k(t)的执行结果中生成了sign的值，可以初步判定加密参数是在这里生成的。这样就成功定位了加密参数，逆向已经完成了50%。

![img](https://i-blog.csdnimg.cn/direct/9e17478f88c74397a8819da42bd9e5dd.png)

#### 1.3 堆栈

这和xhr有点类似，也要向上跟栈，但入口会有不同。最后也是在I栈成功定位。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523384.png)

### 2. JS代码本地运行

我们通过分析发现，在webtranslate接口中含有sign加密参数，如果用python代码来请求该接口，必须要解决sign的生成算法。通过前面的分析，sign的加密位置已经生成，这个时候就是进一步分析js代码了，逆向还原sign的生成算法。

找到加密函数后，鼠标移到k函数的上方，如下图所示。

![img](https://i-blog.csdnimg.cn/direct/3da0b989f2ed4028bc23b4577bfe0339.png)

点击一下箭头指向的链接，即可跳转到k的函数内部。进去可以看到，sign又是有S函数生成的，传入了o和e两个值生成的，此时需要再去跟一下S函数。相同的方法，鼠标悬停在S函数的上方，点击进入S函数内部。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523438.png)

在S函数中，又嵌套了一个_函数，位置如下。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523854.png)

现在对逆向是不是有了更清晰的认识，说白了，就是一直往上跟js的执行逻辑。现在把这些代码都复制下来，保存成本地js文件，用nodeJs执行。如果成功，则逆向成功。

### 3. 实战

将上述代码复制到本地，如下图，执行k函数。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523664.png)

结果报错了。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523628.png)

这里提示i没有定义。这里i是啥呢？需要根据网站的js进行分析，像是一个标准库。

![img](https://i-blog.csdnimg.cn/direct/cce49ade7e7f4338815601b51368fcdc.png)

如果你比较熟悉nodejs的话，其实很快就知道，i其实是nodejs自带的一个模块crypto。于是可以直接把i替换成crypto，最后执行成功。

![img](https://fastly.jsdelivr.net/gh/miku8miku/images@main//202511041523743.png)

到此，sign的逆向过程就全部结束了，是不是很简单呢。

# 参考资料
- [Bilibili视频教程](https://space.bilibili.com/675692607/upload/video)
- [CSDN博客](https://blog.csdn.net/chem_d?type=blog)