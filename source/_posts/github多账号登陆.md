---
title: GitHub 多账号登录方法总结
date: 2026-01-22 07:00:00
index_img: https://cdn.bili33.top/gh/miku8miku/images@main/202601241527397.png
categories: [技术分享]
tags: [GitHub, 多账号, Git]
---

# GitHub 多账号登录方法总结

## 一、使用 GitHub CLI (`gh`) 管理多账号

### 1. 查看当前登录状态
```bash
gh auth status
```
显示当前已登录的账号及其认证状态。

### 2. 查看所有已登录账号
```bash
gh auth list
```
列出所有已添加的 GitHub 账号。

### 3. 切换账号
```bash
gh auth switch
```
在多个已登录账号之间进行切换。

### 4. 添加新账号登录
```bash
gh auth login -h github.com -p https
```
参数说明：
- `-h github.com`：指定主机为 github.com
- `-p https`：使用 HTTPS 协议

---

## 二、使用 Git Credential Manager 管理凭据（推荐）

### 1. 登出指定账号
```bash
git credential-manager github logout <用户名>
```
例如：
```bash
git credential-manager github logout miku8miku
```

### 2. 推送时指定远程仓库
```bash
git push -u origin main
```
首次推送时会触发身份验证，可以选择要使用的账号。

---

## 三、多账号管理流程

```
┌─────────────────────────────────────────────────────┐
│                  GitHub 多账号管理                    │
├─────────────────────────────────────────────────────┤
│  1. gh auth login    →  添加第一个账号               │
│  2. gh auth login    →  添加第二个账号               │
│  3. gh auth list     →  查看所有账号                 │
│  4. gh auth switch   →  切换到目标账号               │
│  5. gh auth status   →  确认当前账号                 │
└─────────────────────────────────────────────────────┘
```

---

## 四、常见问题处理

| 问题 | 解决方案 |
|------|----------|
| 推送到错误的账号 | 使用 `gh auth switch` 切换账号 |
| 凭据缓存冲突 | 使用 `git credential-manager github logout` 清除 |
| 需要重新认证 | 使用 `gh auth login` 重新登录 |

---

## 五、最佳实践建议

1. **使用 HTTPS 协议**：配合 `gh` CLI 更容易管理多账号
2. **定期检查状态**：使用 `gh auth status` 确认当前使用的账号
3. **项目级配置**：可以在不同项目中配置不同的 git 用户信息
   ```bash
   git config user.name "用户名"
   git config user.email "邮箱"
   ```

这样就可以方便地在多个 GitHub 账号之间进行切换和管理了！



![image-20260115161445506](https://cdn.bili33.top/gh/miku8miku/images@main/202601151614758.png)

![image-20260115161459553](https://cdn.bili33.top/gh/miku8miku/images@main/202601151614591.png)

![image-20260115162259805](https://cdn.bili33.top/gh/miku8miku/images@main/202601151622864.png)

![image-20260118130505123](https://cdn.bili33.top/gh/miku8miku/images@main/202601181305402.png)
