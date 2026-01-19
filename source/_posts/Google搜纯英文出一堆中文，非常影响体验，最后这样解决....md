---
title: 解决Google搜索英文结果出现中文内容的问题
date: 2026-01-06 11:29:00
index_img: https://pic1.imgdb.cn/item/696509c751d5e4e5d572b38d.png
tags: [Google搜索, 搜索优化, 翻墙技巧]
---

# 解决Google搜索英文结果出现中文内容的问题

## 问题描述

最近在谷歌搜索的时候发现用纯英文搜出了一堆中文内容排名靠前，非常影响体验。

**可我故意用英文搜就是为了找英文的内容。**

![Google搜索结果中出现大量中文内容](https://cdn.bili33.top/gh/miku8miku/images@main/202601121129488.png)

## 问题原因

经过了搜索和研究，发现原来跟挂的节点有关影响到了地区设置，导致Google根据地理位置返回了更多中文内容。

![地区设置影响搜索结果](https://cdn.bili33.top/gh/miku8miku/images@main/202601121129470.png)

## 简单解决方案

### URL参数方法

最简单的解决方案是使用Google的地区参数：

```url
https://www.google.com/?gl=US
```

此方法的优点：

- 保留了简体中文界面
- 搜索词联想出中文
- 用英文搜出英文结果（当然如果不关**搜索个性化**有可能出中文结果靠前）
- 用中文搜出中文

### 其他地区参数

你也可以尝试以下URL参数来指定不同的地区：

```url
https://www.google.com/?gl=SG
https://www.google.com/?gl=HK
https://www.google.com/?hl=en&gl=US
https://www.google.com/?hl=en&gl=HK
https://www.google.com/?hl=en&gl=SG
https://www.google.com.sg/?hl=en&gl=US
https://www.google.com.sg/?hl=en&gl=HK
https://www.google.com.sg/?hl=en&gl=SG
```

> **提示：** `gl` 参数用于指定地区，`hl` 参数用于指定界面语言。

<details style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; box-sizing: border-box; border-width: 0px; border-style: solid; border-color: initial; max-width: 100%; color: rgb(51, 65, 85); font-family: ui-sans-serif, system-ui, sans-serif, &quot;apple color emoji&quot;, &quot;segoe ui emoji&quot;, &quot;segoe ui symbol&quot;, &quot;noto color emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; box-sizing: border-box; border-width: 0px; border-style: solid; border-color: initial; display: list-item;">总结</summary><img src="https://linux.do/uploads/default/original/4X/4/5/6/4563c3c849d17954e5e79a74239178d82b699faa.jpeg" width="50%" height="auto" style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; box-sizing: border-box; border-width: 0px; border-style: solid; border-color: initial; display: block; vertical-align: middle; max-width: 100%; height: auto; margin-top: 2em; margin-bottom: 2em;"><p style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; box-sizing: border-box; border-width: 0px; border-style: solid; border-color: initial; margin: 1.25em 0px;">其他的网址可以自行研究🧐一下</p><pre tabindex="0" style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; box-sizing: border-box; border-width: 0px; border-style: solid; border-color: initial; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, &quot;liberation mono&quot;, &quot;courier new&quot;, monospace; font-feature-settings: normal; font-variation-settings: normal; font-size: 0.875em; margin: 1.71429em 0px; color: rgb(51, 65, 85); background-color: rgb(248, 250, 252); overflow: auto; font-weight: 400; line-height: 1.71429; border-radius: 0.375rem; padding-top: 0.857143em; padding-inline: 1.14286em; padding-bottom: 0.857143em; max-width: 100%; max-height: 500px; scrollbar-width: thin; scrollbar-color: rgb(148, 163, 184) rgb(241, 245, 249);"><code style="--tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgb(59 130 246 / 0.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; box-sizing: border-box; border-width: 0px; border-style: solid; border-color: initial; font-family: inherit; font-feature-settings: normal; font-variation-settings: normal; font-size: inherit; overflow-wrap: break-word; color: inherit; font-weight: inherit; background-color: transparent; border-radius: 0px; padding: 0px; line-height: inherit;">https://www.google.com/?gl=SG
https://www.google.com/?gl=HK
https://www.google.com/?hl=en&amp;gl=US
https://www.google.com/?hl=en&amp;gl=HK
https://www.google.com/?hl=en&amp;gl=SG
https://www.google.com.sg/?hl=en&amp;gl=US
https://www.google.com.sg/?hl=en&amp;gl=HK
https://www.google.com.sg/?hl=en&amp;gl=SG
</code></pre></details>


## 完美解决方案（新增）

我用**claude3.7**稍微花了点时间改写了一个[油猴](https://www.tampermonkey.net/)脚本(最初起源放最下面了)，可以方便切换地区和语言，还比较美观SVG按钮。
复制以下的脚本导入到[油猴](https://www.tampermonkey.net/)

```
// ==UserScript==
// @name           GoogleSearch-Language_Region-Switching
// @name:zh-CN     Google搜索语言与地区切换
// @name:zh-TW     Google搜索語言與地區切換
// @name:ja        Google検索言語と地域切り替え
// @description:zh-CN     Google搜索结果语言和地区过滤
// @description:zh-TW     Google搜索結果語言和地區過濾
// @description:ja        Google検索結果の言語と地域フィルター
// @description    Google search result filter by language and region
// @namespace      GoogleSearch-Language_Region-Switching
// @supportURL     https://github.com/zhuzemin
// @include        https://www.google.*/*
// @author         zhuzemin,huanzhaojun(modified)
// @version        2.0
// @grant		   none
// ==/UserScript==

// 添加样式
const style = document.createElement("style");
style.textContent = `
  .lang-dropdown-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 8px;
    height: 44px; /* 确保与搜索框高度一致 */
    vertical-align: middle;
  }

  /* 首页按钮样式 - 调整垂直居中 */
  .lang-homepage-btn {
    height: 100%;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 首页按钮容器中的下拉容器调整 */
  .lang-homepage-btn .lang-dropdown-container {
    height: 24px;
    margin: 0;
  }

  .lang-selector-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 24px;
    height: 24px;
    outline: none;
    color: #5f6368;
    position: relative;
  }

  .lang-selector-btn:hover {
    color: #1a73e8;
  }

  .lang-selector-btn svg {
    width: 24px;
    height: 24px;
    display: block;
  }

  .main-dropdown,
  .lang-dropdown,
  .region-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    padding: 8px 0;
    min-width: 180px;
    margin-top: 6px;
    max-height: 400px;
    overflow-y: auto;
  }

  /* 主菜单三角形指示器 */
  .main-dropdown::before,
  .lang-dropdown::before,
  .region-dropdown::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid white;
  }

  .main-dropdown.show,
  .lang-dropdown.show,
  .region-dropdown.show {
    display: block;
  }

  .menu-option,
  .lang-option,
  .region-option {
    display: flex !important;
    align-items: center !important;
    padding: 10px 16px !important;
    text-decoration: none !important;
    color: #202124 !important;
    font-size: 14px !important;
    text-align: left !important;
    transition: background-color 0.2s !important;
    font-family: 'Google Sans', Arial, sans-serif !important;
    cursor: pointer !important;
  }

  .menu-option:hover,
  .lang-option:hover,
  .region-option:hover {
    background-color: #f1f3f4 !important;
    text-decoration: none !important;
  }

  .menu-option.active,
  .lang-option.active,
  .region-option.active {
    color: #1a73e8 !important;
    font-weight: 500 !important;
    background-color: #f1f8ff !important;
  }

  /* 返回按钮样式 */
  .back-option {
    display: flex !important;
    align-items: center !important;
    padding: 10px 16px !important;
    color: #5f6368 !important;
    font-size: 14px !important;
    border-bottom: 1px solid #e8eaed !important;
    margin-bottom: 6px !important;
    cursor: pointer !important;
  }

  .back-option:hover {
    background-color: #f1f3f4 !important;
  }

  .back-option .back-icon {
    margin-right: 8px !important;
  }

  /* 图标样式 */
  .menu-icon {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 20px !important;
    height: 20px !important;
    margin-right: 12px !important;
    color: #5f6368 !important;
  }

  .region-icon {
    display: inline-block !important;
    width: 20px !important;
    margin-right: 12px !important;
    text-align: center !important;
    font-family: 'Google Sans', 'Roboto', sans-serif !important;
  }

  /* Google风格工具提示 */
  .g-tooltip {
    position: absolute;
    background: #2d2d2d;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Google Sans', 'Roboto', 'Arial', sans-serif;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
    bottom: -38px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    letter-spacing: 0.25px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  .g-tooltip::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: #2d2d2d;
  }

  .lang-selector-btn:hover .g-tooltip {
    opacity: 1;
    visibility: visible;
  }
`;
document.head.appendChild(style);

// 创建按钮和下拉菜单元素
function createLanguageRegionSelectorElements(currentLang, currentRegion) {
	// 创建语言切换按钮容器
	const container = document.createElement("div");
	container.className = "lang-dropdown-container";

	// 创建按钮和SVG图标
	const button = document.createElement("button");
	button.className = "lang-selector-btn";
	button.innerHTML = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <style>
        .primary-blue { fill: #4285F4; }
        .secondary-blue { fill: #8AB4F8; }
        .accent-red { fill: #EA4335; }
        .light-blue { fill: #BBDEFB; }
      </style>
      <!-- Globe Base -->
      <path class="primary-blue" d="M454.111,193.473c-3.617,3.21-7.4,6.252-11.391,9.095c-9.236,6.546-14.26,10.143-17.404,12.866
        c9.216,20.58,14.875,43.094,15.996,66.857h-66.418h-17.61h-92.449V170.384h-17.671h-70.307c2.769-6.606,5.732-12.886,8.915-18.731
        c9.522-17.564,20.753-31.484,32.724-40.786c0.901-0.7,1.802-1.321,2.703-1.975c5.479-1.028,11.064-1.749,16.696-2.296
        c-0.327-3.737-0.554-7.487-0.554-11.257c0-8.348,0.814-16.503,2.322-24.417c-54.439,3.977-103.533,27.693-139.848,64.022
        c-39.939,39.919-64.702,95.252-64.689,156.184c-0.014,60.932,24.75,116.265,64.689,156.184
        c39.912,39.939,95.245,64.703,156.184,64.689c60.939,0.014,116.266-24.75,156.184-64.689
        c39.938-39.918,64.695-95.251,64.689-156.184C476.879,256.1,468.658,222.935,454.111,193.473z"/>
      <!-- Globe Grid Lines -->
      <path class="secondary-blue" d="M124.813,159.941c17.27-17.264,37.903-31.09,60.812-40.492c-10.918,14.133-20.213,31.404-27.76,50.936h-42.661
        C118.287,166.794,121.463,163.284,124.813,159.941z"/>
      <path class="secondary-blue" d="M101.731,188.054h49.955c-8.708,28.134-13.86,60.165-14.634,94.238H70.688
        C72.322,247.478,83.52,215.248,101.731,188.054z"/>
      <path class="secondary-blue" d="M94.504,382.422c-13.92-24.55-22.408-52.538-23.816-82.46h66.424
        c0.674,29.435,4.624,57.275,11.317,82.46H94.504z"/>
      <path class="secondary-blue" d="M124.813,422.314c-6.886-6.887-13.2-14.334-18.938-22.221h47.833
        c4.691,14.053,10.17,27.193,16.529,38.931c4.711,8.675,9.876,16.616,15.422,23.803
        C162.737,453.424,142.097,439.584,124.813,422.314z"/>
      <path class="light-blue" d="M247.164,476.433c-8.835-0.414-17.496-1.475-25.958-3.07
        c-0.908-0.654-1.808-1.274-2.71-1.968c-17.971-13.948-34.206-38.357-45.664-69.701c-0.186-0.52-0.353-1.081-0.547-1.602h74.879
        V476.433z"/>
      <path class="light-blue" d="M247.164,382.422H166.68c-7-24.758-11.251-52.725-11.965-82.46h92.449V382.422z"/>
      <path class="light-blue" d="M247.164,282.292h-92.509c0.814-34.54,6.453-66.744,15.568-94.238h76.94V282.292z"/>
      <path class="light-blue" d="M264.835,299.963h92.509c-0.701,29.729-4.985,57.702-11.985,82.46h-80.524V299.963z"/>
      <path class="light-blue" d="M293.503,471.395c-0.894,0.694-1.802,1.314-2.71,1.968c-8.462,1.595-17.123,2.656-25.958,3.07v-76.34h74.898
        c-3.964,11.044-8.488,21.28-13.506,30.509C316.705,448.165,305.474,462.079,293.503,471.395z"/>
      <path class="secondary-blue" d="M387.193,422.314c-17.283,17.264-37.91,31.097-60.825,40.506c11.691-15.135,21.574-33.792,29.388-55.04
        c0.921-2.496,1.749-5.112,2.603-7.688h47.766C400.385,407.98,394.073,415.427,387.193,422.314z"/>
      <path class="secondary-blue" d="M417.495,382.422H363.69c6.673-25.165,10.584-53.051,11.257-82.46h66.365
        C439.904,329.885,431.409,357.872,417.495,382.422z"/>
      <!-- Location Pin -->
      <path class="accent-red" d="M313.762,173.741c22.468,15.949,27.434,19.746,35.341,34.833c6.253,11.945,16.39,32.885,16.39,32.885
        c0.48,0.954,1.448,1.562,2.522,1.562c1.061,0,2.049-0.608,2.522-1.562c0,0,10.143-20.94,16.396-32.885
        c7.894-15.088,12.866-18.884,35.341-34.833c24.63-17.47,41.086-45.911,41.086-78.402C463.359,42.688,420.665,0,368.014,0
        c-52.658,0-95.332,42.688-95.332,95.339C272.682,127.83,289.125,156.27,313.762,173.741z"/>
      <!-- Pin Circle -->
      <path class="light-blue" d="M368.014,55.013c22.275,0,40.332,18.058,40.332,40.326c0,22.274-18.057,40.332-40.332,40.332
        c-22.275,0-40.326-18.058-40.326-40.332C327.689,73.071,345.739,55.013,368.014,55.013z"/>
    </svg>
    <span class="g-tooltip">切换地区和语言</span>
  `;

	// 创建主菜单下拉框
	const mainDropdown = document.createElement("div");
	mainDropdown.className = "main-dropdown";

	// 添加两个主菜单项
	const regionMenuOption = document.createElement("div");
	regionMenuOption.className = "menu-option";
	regionMenuOption.innerHTML = `
    <span class="menu-icon">🌎</span>
    选择地区
  `;

	const langMenuOption = document.createElement("div");
	langMenuOption.className = "menu-option";
	langMenuOption.innerHTML = `
    <span class="menu-icon">🔤</span>
    选择语言
  `;

	mainDropdown.appendChild(regionMenuOption);
	mainDropdown.appendChild(langMenuOption);

	// 创建地区选择下拉菜单
	const regionDropdown = document.createElement("div");
	regionDropdown.className = "region-dropdown";

	// 添加返回主菜单选项
	const regionBackOption = document.createElement("div");
	regionBackOption.className = "back-option";
	regionBackOption.innerHTML = `
    <span class="back-icon">←</span>
    返回
  `;
	regionDropdown.appendChild(regionBackOption);

	// 添加地区选项
	const regions = [
		{ code: "HK", label: "香港", flag: "🇭🇰" },
		{ code: "TW", label: "台湾", flag: "🇨🇳" },
		{ code: "JP", label: "日本", flag: "🇯🇵" },
		{ code: "SG", label: "新加坡", flag: "🇸🇬" },
		{ code: "US", label: "美国", flag: "🇺🇸" },
		{ code: "", label: "当前地区", flag: "🌐" },
	];

	regions.forEach((region) => {
		const option = document.createElement("a");
		option.className = "region-option";

		// 添加当前选中地区的高亮
		if ((region.code === "" && !currentRegion) || (region.code !== "" && currentRegion === region.code)) {
			option.classList.add("active");
		}

		option.innerHTML = `<span class="region-icon">${region.flag}</span>${region.label}`;

		// 生成新URL
		const url = new URL(window.location.href);
		if (region.code === "") {
			url.searchParams.delete("gl");
		} else {
			url.searchParams.set("gl", region.code);
		}
		option.href = url.toString();

		regionDropdown.appendChild(option);
	});

	// 创建语言选择下拉菜单
	const langDropdown = document.createElement("div");
	langDropdown.className = "lang-dropdown";

	// 添加返回主菜单选项
	const langBackOption = document.createElement("div");
	langBackOption.className = "back-option";
	langBackOption.innerHTML = `
    <span class="back-icon">←</span>
    返回
  `;
	langDropdown.appendChild(langBackOption);

	// 添加语言选项
	const languages = [
		{ code: "en", label: "English" },
		{ code: "ja", label: "Japanese (日本語)" },
		{ code: "zh-TW", label: "Traditional Chinese (繁體中文)" },
		{ code: "zh-CN", label: "Simplified Chinese (简体中文)" },
		{ code: "zh-CN|lang_zh-TW", label: "All Chinese (中文)" },
		{ code: "", label: "All Languages" },
	];

	languages.forEach((lang) => {
		const option = document.createElement("a");
		option.className = "lang-option";

		// 添加当前选中语言的高亮
		if ((lang.code === "" && !currentLang) || (lang.code !== "" && currentLang === lang.code)) {
			option.classList.add("active");
		}

		option.textContent = lang.label;

		// 处理URL，保留地区参数
		const url = new URL(window.location.href);
		if (lang.code === "") {
			url.searchParams.delete("lr");
		} else {
			url.searchParams.set("lr", "lang_" + lang.code);
		}
		option.href = url.toString();

		langDropdown.appendChild(option);
	});

	// 组装元素
	container.appendChild(button);
	container.appendChild(mainDropdown);
	container.appendChild(regionDropdown);
	container.appendChild(langDropdown);

	// 添加按钮点击事件，显示主菜单
	button.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		mainDropdown.classList.toggle("show");
		regionDropdown.classList.remove("show");
		langDropdown.classList.remove("show");
	});

	// 添加地区菜单选项点击事件
	regionMenuOption.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		mainDropdown.classList.remove("show");
		regionDropdown.classList.add("show");
	});

	// 添加语言菜单选项点击事件
	langMenuOption.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		mainDropdown.classList.remove("show");
		langDropdown.classList.add("show");
	});

	// 添加返回按钮点击事件
	regionBackOption.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		regionDropdown.classList.remove("show");
		mainDropdown.classList.add("show");
	});

	langBackOption.addEventListener("click", function (e) {
		e.preventDefault();
		e.stopPropagation();
		langDropdown.classList.remove("show");
		mainDropdown.classList.add("show");
	});

	// 点击下拉菜单区域内不会关闭菜单
	mainDropdown.addEventListener("click", function (e) {
		e.stopPropagation();
	});

	regionDropdown.addEventListener("click", function (e) {
		// 允许链接点击通过，但阻止冒泡
		if (e.target.tagName !== "A") {
			e.stopPropagation();
		}
	});

	langDropdown.addEventListener("click", function (e) {
		// 允许链接点击通过，但阻止冒泡
		if (e.target.tagName !== "A") {
			e.stopPropagation();
		}
	});

	return container;
}

// 初始化语言和地区选择器
function initLanguageRegionSelector() {
	// 获取当前URL中的语言和地区设置
	const currentUrl = window.location.href;
	const url = new URL(currentUrl);

	// 获取语言参数
	let currentLang = "";
	const langParam = url.searchParams.get("lr");
	if (langParam) {
		const langMatch = langParam.match(/lang_([^&]+)/);
		if (langMatch) {
			currentLang = langMatch[1];
		}
	}

	// 获取地区参数
	const currentRegion = url.searchParams.get("gl") || "";

	// 创建选择器元素
	const container = createLanguageRegionSelectorElements(currentLang, currentRegion);

	// 判断是搜索结果页还是首页
	if (window.location.href.includes("/search")) {
		// 搜索结果页
		const searchBtn = document.querySelector("button.Tg7LZd");
		if (!searchBtn) {
			setTimeout(initLanguageRegionSelector, 100);
			return;
		}

		// 插入到搜索按钮前面
		searchBtn.parentNode.insertBefore(container, searchBtn);

		// 处理图片搜索和视频搜索链接（保持原始脚本的功能）
		let allLinks = document.querySelectorAll("a.hide-focus-ring");
		for (let link of allLinks) {
			if (/(isch)|(vid)/.test(link.href)) {
				searchBtn.parentNode.insertBefore(link, searchBtn);
			}
		}
	} else {
		// 首页 - 使用提供的精确选择器
		// 麦克风和相机所在的父容器
		const rightIconsContainer = document.querySelector(".fM33ce.dRYYxd");

		if (!rightIconsContainer) {
			setTimeout(initLanguageRegionSelector, 100);
			return;
		}

		// 检查是否已经存在按钮，避免重复添加
		if (rightIconsContainer.querySelector(".lang-homepage-btn")) {
			return;
		}

		// 创建一个首页专用容器
		const homepageBtn = document.createElement("div");
		homepageBtn.className = "lang-homepage-btn";
		homepageBtn.appendChild(container);

		// 将按钮添加到右侧图标组的末尾
		rightIconsContainer.appendChild(homepageBtn);
	}

	// 点击页面其他区域关闭所有菜单
	document.addEventListener("click", function () {
		document.querySelector(".main-dropdown")?.classList.remove("show");
		document.querySelector(".region-dropdown")?.classList.remove("show");
		document.querySelector(".lang-dropdown")?.classList.remove("show");
	});
}

// 启动初始化并在DOM变化时重新检查
initLanguageRegionSelector();

// 添加MutationObserver以处理动态加载的元素
const observer = new MutationObserver(function (mutations) {
	// 检查是否存在语言切换按钮
	const isHomePage = !window.location.href.includes("/search");
	const selector = isHomePage ? ".lang-homepage-btn" : ".lang-dropdown-container";

	if (!document.querySelector(selector)) {
		initLanguageRegionSelector();
	}
});

observer.observe(document.body, { childList: true, subtree: true });
```

![](https://cdn.bili33.top/gh/miku8miku/images@main/202601121129009.png)![img](https://linux.do/uploads/default/original/4X/b/5/6/b5611761049480160e5d27857301b6d40afaf21e.png)![image-20260112113006403](https://cdn.bili33.top/gh/miku8miku/images@main/202601121130447.png)

![image-20260112113025670](https://cdn.bili33.top/gh/miku8miku/images@main/202601121130695.png)

![image-20260112112813508](https://cdn.bili33.top/gh/miku8miku/images@main/202601121128545.png)

