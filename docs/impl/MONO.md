---
sidebar_position: 1
title: "Editor Mono 与 V8"
---

# Editor Mono 与 V8

Editor 通过 `JsMonoAppDomain` 实现 IJsRuntime，以反射和 Expression Emit 执行 CLR 调用，JS 在原生 V8 插件中运行。当前没有 QuickJS 执行分支。

## 绑定与引擎隔离

`Runtime/Mono/Binding` 保存 CLR 计划，EngineApi 提供值、函数、回调、异常和模块服务。`Runtime/Mono/Engine/V8` 封装 P/Invoke 与 native 句柄，核心 Marshal/Emit 不解释 SDK payload。

native 对应 `engine/v8/V8Mono.cpp`。V8 由官方固定源码构建静态库，再静态链接到 Editor DLL/dylib。插件从 Library SDK 自动生成到 Assets，不修改 PackageCache。

## 回调异常边界

Mono callback 捕获托管失败，归还受控状态；native gate 在托管返回后设置 JS 异常。pointer-output ABI 避免依赖 16 字节结构按值返回的跨编译器约定。资源清理和引用释放必须覆盖异常路径，不能让 CLR 异常直接跨 native ABI 展开。

## 生命周期与 Inspector

持久 JS 函数按域代次持有并释放，主线程入口拒绝 worker 调用。Reset、Domain Reload 和 Editor 退出清理 runtime、Inspector target 和监听端口。Inspector 在 owner thread 处理 V8 操作，后台仅负责传输；暂停循环不执行游戏 Update。

macOS arm64 的 Inspector 协议测试通过，但实际 Domain Reload 验收存在 Unity 退出超时，详见[状态](../getting-started/project-status.md)，不能据资源清理断言将进程级结果改记为通过。

修改 Editor native 实现后重新构建适配器、导入 SDK，并重启已加载旧插件的 Editor。源码行为调整还需同时运行 Player 回归。
