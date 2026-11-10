---
sidebar_position: 3
title: "Mono 回调与异常边界"
---

# Mono 回调与异常边界

## 1. 当前执行路径

Editor 使用原生 V8 插件，托管入口位于 `Runtime/Mono/Engine/V8`，native gate 位于 `engine/v8/V8Mono.cpp`。Mono EngineApi 的值、回调与错误服务必须来自同一 backend，不能各自选择引擎。

## 2. ABI

callback 使用 pointer-output 返回值协议，避免 Mono 与不同原生编译器对 16 字节值按值返回约定的差异。receiver/argv 在 callback 期间借用，长期持有必须显式复制/retain；callback 函数指针与数据需要正确保活。

私有失败标记仅属于插件 ABI，不是公开 Value 布局或通用异常对象。不得用不兼容函数指针强转代替适配，不得让 CLR 代码解释 V8 payload。

## 3. 异常与重入

托管回调捕获失败并登记受控错误状态。native gate 在托管返回后取出错误，设置 JS 异常并返回失败。CLR 异常不得穿过 unmanaged callback ABI 展开；引擎错误也不能跳过托管清理帧。

每层嵌套调用拥有独立参数、Opaque 和错误帧，内层失败不得覆盖外层状态。成功、失败及调试暂停/断开都必须正确释放临时值与根。错误设置不是 Lua longjmp 或任意跨边界 C++ throw。

## 4. 验证

覆盖普通 callback、CLR 抛错、JS catch、嵌套 C#→JS→C#、Unicode 错误、Opaque 失效、Reset 和 Domain Reload。Inspector 暂停时只处理协议，不运行 gameplay update；断开后恢复原调用并保持资源有效到返回。

平台编译与运行结果单独记录，不能由 Win64 ABI 推定 ARM64 或 WASM 兼容。见[调试规范](04-JS-DEBUGGER.md)与[生命周期](../10-LIFETIME.md)。
