---
title: Docker 部署 FunASR 语音转文字服务完整指南
date: 2024-09-12 15:00:00
index_img: img/bg/funasr.png
category: 技术教程
tags:
  - Docker
  - FunASR
  - 语音识别
  - ASR
  - 语音转文字
  - 机器学习
math: false
mermaid: false
# sticky: 1 # 置顶
---

> 在数字化时代，语音转文字技术在会议记录、音频处理等场景中发挥着重要作用。本文将详细介绍如何使用 Docker 部署 FunASR 语音转文字服务，这是一个功能强大且识别准确率高的开源语音识别工具包。无论您是需要处理会议录音还是通话记录，FunASR 都能为您提供可靠的解决方案。

<!-- more -->

## 项目背景

在日常工作中，我们经常需要处理各种音频内容，如会议记录、通话录音等。手动转录不仅耗时耗力，而且容易出错。为了解决这个问题，我在 NodeSeek 论坛坛友的建议下发现了 FunASR 这个优秀的项目。

经过实际使用测试，FunASR 的识别准确率表现优异，完全能够满足日常的语音转文字需求，而且可以与 GPT 等 AI 工具配合进行后续的内容总结和处理。

## FunASR 简介

**FunASR** 是一个功能丰富的基础语音识别工具包，提供了多种强大的功能：

- 🎤 **语音识别（ASR）**：支持多种音频格式的语音转文字
- 🔍 **语音端点检测（VAD）**：自动检测语音的开始和结束
- ✏️ **标点恢复**：为转录文本自动添加标点符号
- 🧠 **语言模型**：提升识别准确率
- 👥 **说话人验证与分离**：支持多人对话场景
- 📝 **多人对话语音识别**：适用于会议等多人场景

{% note primary %}
FunASR 提供了便捷的脚本和教程，支持预训练模型的推理与微调，目前支持 Docker 部署（CPU 版本），同时支持实时转换和离线转换两种模式。
{% endnote %}

## 官方在线服务

如果您只是偶尔使用语音转文字功能，可以直接使用官方提供的在线服务，无需自建服务器：

### 官方 H5 页面

访问官方 H5 页面：[FunASR 在线服务](https://www.funasr.com)

![官方页面截图](https://gh.llkk.cc/https://raw.githubusercontent.com/miku8miku/picture/main/2025/09/upgit_20250917_1758099235.png)

虽然页面相对简洁，但包含了所有必要的功能。

### 服务器地址说明

官方提供了两个不同的服务地址，支持不同的音频格式：

| 服务地址 | 功能 | 支持格式 |
|:---|:---|:---|
| `wss://www.funasr.com:10096/` | 实时语音识别 | PCM、WAV 格式 |
| `wss://www.funasr.com:10095/` | 离线语音识别 | MP3、M4A 等格式 |

{% note warning %}
实时识别服务（10096端口）不支持 MP3、M4A 等压缩格式，请选择合适的服务地址。
{% endnote %}

## 自建 ASR 服务器

如果您有大量的音频处理需求，或者对数据隐私有特殊要求，建议自建 FunASR 服务。

### Docker Compose 配置

为了同时部署实时和离线两个服务，我们使用 Docker Compose 进行部署：

```yaml
version: '3'
services:
  funasr:
    image: registry.cn-hangzhou.aliyuncs.com/funasr_repo/funasr:funasr-runtime-sdk-cpu-0.4.5
    container_name: funasr
    ports:
      - "10095:10095"
    privileged: true
    volumes:
      - /home/docker/funasr/models:/workspace/models
      - /home/docker/funasr/samples:/samples
      - /home/docker/funasr/mp3:/mp3
    command: tail -f /dev/null
    
  funasr-online:
    image: registry.cn-hangzhou.aliyuncs.com/funasr_repo/funasr:funasr-runtime-sdk-online-cpu-0.1.10
    container_name: funasr-online
    ports:
      - "10096:10095"
    privileged: true
    volumes:
      - /home/docker/funasr/models:/workspace/models
      - /home/docker/funasr/samples:/samples
      - /home/docker/funasr/mp3:/mp3
    command: tail -f /dev/null
```

### 目录映射说明

| 容器路径 | 宿主机路径 | 说明 |
|:---|:---|:---|
| `/workspace/models` | `/home/docker/funasr/models` | **必需**：模型文件存储目录 |
| `/samples` | `/home/docker/funasr/samples` | 可选：测试样本目录 |
| `/mp3` | `/home/docker/funasr/mp3` | 可选：音频文件测试目录 |

{% note info %}
只有模型目录的映射是必需的，其他目录映射是为了方便测试和调试。
{% endnote %}

## 服务启动配置

### 启动离线语音识别服务

```bash
# 进入容器
docker exec -it funasr bash

# 进入服务目录
cd /workspace/FunASR/runtime

# 启动离线识别服务
nohup bash run_server_2pass.sh \
  --model-thread-num 8 \
  --download-model-dir /workspace/models \
  --vad-dir damo/speech_fsmn_vad_zh-cn-16k-common-onnx \
  --model-dir damo/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-onnx \
  --online-model-dir damo/speech_paraformer-large_asr_nat-zh-cn-16k-common-vocab8404-online-onnx \
  --punc-dir damo/punc_ct-transformer_zh-cn-common-vad_realtime-vocab272727-onnx \
  --itn-dir thuduj12/fst_itn_zh \
  --hotword /workspace/models/hotwords.txt > log.txt 2>&1 &
```

### 启动实时语音识别服务

```bash
# 进入容器
docker exec -it funasr-online bash

# 进入服务目录
cd /workspace/FunASR/runtime

# 启动实时识别服务
nohup bash run_server.sh \
  --model-thread-num 8 \
  --download-model-dir /workspace/models \
  --vad-dir damo/speech_fsmn_vad_zh-cn-16k-common-onnx \
  --model-dir damo/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-onnx \
  --punc-dir damo/punc_ct-transformer_cn-en-common-vocab471067-large-onnx \
  --lm-dir damo/speech_ngram_lm_zh-cn-ai-wesp-fst \
  --itn-dir thuduj12/fst_itn_zh \
  --hotword /workspace/models/hotwords.txt > log.txt 2>&1 &
```

### 高级配置选项

#### 关闭 SSL
如果您不需要 SSL 加密，可以添加参数：
```bash
--certfile 0
```

#### 模型选择
根据需求可以选择不同的模型：

| 模型类型 | 模型路径 | 功能特点 |
|:---|:---|:---|
| 时间戳模型 | `damo/speech_paraformer-large-vad-punc_asr_nat-zh-cn-16k-common-vocab8404-onnx` | 提供精确的时间戳信息 |
| NN热词模型 | `damo/speech_paraformer-large-contextual_asr_nat-zh-cn-16k-common-vocab8404-onnx` | 支持神经网络热词识别 |

#### 热词配置
在宿主机文件 `/home/docker/funasr/models/hotwords.txt` 中配置热词：

```text
阿里巴巴 20
人工智能 15
机器学习 10
```

格式：`热词 权重`（每行一个）

{% note warning %}
首次启动时需要等待模型下载完成，可以通过查看 `log.txt` 文件监控下载进度。
{% endnote %}

## 服务测试与使用

### 监控服务状态

```bash
# 查看服务日志
tail -f log.txt

# 检查端口占用
netstat -tlnp | grep 1009
```

### 使用自建服务

服务启动完成后，您可以：

1. **使用官方 H5 页面**：将 ASR 服务器地址替换为您的服务器地址
2. **下载官方测试包**：获取完整的测试示例和 H5 页面
3. **自定义开发**：通过 WebSocket 接口集成到您的应用中

### 效果展示

经过优化的界面显示效果：

![自建服务效果图](https://gh.llkk.cc/https://raw.githubusercontent.com/miku8miku/picture/main/2025/09/upgit_20250917_1758099192.png)

相比官方页面，自定义界面在时间显示等方面更加清晰明了。

## 常见问题与解决方案

### 1. 模型下载缓慢
**解决方案**：
- 使用国内镜像源
- 手动下载模型文件到指定目录
- 配置代理服务器

### 2. 内存不足
**解决方案**：
- 减少 `--model-thread-num` 参数值
- 增加服务器内存
- 使用更小的模型

### 3. 识别准确率不高
**解决方案**：
- 确保音频质量清晰
- 配置适当的热词
- 选择合适的模型类型

## 性能优化建议

### 硬件要求
- **CPU**：建议 4 核心以上
- **内存**：建议 8GB 以上
- **存储**：SSD 硬盘，至少 20GB 可用空间

### 配置优化
- 根据 CPU 核心数调整 `--model-thread-num`
- 定期清理日志文件
- 监控资源使用情况

## 总结

FunASR 作为一个强大的开源语音识别工具包，为我们提供了高质量的语音转文字解决方案。通过 Docker 部署，我们可以轻松搭建自己的语音识别服务，既保证了数据隐私，又能获得出色的识别效果。

### 主要优势
- ✅ **识别准确率高**：经过大量数据训练的预训练模型
- ✅ **部署简单**：Docker 一键部署，环境配置简单
- ✅ **功能丰富**：支持多种识别模式和高级功能
- ✅ **开源免费**：完全开源，可自由使用和修改
- ✅ **扩展性强**：支持热词、时间戳等高级功能

### 适用场景
- 📝 会议录音转录
- 📞 客服通话记录处理
- 🎥 视频字幕生成
- 📚 教育培训内容转录
- 🔊 播客节目文字化

{% note success %}
建议在生产环境中，结合负载均衡和监控系统，构建更加稳定可靠的语音识别服务。同时，定期更新模型版本，以获得更好的识别效果。
{% endnote %}

## 相关资源

- [FunASR 官方文档](https://github.com/alibaba-damo-academy/FunASR)
- [Docker 官方文档](https://docs.docker.com/)
- [语音识别技术原理](https://zh.wikipedia.org/wiki/%E8%AF%AD%E9%9F%B3%E8%AF%86%E5%88%AB)