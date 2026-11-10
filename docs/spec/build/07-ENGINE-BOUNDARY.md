---
sidebar_position: 7
title: "引擎边界与绑定计划"
---

# 引擎边界与绑定计划

## 1. 当前边界

Native 执行层使用 `zents::engine`，Editor 使用自有 managed EngineApi。当前适配器为 V8 与 HostJs，没有过渡引擎分支。共享的是 CLR 规则和调用计划，不是 SDK typedef 或完整 C API 仿制。

## 2. Native EngineApi

`ZenTS~/zents-runtime/engine/EngineApi.h` 只引用标准库，Context/Runtime/Module 不透明，Value 是自有 16 字节 envelope。它是内部 C++ 接口；Mono 插件 ABI 和 HostJs 二进制协议分别适配，不能因尺寸相同直接假定兼容。

覆盖分类/转换、字符串/属性/数组、callback、host payload、异常、模块、微任务和生命周期。实现分别为 `engine/v8/V8Engine.cpp`、`engine/host/HostEngine.cpp`；CLR 内核不解释 V8 handle 或平台 JS token。

## 3. 值所有权

- 复制 Value 只复制借用 token，不隐式 retain；New/Get/Call/Eval/Dup 类入口按 API 约定返回拥有引用。
- SetProperty、DefinePropertyGetSet、Throw 消耗对应值参数，包括失败路径；receiver 借用。
- callback 的 receiver、argv 和 captured data 仅在当前回调借用，长期保存须 retain。
- GetIdentity 是保活期间的缓存键，不可解引用，不得是移动 GC 后失效的裸地址。
- GetCompiledModule 是模块提取入口，不能让核心自行解释 Value 指针。
- context/runtime/generation 不可混用；失败通过 pending error 和边界转换处理。

栈缓冲和溢出缓冲是内部优化，不是永久参数数目上限。HostJs 内存增长后刷新 view；重入不能共用单一参数/错误缓冲。

## 4. CLR BindingPlan

`binding/BindingPlan.h` 不包含引擎或 libil2cpp SDK 头。MarshalPlan、MethodPlan、FieldPlan、OverloadPlan、MemberPlan、TypeBindingPlan 记录 CLR 类型、候选、默认值、arity、byref/out、params 和策略；不含 JS 值或 context。

执行扩展继承计划并保存 writer/invoker、prototype/type object，避免独立的无人消费“影子元数据”。Mono 的 `Binding/BindingPlan.cs` 由实际绑定消费，Emit/Marshal 通过同一引擎服务访问值。

## 5. 检查与回归

引擎 SDK 类型、P/Invoke 和 payload 访问应限定在适配层。接口静态检查不能代替真实平台运行。

行为修改需要跨 Mono/IL2CPP、V8/HostJs 比较重载、门面、值复制、异常、GC 和 Reset。平台证据见[对齐状态](../03-ALIGNMENT.md)。
