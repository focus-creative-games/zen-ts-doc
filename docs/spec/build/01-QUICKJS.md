---
sidebar_position: 1
title: "已移除的 QuickJS"
---

# 已移除的 QuickJS

QuickJS 支持已经彻底移除：没有引擎源码、适配器、插件、配置开关、构建分支或发布回退。本路由保留用于旧链接和迁移，不提供安装/编译步骤。

## 当前替代

- Windows/macOS Editor：官方 V8 静态链接的 Editor 插件。
- Win64/macOS/Android：静态 V8 Player；iOS：JITless V8。
- WebGL/微信：平台 JS VM，不在 WASM 再集成引擎。

原生不支持的平台明确不支持，不回退旧引擎。旧 QuickJS API、JSValue 布局及引用计数不是 ZenTS CLR 契约。见 [V8](02-V8.md)、[HostJs](06-HOSTJS.md)及[迁移](../12-MIGRATION-ADAPTORS.md)。
