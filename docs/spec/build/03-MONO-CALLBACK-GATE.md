---
sidebar_position: 3
title: "Mono 回调与异常边界"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 构建 — Mono 回调与异常边界

## 1. 引擎无关要求

所有 Editor JS→C# callback 经过 EngineApi 选择的 callbacks backend。托管异常不得穿过 unmanaged callback ABI；原生引擎异常不能跨 reverse-P/Invoke 或跳过托管清理。错误状态和嵌套调用分帧保存，不能用一份全局 pending-error 覆盖外层调用。

不要把 Lua 的 longjmp 规则机械套用到 JavaScript 引擎。QuickJS 的 JS_Throw 是登记待处理异常并返回异常标记，不应被描述为依赖 Lua 式 longjmp；V8 的错误设置也不等同 C++ throw。

## 2. P1 的当前过渡适配器

QuickJS 适配器保留 zents_mono_gate，使用 pointer-output callback ABI，避免依赖 Mono 与 MSVC 对 16 字节结构按值返回的兼容性。

托管回调捕获失败，登记待处理错误并返回私有 sentinel；native gate 在托管返回后取出错误、设置引擎异常，再返回异常状态。没有 QuickJS “值栈顶”公共 API，也不应伪造 JS_GetStackTop 作为协议。

当前私有 sentinel tag 为 0xFFFF5A12，仅对过渡插件 ABI 有意义，不是 V8/HostJs 的公共值类型。初始化、native callback 注册、函数指针保活和 Reset 归同一个适配器负责。

## 3. Native V8 目标

Mono callbacks 返回明确状态及结果；native V8 wrapper 在安全边界调用错误设置 API。业务 Emit/Marshal 不得直接 DllImport 引擎、导出裸委托给引擎或操纵原生 refcount。

复用的是异常与资源语义，不是 QuickJS 函数指针签名或 sentinel 布局。V8 插件 ABI 在 P2 实现并独立验收。

## 4. 嵌套与日志

JS→C#→JS→C# 的参数、pending exception、临时返回值和 Opaque scope 独立。callback 返回前不得误释放其捕获的 delegate，失败路径也必须恢复外层状态。若日志或调试堆栈抓取需延迟，使用统一队列，不改变 JS try/catch 能捕获错误的契约。

## 5. 实现位置

| 位置 | 职责 |
|---|---|
| Runtime/Mono/Engine/EngineCallbacks.cs | 自有 callback/error 契约和门面 |
| Runtime/Mono/Engine/QuickJs/JsCallbackGate.cs | 当前 native gate 适配实现 |
| Runtime/Mono/Engine/QuickJs/QuickJsCallbackBackend.cs | 当前 callback backend |
| ZenTS~/mono-native | 过渡原生 gate 源码 |

原 Utils/JsCallbackGate 路径已移到适配器。Il2Cpp 不使用 Mono gate，但仍受统一异常边界约束。

## 6. 验收

正常 callback、managed 失败、JS 失败、嵌套失败、GC/Reset 和未初始化注册都必须给出可诊断结果，不能崩溃、静默吞错或泄漏 delegate。当前 Windows Editor 的通过不代表 macOS V8 或移动端 ABI 已通过。
