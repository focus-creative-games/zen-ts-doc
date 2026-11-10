---
sidebar_position: 2
title: "IL2CPP、静态 V8 与 HostJs"
---

# IL2CPP、静态 V8 与 HostJs

IL2CPP Player 使用安装到项目本地工具链的 ZenTS C++ 内核。元数据定位、绑定计划、重载和 Marshal 复用，执行依赖已有 CLR invoker 与生成签名桥，不在运行时生成 native 代码。

## 调用路径

C# 门面通过内部调用进入运行时；JS 成员调用解析 receiver 与候选，按 MarshalPlan 准备存储，再调用 CLR 方法。字段、数组和含引用 struct 写回必须使用正确的 GC 根与 write barrier。普通函数指针、闭合 delegate 和 fully shared generic delegate 的 ABI 不能混同。

`binding/BindingPlan.h` 只包含引擎无关的 CLR 计划；执行扩展持有 invoker、writer 和引擎对象。`engine/EngineApi.h` 通过不透明句柄隔离 V8/HostJs。

## Native V8

Win64/macOS/Android 静态链接匹配 ABI 的官方 V8 与适配器。iOS 使用 JITless，库复制进 Xcode 导出。SDK 来自项目 Library，并由来源、配置、适配源码及文件哈希校验；Player 不把 Editor 动态插件当运行时依赖。

## HostJs

`engine/host/HostEngine.cpp` 与 `Plugins/WebGL/HostEngine.jslib` 通过同步二进制值协议连接平台 VM。JS handle 和 CLR 根双向管理，generation 拒绝旧值；FinalizationRegistry 入队、Unity 帧泵释放根。

模块与门面在构建期变为静态工厂，不使用运行时 eval/new Function。内存增长后刷新 WASM 视图，UTF-8 处理覆盖零字符、Unicode 和缺 TextDecoder 的宿主。微信转换后的源码身份受保护，匹配失败不能退回仅按模块名加载。

## 迭代与验证

仅 C++ 改动可复用 Win64 导出 VS 工程增量编译；C# 类型/fixture 或生成输入变化需重新生成并导出。实际验证包含闭合泛型、out/ref、含引用 struct、delegate、异常、宿主 GC 和 Reset，而不是只看可执行文件启动。详见[测试](../community/testing.md)。
