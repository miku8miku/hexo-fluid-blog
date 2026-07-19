---
title: AI自动化脚本抓包分析 - 基于 Har
date: 2026-7-16 15:00:00
tags:
  - AI
  - 爬虫
  - 自动化脚本
  - HAR
  - 抓包分析
  - MCP
categories:
  - AI开发
  - 爬虫技术
index_img: https://pic1.imgdb.cn/i/1zU8O6jdA8l79wLLQfFMgq.png
description: 在 AI Agent 时代，如何高效地进行抓包分析？本文介绍基于 HAR 文件的工作流，将网站探索交给人工、请求分析交给 AI，实现更省 Token、更高效的爬虫与自动化脚本开发。
copyright: true
---



## 前言

进入2026下半年，进行爬虫或自动化脚本开发时，Reqable、Fiddler 或浏览器 Dev Tools 依然是我们的标准配置。这些工具能帮人类可视化地分析HTTP请求，但在AI Agent时代，**AI并不需要可视化，它需要的是高密度的结构化上下文**。”

这些工具确实可以帮助我们可视化地对HTTP请求进行分析，但在AI Agent时代，AI并不需要可视化。你会用什么工具去抓包分析呢？

可能你会想到用一些MCP/Skills去帮助你，比如用于控制浏览器的Web Access/Browser Use或者是Firecrawl/Crawl4AI这种转结构化数据的工具。

我觉得这些都不能很好的满足我的需求，前者这种让AI自己去控制我们的浏览器，每做一步AI都要去思考一下，然后再进行下一步操作浏览器，很费时，Token耗费也巨大；后者这种工具虽然可以帮我们把网页内容转成结构化数据，但是在自动化脚本中，我们需要的不仅仅是结构化数据，还需要对HTTP请求的细节、时序等等进行分析。

也许，我们需要换一种思路去使用AI：

**把AI自己去探索被爬网站，转换为人工探索被爬网站，然后把我们探索到的HTTP请求记录下来，交给AI去分析这些请求的细节、时序等等。**

网站本身就是给人类设计的，人类可以轻松地快速地去探索网站，你只需要先把缓存清空，从头用浏览器探索你要进行爬虫/自动化脚本的完整流程，然后把你探索到的HTTP请求记录下来，交给AI去分析这些请求的细节、时序等等，这样岂不是更好？

作为脚本小子，最近我就在做爬虫/自动化脚本的开发，当时reqable官方还没有发官方MCP, 我先是尝试了一个小众项目 [iambond50-svg/reqable-mcp](https://github.com/iambond50-svg/reqable-mcp)(现在可以用这个官方MCP[ https://reqable.com/zh-CN/docs/mcp/](https://reqable.com/zh-CN/docs/mcp/))，官方的这个MCP暴漏了很多操作Reqable的接口，对于抓包也许有些冗余，而且要打开reqable系统代理，可能会对猫猫系统代理产生影响，以及某些请求发送会有SSL问题，比如requests库直接发出的请求/pip下载包等。那么我们应该如何把HTTP请求抓包历史记录给AI呢？

## Har文件

Har是HTTP Archive的缩写，是一种记录浏览器与网站之间交互的HTTP请求和响应的文件格式。它通常以JSON格式存储，包含了请求的URL、方法、头信息、响应状态码、响应时间等详细信息。Har文件可以帮助开发者分析网页加载性能、调试网络请求以及进行爬虫开发。

哎？这个不正是我们要找的东西吗？而且浏览器可以直接地导出Har文件（[谷歌浏览器导出参考](https://docs.wpo365.com/article/225-create-a-har-file-with-sensitive-data)）。

Har结构参考：

```json
{

"log": {

"version": "1.2",

"creator": {

"name": "示例",

"version": "1.0"

},

"entries": [

{

"startedDateTime": "2026-07-16T23:00:00.000Z",

"time": 245,

"request": {

"method": "GET",

"url": "https://example.com/api/hello",

"httpVersion": "HTTP/1.1",

"headers": [

{ "name": "Host", "value": "example.com" },

{ "name": "User-Agent", "value": "Mozilla/5.0" }

],

"queryString": [],

"cookies": [],

"headersSize": 150,

"bodySize": 0

},

"response": {

"status": 200,

"statusText": "OK",

"httpVersion": "HTTP/1.1",

"headers": [

{ "name": "Content-Type", "value": "application/json" }

],

"cookies": [],

"content": {

"size": 23,

"mimeType": "application/json",

"text": "{\"message\":\"hello\"}"

},

"redirectURL": "",

"headersSize": 120,

"bodySize": 23

},

"timings": {

"send": 10,

"wait": 200,

"receive": 35

}

},

{

"//": "包含更多的请求和响应条目"

}

]

}

}
```

因为Har本质是JSON格式，LLM可以直接对其进行分析，如果该Har文件过大，Agent还可以使用python/node等cli直接用内联管道一行命令快速分析Har文件，提取出我们的爬虫/自动化脚本真正需要的信息。如果你觉得用python/node写代码分析还是消耗token，你还可以用这类（如[cyberspacesec/har-skills](https://github.com/cyberspacesec/har-skills)）skill+cli的方式让AI直接使用专用的cli操作，更省token，速度更快。

## 基于 Har 的工作流

那么基于Har的完整工作流是怎么样的呢？我总结了以下几个步骤：

1. **清空浏览器缓存**：为了确保抓取到的HTTP请求历史是完整的，建议在开始抓包前清空浏览器缓存。
2. **使用浏览器探索网站**：手动操作浏览器，按照你需要的爬虫/自动化脚本的流程，访问网站的各个页面，触发所有相关的HTTP请求。
3. **导出Har文件**：在浏览器的开发者工具中，导出Har文件保存到工作区hars文件夹中（如果被爬网站比较复杂，可以分多次导出，并语义化命名文件名）。
4. **分析清洗Har文件**：使用AI Agent对导出的hars文件进行分析，提取出我们需要的HTTP**请求格式**模板，以及请求的**时序**、**依赖关系**等信息（比如让AI找出 Authentication 机制，Token 怎么在时序中传递，后一个请求的参数怎么来自于前一个请求的Response），把一些不需要的请求记录（比如css/图片等）过滤出去，整理成schema.md。
5. **生成爬虫/自动化脚本**：根据上一步清洗后的schema.md，AI Agent将可以直接根据你的需要生成你需要的爬虫/自动化脚本。