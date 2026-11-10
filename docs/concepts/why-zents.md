---
sidebar_position: 1
title: "选用 ZenTS 前需要了解什么"
---

# 选用 ZenTS 前需要了解什么

ZenTS 适合希望在 Unity 中使用 TypeScript/JavaScript，同时保持统一 CLR 互操作语义的项目。它沿用 ZLua 的绑定计划和 Marshal 设计，而不是把某个 JS 引擎 API 直接暴露给业务。

## 设计收益

- 类型和成员按需绑定，业务不用维护逐类型 Wrap 清单。
- Editor 与 IL2CPP、原生 V8 与 HostJs 使用一致的重载、门面、byref 和生命周期规则。
- 原生平台静态集成官方 V8；WebGL/微信使用平台 VM，不重复嵌入引擎。
- C# 声明、TypeScript 检查、Source Map 和 Editor Inspector 贯通开发流程。
- SDK 安装不修改只读 package，团队可分发完整 SDK 并由项目本地导入。

## 需要承担的约束

原生 V8 SDK 需要对应工具链和平台构建；IL2CPP 仍要求裁剪保留、AOT 泛型和签名桥。iOS 使用 JITless，平台性能不能按桌面 JIT 结果推断。HostJs 需要 WeakRef/FinalizationRegistry 等宿主能力，并预编译模块；不提供任意下载源码后 eval。

JS number 的精度、this、Promise 和 GC 语义也不会消失。业务应显式选择 BigInt、正确管理事件和异步借用，并在目标设备测试。

## 选型证据

当前 Windows/macOS Editor、Win64、WebGL 和微信开发者工具有不同粒度的运行证据，Apple/Android 也有阶段性结果；具体范围和未完成真机覆盖见[平台矩阵](../getting-started/compatibility.md)。没有同场景公开基准时，不以“更快”“更小”作无条件承诺。
