---
sidebar_position: 7
title: "引擎边界与绑定计划"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 构建 — 引擎边界与绑定计划（P1）

## 1. 已实现的边界

P1 将运行中的 native 消费者迁到 `zents::engine`（别名 js），并将 Mono 消费者迁到自有 EngineApi；当前选中的执行适配器仍是 QuickJsTransition。这里说明实际代码，不把后续 V8/HostJs 当成已存在实现。

## 2. Native 接口

`ZenTS~/zents-runtime/engine/EngineApi.h` 只引用标准库。Context/Runtime/Module 为不透明类型，Value 是自有 16 字节 opaque envelope。它是 C++ 进程内接口，不等同 Mono 插件 ABI，也不是 WASM 线协议。

覆盖值分类/转换、字符串/属性/数组、函数回调、host payload、异常、模块、微任务和生命周期。`engine/quickjs/QuickJsEngine.cpp` 是当前实际适配器，不能用简单 SDK typedef 或不兼容函数指针强转取代回调转换。

## 3. 所有权

- 复制 Value 只复制借用 token，不隐式 retain。New/Get/Call/Eval/Dup 返回拥有引用。
- SetProperty、DefinePropertyGetSet、Throw 消耗其值参数，包括失败路径；receiver 是借用。
- callback receiver/argv/captured data 仅在回调期间借用，长期保存须 retain。
- GetIdentity 是保活期间的稳定缓存键，不可解引用；V8 不能返回移动 GC 的不稳定地址。
- GetCompiledModule 为模块专用提取入口，不允许核心自行解释 Value 的指针布局。
- context/runtime/generation 不可混用；异常结果通过 Context 的 pending error 与边界转换处理。

当前 adapter 常见不超过 16 个参数用栈缓冲，较大参数才分配溢出缓冲。它只说明实现，不是永久的参数上限。

## 4. CLR 计划

`binding/BindingPlan.h` 不包含引擎或 libil2cpp SDK 头，只前置声明 CLR 类型。实际 MarshalPlan、MethodPlan、FieldPlan、OverloadPlan、MemberPlan、TypeBindingPlan 提取到此处；执行扩展继承计划并持有 writer/invoker、prototype/type object。

计划不包含 JS 值、context 或引擎 callback。模板参数保留不同执行扩展的类型安全，不另建无人消费的影子元数据。当前计划字段保留旧语义，P3 再迁移 arity/params/重载规则。

## 5. Editor 接口

`Runtime/Mono/Engine` 提供 IMonoEngineApi、IMonoValueApi、IMonoCallbacks、EngineApi 与 JsValue。引擎调用、值生命周期和 callback/error 服务由同一个 backend 实例提供，不允许各自选不同引擎。

P/Invoke、原始 refcount、native gate 和系统符号查找只在 Engine/QuickJs。Mono/Binding/BindingPlan.cs 只存 CLR 类型与方法信息；实际 TypeBinding/MethodClosureTag 继承这些计划。Emit 与 Marshal 通过服务读取值，不直接访问 payload。

## 6. 可重复检查

- `ZenTS~/migration/verify-boundaries.py` 防止 SDK 类型、直接 P/Invoke 和 payload 访问回流核心。
- `verify-contract.py` 独立编译并运行 contract-smoke.cpp，不提供引擎或 CLR SDK include 路径。
- Win64 使用现有导出工程增量编译；Editor 使用批处理 Mono smoke/JS 矩阵验证。

P1 的源码/规范哈希及实际日志记录在嵌入包 migration 目录。通过这些检查证明边界重构保持当前行为，不证明 Native V8/HostJs 或全部目标平台已运行。
