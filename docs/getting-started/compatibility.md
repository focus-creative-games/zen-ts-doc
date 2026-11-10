---
sidebar_position: 3
title: "兼容性与平台范围"
---

# 兼容性与平台范围

## Unity 版本政策

ZenTS 支持 **Unity 2022.3.x LTS 及更高版本的 LTS**，以及基于 2022.3.x LTS 的**团结引擎**。2021.3 和非 LTS 版本不在本产品支持政策内。补丁目录存在某个版本不代表该组合已验收；安装仍须找到匹配补丁并通过实际构建。

## 后端与平台

| 环境 | 后端 | 当前集成与证据 |
|---|---|---|
| Windows x64 Editor | Mono + V8 | 全量回归与 Inspector 验收 |
| macOS ARM64 Editor | Mono + V8 | 全量回归、Inspector 协议验收；重载退出限制见项目状态 |
| macOS x64 Editor | Mono + V8 | 插件已编译；未运行 Intel Editor |
| Win64 Player | IL2CPP + V8 | 全量回归 |
| macOS ARM64 / x64 Player | IL2CPP + V8 | 运行验证通过；x64 在 Rosetta 下执行 |
| Android ARM64 / x64 | IL2CPP + V8 | MuMu 模拟器运行验证通过；ARM64 使用模拟器转译 |
| iOS x64 Simulator | IL2CPP + JITless V8 | 模拟器运行验证通过 |
| iOS ARM64 Device | IL2CPP + JITless V8 | 无签名编译通过，未作真机运行验收 |
| WebGL | IL2CPP/WASM + HostJs | Chrome 实际运行、GC、Reset 与受限宿主验证 |
| 微信小游戏 | IL2CPP/WASM + HostJs | 官方 SDK 转换及开发工具运行通过，未作手机真机验收 |
| 团结引擎 | Editor 使用 V8；原生 Player 使用静态 V8；WebGL/微信使用 HostJs | 已支持；微信目标识别 `WeixinMiniGame`，使用对应构建流程 |

原生平台只提供 V8 路线；没有可用 V8 SDK 的平台不自动获得支持。HostJs 也只涵盖已接入目标，不能由名称含 MiniGame 推断抖音、鸿蒙、车机或其他平台均已支持。

HostJs 当前要求 `Proxy`、`BigInt`、`WeakRef`、`FinalizationRegistry` 等能力；缺少弱引用能力会明确失败。当前为单线程同步桥接，不能把 Worker 当作任意 CLR 同步调用线程。

具体版本、测试计数和历史证据见[项目状态](/docs/getting-started/project-status/)。源码与二进制匹配要求见[构建](/docs/guides/build/)。
