---
title: 逆向 AI接口技术详解
date: 2026-02-11 21:30:00
index_img: https://pic1.imgdb.cn/item/6975e5066deeadc41a33a4d4.png
categories: [技术分享, 逆向工程]
tags: [AI接口, 逆向分析, API研究, 技术探索]
---

逆向 AI。

**获取信息**
------

### 材料

- 一个电脑
- 智谱请言账号（我们用智谱当靶子）

------

### 正式开始

1. 打开[智谱清言](https://chatglm.cn/)

![image-20260212211004036](https://cdn.bili33.top/gh/miku8miku/images@main/202602122110093.png)



1. 打开控制台
   按下 F12，找到网络 (network)

   ![image-20260212211025558](https://cdn.bili33.top/gh/miku8miku/images@main/202602122110760.png)

2. 和 AI 对话
   可以看到立即出现了

   ![image-20260212211047131](https://cdn.bili33.top/gh/miku8miku/images@main/202602122110168.png)

   这种 stream 流，或者是其他的，但是我们可以通过这个列表来分析，p.gif 肯定不可能吧，图像、音频、JS 全忽略就行。

   ![image-20260212211129390](https://cdn.bili33.top/gh/miku8miku/images@main/202602122111462.png)

   我们接着观察这三个快，组合起来，得到信息（保存为一个 txt 文件）：

   

```txt
标头：
负载：
SSE
```

我们分析 EventStream 发现是 data: 开头，便可确定是 SSE
标头我们不用管，再分析负载：

```json
{"assistant_id":"65940acff94777010aa6b796","conversation_id":"","project_id":"","chat_type":"user_chat","meta_data":{"cogview":{"rm_label_watermark":false},"is_test":false,"input_question_type":"xxxx","channel":"","draft_id":"","chat_mode":"","is_networking":false,"quote_log_id":"","platform":"pc"},"messages":[{"role":"user","content":[{"type":"text","text":"你好"}]}]}
```

tips:

![image-20260212211142173](https://cdn.bili33.top/gh/miku8miku/images@main/202602122111257.png)


确保是视图已分析



找到 “你好” 这里很明显就是我们的消息，把你好替换为 {{消息}}
之后统统扔进 txt 文件，最后仍给 AI 分析

------

到此，我们的获取信息就完成了，下一篇我们编写代码（AI）



本篇我们的主题是**开发代码**
开始之前我们先填上次的问题:

```undefined
65940acff94777010aa6b796
```

这传字符的来历
我们先把控制台打开，之后刷新页面

------

tips：出现 “在已在调试程序中暂停” 的解决方法：

![image-20260212211152841](https://cdn.bili33.top/gh/miku8miku/images@main/202602122111917.png)



------

刷新页面
看到请求

```ruby
https://zpqy.cn-wulanchabu.log.aliyuncs.com/logstores/front/track?APIVersion=0.6.0
```

里面包含 uid，这就是 `65940acff94777010aa6b796` 的来历，后续要用。

------

接着我们套一个 prompt 给 AI，prompt：

~~~go
帮我写一个程序，用python实现。
实现AI聊天的功能。下面是类似的
```
信息
```
之后就是写个终端交互的。
~~~

------

对的，这个 prompt 就是这么土。。。

------

结果到了现在突然更新，链接变成了` https://chatglm.cn/chatglm/backend-api/assistant/stream?refer__991=222029ad07-2%2FAP7PbPJgL7TX_kIgHjt2%2FTRkIIEsWgfPgUfvGXsfgxaAXGacg_4uPqwUUJa8DKYgtK_%3Dg_2_htgTZgXBa2_CgAB_LgG2gAxgA5jBmudbstglvg6tgIK_mg6LxKAP_bFFZyjwzggsPtlgIvXgcua7ggDnc%2F_JSPgCcAbG%3DvgpYxx7grCtgtXgbxGgI%2F_FoPghcfBSgtE2gGDENi7gPAugOo4gYqh8vYKuA_gBSZbtxo7oWILsYG7jSPgkWeg%2FQJ7P2g`





AI 真好用，有问题直接文 AI，先按照 1 中得到配置，之后给 AI，看 AI 写程序：

![image-20260212211209418](https://cdn.bili33.top/gh/miku8miku/images@main/202602122112499.png)



------

之后再把它给的配置模板喂给他并且找到：

![image-20260212211223815](https://cdn.bili33.top/gh/miku8miku/images@main/202602122112947.png)



复制下来，让 AI 写个模板提取器。

![image-20260212211242202](https://cdn.bili33.top/gh/miku8miku/images@main/202602122112275.png)

------

OK，我们得到了 config.json.
这时候，我们发现 AI 给的程序不能用。。。坏了，被 AI 骗了。

------

但是如果这时候再发一篇文章那就是纯水了啊啊
so，我们只能尝试分析 JS，

![image-20260212211258466](https://cdn.bili33.top/gh/miku8miku/images@main/202602122112531.png)



一排排混淆的 js 真美丽



------

那我们只能再试试模拟浏览器了
那就用 `playwright` 来实现吧。

------

我们继续分析

![image-20260212211310901](https://cdn.bili33.top/gh/miku8miku/images@main/202602122113981.png)


我们通过这两个标签定位。
OK
我们写了 prompt
得到：



```yaml
输入框：
标签textarea
placeholder="和我聊聊天吧"
输入传入的数据

src="/img/send.『『xxxx』』.svg"
点击
之后得到https://chatglm.cn/chatglm/backend-api/assistant/stream
的SSE返回，你流式输出到终端
无需cookie
---
需要看着真实的浏览器环境，每次点击记得出现偏差。使用msedge
----
url：chatglm.cn/main/alltooldetail?lang=zh
```

------

给 AI，AI 写出代码：

```python
代码保密
```

总算成了！！！

```auto
cdy@debian:~/glm$ python3 main.py
[15:57:59] 启动自动化任务...
[15:58:05] 页面加载完成
[15:58:09] 找到输入框
[15:58:12] 输入完成: '你好，我想聊聊天，请介绍一下你自己'
[15:58:13] 找到发送按钮，准备点击
[15:58:14] 已点击发送
[15:58:14] 等待 SSE 流式响应...

[15:58:15] 捕获到 SSE 流请求: https://chatglm.cn/chatglm/backend-api/assistant/stream
[15:58:16] 开始解析 SSE 数据...
[15:58:16] 原始数据长度: 5005 字符
[JSON] {"id": "698ae51752ca8d3541232e5c", "conversation_id": "698ae51752ca8d3541232e5b", "assistant_id": "65940acff94777010aa6b796", "parts": [{"id": "698ae51752ca8d3541232e5c", "logic_id": "462cb4de-78ce-49ae-9421-f28cee64f6a0", "role": "assistant", "content": [{"type": "think", "tool_calls": {}, "think": "1.  **分析用户的请求：**\n    *   用户的问候语：“你好，我想聊聊天”（你好，我想聊聊天）。\n    *   用户的请求：“请介绍一下你自己”（请介绍一下你自己）。\n    *   语境：用户正在开启一段对话，并且首先想了解我（这个 AI）是谁。\n\n2.  **确定角色设定和语气：**\n    *   **角色设定：** 我是一个大型语言模型（GLM，由Z.ai训练）。我应该乐于助人、友好、知识渊博且客观。\n    *   **语气：** 乐于交谈、礼貌、信息丰富，但又平易近人。既然用户想“聊聊天”，我应该听起来不要*太*机械或枯燥。\n\n3.  **起草介绍——需要包含的关键信息：**\n    *   **身份：** 我是GLM，一个大型语言模型。\n    *   **创造者：** 由Z.ai训练。\n    *   **我能做什么：** 回答问题、生成文本、翻译、编程、聊天、头脑风暴等。\n    *   **我的本质：** 我是一个 AI。我没有个人情感、意识或物理身体。我基于海量的数据进行训练。\n    *   **我的目标：** 为用户提供帮助、提供准确信息，以及陪伴用户。\n\n4.  **构建回复的结构：**\n    *   **问候：** 对用户的问候表示回应，并表达聊天的意愿。\n    *   **核心介绍：** 清晰地说明我是谁（GLM，来自Z.ai的AI）。\n    *   **解释能力（我能做什么）：** 使用项目符号或逗号分隔的列表以使其清晰。这比一大段文字更容易阅读。提及诸如问答、创意写作、翻译、编程等任务。\n    *   **解释我的局限性（我不是什么）：** 这对于管理用户期望和保持透明度至关重要。提及我没有个人经历或情感。我的知识基于我所受训的数据。\n    *   **行动号召/开启话题：** 将话题交还给用户。询问他们想聊什么或者有什么可以帮忙的。这能鼓励用户继续聊天。\n\n5.  **起草内容（中文的反复润色）：**\n\n    *   *初步构思：* 你好！我是GLM，一个由Z.ai训练的AI。我可以回答问题，写文章，翻译。我没有感情。你想聊什么？ -> *太简略，有点机械。*\n\n    *   *第二稿：* 你呀！很高兴和你聊天。我是GLM，一个大型语言模型。我的开发公司是Z.ai。我的知识库很大，可以帮你处理很多任务，比如写邮件、查资料、甚至编程。不过，我没有自己的思想和感情，只是一个程序。 -> *更好，但可以更吸引人一些。*\n\n    *   *第三稿（接近最终版）：* 你呀！很高兴认识你，也非常乐意和你聊天。\n        我是GLM，由Z.ai训练的大型语言模型。你可以把我理解成一个非常博学、反应很快的AI助手。\n        我能做什么呢？我的技能点还挺多的：\n        *   **回答问题**：无论是生活常识、科学原理还是历史典故，都可以问我。\n        *   **文本创作**：写一封邮件、写首小诗、想个剧本大纲，我都可以试试。\n        *   **头脑风暴**：如果你有新想法，我们可以一起讨论，帮你理清思路。\n        *   **语言翻译**：在多种语言之间进行互译。\n        *   **编程辅助**：帮你写代码、找bug。\n        当然，我也有局限性。我没有个人经历和情感，我的所有知识都来自我学习的庞大文本数据。有时我可能会犯错，所以如果你发现我的说法不准确，也欢迎随时指正。\n        今天你想聊些什么呢？是有什么具体的问题想问我，还是想随便聊聊某个话题？我随时准备着！ -> *这看起来不错。它结构清晰、友好、全面，并且很好地过渡到了聊天环节。*\n\n6.  **最终润色：** 审查草稿。语言自然吗？友好吗？信息是否准确？是的，第三稿看起来很棒。我会使用这个结构。"}], "model": "moe_47", "meta_data": {"auto_glm_data": {}, "show_type": "mc_tool_think2", "tool_result_extra": {"tool_call_name": ""}}, "status": "finish"}], "created_at": "2026-02-10 15:58:15", "status": "init", "last_error": {}, "meta_data": {"if_plus_model": false, "plus_model_available": true, "if_increase_push": false}}
[JSON] {"id": "698ae51752ca8d3541232e5c", "conversation_id": "698ae51752ca8d3541232e5b", "assistant_id": "65940acff94777010aa6b796", "parts": [{"id": "698ae51752ca8d3541232e5c", "logic_id": "9a3be7d0-2206-462e-b392-31dac7746d54", "role": "assistant", "content": [{"type": "tool_calls", "tool_calls": {"name": "finish", "arguments": "{}"}}], "model": "moe_47", "meta_data": {"auto_glm_data": {}, "show_type": "mc_tool_call2"}, "status": "finish"}], "created_at": "2026-02-10 15:58:15", "status": "init", "last_error": {}, "meta_data": {"if_plus_model": false, "plus_model_available": true, "if_increase_push": false}}
[JSON] {"id": "698ae51752ca8d3541232e5c", "conversation_id": "698ae51752ca8d3541232e5b", "assistant_id": "65940acff94777010aa6b796", "parts": [{"id": "698ae51752ca8d3541232e5c", "logic_id": "f893fc64-f965-42c0-a02d-809cfd26f806", "role": "assistant", "content": [{"type": "text", "text": "你好呀！很高兴认识你，也非常乐意和你聊天。\n\n我是GLM，一个由Z.ai训练的大型语言模型。你可以把我理解为一个非常博学、反应很快的AI助手。\n\n我没有名字，但我可以成为你的好伙伴。我的“大脑”里装了海量的知识，从科学技术到文学艺术，从生活常识到编程代码，都有所涉猎。\n\n**具体来说，我可以帮你做这些事情：**\n\n*   **回答问题**：如果你有疑惑，无论是“天空为什么是蓝的”还是“如何做一道好吃的红烧肉”，都可以问我。\n*   **辅助创作**：写一封邮件、构思一个故事、写一首诗，或者帮你润色文章，我都可以帮忙。\n*   **头脑风暴**：当你需要新点子时，我们可以一起讨论，帮你拓展思路。\n*   **语言翻译**：在不同语言之间进行互译，帮你打破语言障碍。\n*   **编程辅助**：帮你写代码、解释代码逻辑，或者排查bug。\n\n不过，我也有自己的局限性。我没有个人经历和情感，我的所有知识都来自于我学习过的文本数据。所以，我无法像人类一样有真实的感受，但我会尽我所能，用客观、中立的方式来帮助你。\n\n今天你想聊些什么呢？是有什么具体的问题，还是想随便聊聊某个话题？我随时准备着！", "tool_calls": {}}], "model": "moe_47", "meta_data": {"auto_glm_data": {}, "tool_result_extra": {"think_finished_time": 44}}, "status": "finish"}], "created_at": "2026-02-10 15:58:15", "status": "init", "last_error": {}, "meta_data": {"if_plus_model": false, "plus_model_available": true, "if_increase_push": false}}
[JSON] {"id": "698ae51752ca8d3541232e5c", "conversation_id": "698ae51752ca8d3541232e5b", "assistant_id": "65940acff94777010aa6b796", "parts": [{"id": "698ae51752ca8d3541232e5c", "logic_id": "f893fc64-f965-42c0-a02d-809cfd26f806", "role": "assistant", "content": [{"type": "text", "text": "你好呀！很高兴认识你，也非常乐意和你聊天。\n\n我是GLM，一个由Z.ai训练的大型语言模型。你可以把我理解为一个非常博学、反应很快的AI助手。\n\n我没有名字，但我可以成为你的好伙伴。我的“大脑”里装了海量的知识，从科学技术到文学艺术，从生活常识到编程代码，都有所涉猎。\n\n**具体来说，我可以帮你做这些事情：**\n\n*   **回答问题**：如果你有疑惑，无论是“天空为什么是蓝的”还是“如何做一道好吃的红烧肉”，都可以问我。\n*   **辅助创作**：写一封邮件、构思一个故事、写一首诗，或者帮你润色文章，我都可以帮忙。\n*   **头脑风暴**：当你需要新点子时，我们可以一起讨论，帮你拓展思路。\n*   **语言翻译**：在不同语言之间进行互译，帮你打破语言障碍。\n*   **编程辅助**：帮你写代码、解释代码逻辑，或者排查bug。\n\n不过，我也有自己的局限性。我没有个人经历和情感，我的所有知识都来自于我学习过的文本数据。所以，我无法像人类一样有真实的感受，但我会尽我所能，用客观、中立的方式来帮助你。\n\n今天你想聊些什么呢？是有什么具体的问题，还是想随便聊聊某个话题？我随时准备着！", "tool_calls": {}}], "model": "moe_47", "meta_data": {"auto_glm_data": {}, "tool_result_extra": {"think_finished_time": 44}}, "status": "finish"}], "created_at": "2026-02-10 15:58:15", "status": "finish", "last_error": {}, "meta_data": {"if_plus_model": false, "plus_model_available": true, "if_increase_push": false}}
[15:58:16] SSE 数据解析完成
[15:58:16] SSE 响应已完成

[15:58:19] === 响应总结 ===
总共捕获到 4 条 SSE 数据
Think 数据数量: 0
Output 数据数量: 0
其他数据数量: 4
[15:58:22] 浏览器已关闭
```

后续，我们要封装成 openai 格式。
且听下回分解



保护下 chatGLM，你可以把下面的伪代码粘贴给 ChatGLM 来还原
[教程](https://linux.do/t/topic/1590970)中的代码

```auto
// ================= 配置参数 =================
设置 CONFIG 配置字典:
    url = "https://chatglm.cn/main/alltooldetail?lang=zh"
    message = "你好，我想聊聊天，请介绍一下你自己"
    headless = False
    timeout = 60

// ================= 辅助函数 =================
函数 human_delay(min_ms=500, max_ms=2000):
    功能：模拟人类操作的随机延迟
    生成 min_ms 到 max_ms 之间的随机延迟时间（转换为秒）
    异步等待该时长

函数 human_type(page, selector, text):
    功能：模拟人类打字，每个字符之间有随机间隔
    点击选择器定位的元素
    等待 0.1 到 0.5 秒
    按下键盘 "Control+A" (全选)
    等待 0.1 秒
    按下键盘 "Backspace" (删除)
    遍历 text 中的每个字符：
        输入当前字符
        等待 0.05 到 0.15 秒

// ================= 主逻辑 =================
异步函数 main():
    打印 "启动自动化任务..."

    启动 Playwright 异步上下文:
        启动 Chromium 浏览器 (使用 Edge 渠道，根据 headless 配置显示界面，窗口最大化)
        创建浏览器上下文 (视口设为 None，设置 Windows Edge User-Agent)
        创建新页面

        // --- SSE 数据捕获准备 ---
        初始化列表 sse_data_collected
        初始化异步事件 sse_completed (用于标记完成)

        定义异步响应处理函数 handle_response(response):
            如果响应 URL 包含 "backend-api/assistant/stream":
                打印 "捕获到 SSE 流请求"
                尝试:
                    获取响应体内容并解码为文本
                    打印 "开始解析 SSE 数据" 及数据长度

                    按换行符分割文本行
                    遍历每一行:
                        如果行首为 "data:":
                            提取 data 内容并加入 sse_data_collected
                            尝试解析为 JSON:
                                如果包含 "event" 字段:
                                    若 event 为 "think": 打印 "[THINK] 内容"
                                    若 event 为 "message": 打印 "[OUTPUT] 内容"
                                    若 event 为 "done": 打印 "收到完成信号" 并触发 sse_completed
                                    否则: 打印 "未知事件类型"
                                否则若包含 "content": 打印 "[CONTENT] 内容"
                                否则: 打印完整 JSON
                            若 JSON 解析失败:
                                打印 "[RAW] 原始内容"
                    
                    打印 "SSE 数据解析完成" 并触发 sse_completed
                捕获异常:
                    打印错误信息及堆栈

        // 注册响应监听器
        页面绑定 "response" 事件到 handle_response

        尝试执行:
            // --- 页面操作 ---
            访问 CONFIG['url']，等待网络空闲
            打印 "页面加载完成"
            调用 human_delay (2~4秒)

            定位输入框选择器 'textarea[placeholder="和我聊聊天吧"]'，等待出现
            打印 "找到输入框"

            调用 human_type 输入 CONFIG['message']
            打印 "输入完成"
            调用 human_delay (1~2秒)

            // --- 查找并发送消息 ---
            尝试:
                等待 'img[src*="send"]' 出现，获取其父元素作为发送按钮
            若失败:
                遍历备用选择器列表 ['button[type="submit"]', ...]:
                    若元素可见，则定位为发送按钮并跳出循环
            
            若未找到发送按钮:
                抛出异常 "未找到发送按钮"

            打印 "找到发送按钮，准备点击"
            滚动按钮到视图内
            调用 human_delay (0.5~1秒)
            点击发送按钮
            打印 "已点击发送"

            // --- 等待响应 ---
            打印 "等待 SSE 流式响应..."
            尝试:
                等待 sse_completed 事件触发 (超时时间 CONFIG['timeout'])
                打印 "SSE 响应已完成"
            捕获超时错误:
                打印 "SSE 响应超时"
            
            额外等待 3 秒

            // --- 结果统计 ---
            打印 "=== 响应总结 ==="
            打印总共捕获到的 SSE 数据条数

            初始化分类计数器 (think_data, output_data, other_data)
            遍历 sse_data_collected:
                尝试解析 JSON:
                    根据 event 类型或是否包含 content 分类计数
                捕获异常:
                    计入 other_data
            
            打印各类数据的数量统计

        捕获异常:
            打印 "发生错误" 及堆栈信息
            截图保存为 "error_screenshot.png"
        
        最后:
            调用 human_delay (2~3秒)
            关闭浏览器
            打印 "浏览器已关闭"

// ================= 程序入口 =================
如果脚本直接运行:
    运行 main() 异步任务
```

