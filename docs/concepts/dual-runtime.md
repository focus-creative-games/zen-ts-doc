---
sidebar_position: 3
title: "CLR 宿主与 JS 后端"
---

# CLR 宿主与 JS 后端

“Editor 与 Player 两条 CLR 执行路径”和“V8 与 HostJs 两种 JS 后端”是两个维度，不能将其合并为两套互操作语义。

```text
JsAppDomain → IJsRuntime
  Editor       → Mono + Emit       → V8 Editor 插件
  Native Player→ IL2CPP + C++      → 静态 V8
  Web Player   → IL2CPP/WASM       → 平台 JS VM
```

Editor 优先使用 Mono 宿主，即使当前构建目标是 WebGL。原生 Player 通过内部调用进入 IL2CPP 实现；HostJs Player 通过桥连接平台 VM。业务使用相同 JsAppDomain、CSharp 和 zents 入口。

## 共享与专用部分

共享部分包含类型解析、绑定计划、重载、Marshal、门面和生命周期契约。引擎专用部分包括模块执行、值句柄、GC 通知、错误转换和微任务。V8 SDK 类型不会流入 CLR 计划。

HostJs 的 JS/WASM 往返是同步调用协议，不是远程 RPC；模块在构建期编译为工厂。Reset 重建 ZenTS 管理的上下文与 generation，不销毁浏览器/小游戏的全局 VM。

## 验证要求

相同 fixture 应在 Mono/IL2CPP 和 V8/HostJs 对照运行。平台能力缺失必须记录为显式跳过，不能以跳过解决本应一致的互操作错误。详见[测试方法](../community/testing.md)。
