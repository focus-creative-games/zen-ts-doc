---
sidebar_position: 1
slug: /intro
title: "ZenTS 介绍"
---

# ZenTS 介绍

ZenTS 是面向 Unity / 团结引擎的 JavaScript / TypeScript 脚本方案，沿用 ZLua 的 CLR 互操作设计，并针对 JavaScript 的 `this`、`undefined`、BigInt、模块与 GC 作适配。

## 执行模型

| 场景 | CLR 宿主 | JavaScript 引擎 |
|---|---|---|
| Windows / macOS Editor | Mono + Expression Emit | 原生 V8 |
| Win64 / macOS / Android Player | IL2CPP + C++ 互操作内核 | 静态链接的原生 V8 |
| iOS Player | IL2CPP + C++ 互操作内核 | JITless V8 |
| WebGL / 已适配的微信小游戏 | IL2CPP / WASM | 平台已有 JS VM（HostJs） |

当前没有 QuickJS 后端或回退。V8 从官方原始源码构建为静态 SDK，再链接适配库与 Editor 插件；没有嵌入 Node.js。支持范围与实际设备验收是两回事，见[兼容性](/docs/getting-started/compatibility/)和[项目状态](/docs/getting-started/project-status/)。

## 核心能力

- `CSharp[assembly][fullName]` 和 `csharp:` 模块按需绑定类型，不要求逐类型 C# Wrap 白名单。
- `JsAppDomain.GetFunction<T>` 提供 C#→JS 调用；方法、构造、泛型、Alias、扩展方法使用明确的匹配规则。
- 支持 struct、Nullable、数组、委托、事件、ref/in/out 与显式 Marshal 策略。Int64/UInt64 默认 `number`，精确通道显式使用 `JsMarshalType.BigInt`。
- HostJs 复用 CLR 绑定与封送内核，业务代码在宿主 VM 执行；模块工厂在构建期生成。
- Git URL / 只读 PackageCache 安装、项目级 SDK、TypeScript 声明与 emit、Editor V8 Inspector 已接入。

“按需绑定”不等于免安装或免构建配置：Player 需要 IL2CPP 集成、Generate、AOT 保留和对应平台 SDK。

从[安装](/docs/getting-started/installation/)和[快速开始](/docs/getting-started/quick-start/)开始；行为以[规范](/docs/spec/00-OVERVIEW/)为准。跨方案比较见[设计取舍](/docs/compare/FEATURES/)，测试证据见[测试与验收](/docs/community/testing/)。
