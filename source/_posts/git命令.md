---
title: Git 常用命令速查手册
date: 2022-09-17 14:30:00
index_img: img/bg/git.png
category: 技术笔记
tags:
  - Git
  - 版本控制
  - 开发工具
  - 命令行
math: false
mermaid: false
# sticky: 1 # 置顶
---

> Git 是现代软件开发中不可或缺的版本控制工具。本文整理了 Git 的常用命令和操作技巧，帮助开发者快速上手和解决常见问题。无论你是刚接触 Git 的新手，还是需要查阅特定命令的老手，这篇文章都能为你提供实用的参考。

<!-- more -->

## 基础操作

### 初始化仓库

创建一个新的本地 Git 仓库：

```bash
git init
```

### 添加文件到暂存区

将当前目录下的所有文件添加到暂存区：

```bash
git add .
```

或者添加指定文件：

```bash
git add filename.txt
```

### 提交更改

提交暂存区的文件到本地仓库，并添加提交信息：

```bash
git commit -m "首次提交"
```

## 远程仓库操作

### 创建远程仓库

在 GitHub、GitLab 或其他 Git 托管平台创建一个新的代码仓库。

### 关联远程仓库

将本地仓库与远程仓库关联：

```bash
git remote add origin https://github.com/username/repository.git
```

### 推送到远程仓库

将本地的 main 分支推送到远程仓库：

```bash
git push -u origin main
```

{% note primary %}
参数 `-u` 会将 origin main 设置为默认的推送地址，下次可以直接使用 `git push` 命令。
{% endnote %}

## 常见问题解决

### 首次提交失败

当在 GitHub 等平台创建仓库后，本地首次推送可能会遇到被拒绝的情况。这通常是因为本地和远程仓库不在同一个历史版本中。

**解决方法：**

1. 合并远程仓库的历史：

```bash
git pull origin main --allow-unrelated-histories
```

2. 再次推送本地代码：

```bash
git push origin main
```

{% note warning %}
使用 `--allow-unrelated-histories` 参数时要谨慎，确保你了解要合并的内容。
{% endnote %}

## 其他实用命令

### 查看远程仓库信息

查看当前配置的远程仓库地址：

```bash
git remote -v
```

### 修改远程仓库地址

更改远程仓库的 URL：

```bash
git remote set-url origin https://github.com/new-username/new-repository.git
```

### 删除远程仓库关联

移除与远程仓库的关联：

```bash
git remote remove origin
```

### 查看提交历史

查看提交记录：

```bash
git log
```

简化显示：

```bash
git log --oneline
```

### 查看工作区状态

查看当前工作区的文件状态：

```bash
git status
```

## 快速参考表

| 命令 | 功能 |
|:---|:---|
| `git init` | 初始化本地仓库 |
| `git add .` | 添加所有文件到暂存区 |
| `git commit -m "message"` | 提交更改并添加描述 |
| `git push` | 推送到远程仓库 |
| `git pull` | 从远程仓库拉取更新 |
| `git status` | 查看工作区状态 |
| `git log` | 查看提交历史 |
| `git remote -v` | 查看远程仓库信息 |

## 总结

Git 作为版本控制工具，掌握这些基础命令已经足够应对大部分开发场景。建议初学者从这些基础命令开始，逐步熟悉 Git 的工作流程。随着使用经验的积累，可以进一步学习分支管理、合并冲突解决等高级功能。

{% note success %}
记住：多练习是掌握 Git 的最佳方式。不要害怕在测试项目中尝试各种命令！
{% endnote %}