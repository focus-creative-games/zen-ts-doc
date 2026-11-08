---
sidebar_position: 3
title: 兼容性
description: Unity 版本、运行时与平台支持范围。
---

# 兼容性

## Unity / 团结

| 版本 | 状态 |
|------|------|
| Unity **2021.3.x** | ✅ 支持 |
| Unity **2022.3.x** | ✅ 支持 |
| Unity **6000.0.x** | ✅ 支持 |
| Unity **6000.3.x** | ✅ 支持 |
| Unity **6000.5.x** | ✅ 支持 |
| **团结引擎 1.x.y** | ✅ 支持 |

libil2cpp patch 解析见 [多版本管理](/docs/spec/11-MULTI-VERSION/)。

## 脚本 VM 与运行时

| 类别 | 状态 |
|------|------|
| **脚本 VM** | Editor 与非 HostJs Player：**QuickJS**（pin 见包内 `ZenTS~/`）。**WebGL Player：宿主 JS**。无 PUC-Rio / LuaJIT 切换 |
| **Editor** | **Mono**（Expression Emit；与 Il2Cpp **JS 可见语义一致**） |
| **Player** | **Il2Cpp**（权威实现；`zents-runtime` C++ 桥） |

**Il2Cpp 构建：** 发布前执行 **`ZenTS/Generate/All`**（C++ stub，**不是** C# Wrap）。见 [构建](/docs/guides/build/)、[Editor 与 Player](/docs/guides/editor-vs-player/)。

## 目标平台

| 类别 | 范围 |
|------|------|
| **Editor（开发）** | **Windows x64**、**macOS**（Apple Silicon / Intel） |
| **Player（Il2Cpp）** | 设计覆盖 **Unity / 团结 Il2Cpp 常规支持的全部目标**，包括但不限于：**Win64**、**Android**、**iOS**、**WebGL**、**微信小游戏**、**鸿蒙 / 车机**，以及其它桌面 / 移动 / 小游戏 / 车载等 Il2Cpp 可构建平台 |

非 HostJs 目标在 Install 后把 QuickJS 源码链进 Player。**WebGL Player 的引擎是宿主 JS**，不把 QuickJS 编进 WASM。细则见 [QuickJS 构建](/docs/spec/build/01-QUICKJS/) §5 与 [HostJs](/docs/spec/build/06-HOSTJS/)。

| 目标 | 脚本引擎 |
|------|----------|
| Editor，以及 Win64 / Android / iOS 等非 HostJs Player | QuickJS |
| WebGL Player | 宿主 JS（HostJs） |
| 目标名含 `MiniGame` / `Weixin` / `Douyin` / `TikTok` | 与 WebGL 相同，不安装 QuickJS。模板本身不在本期 |

其它平台问题请提交 [Issue](https://github.com/focus-creative-games/zen-ts/issues)。

语义契约以 [规范文档](/docs/category/spec/) 为准，与实现细节分离。项目阶段见 [项目状态](/docs/getting-started/project-status/)。
