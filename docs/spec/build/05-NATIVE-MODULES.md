---
sidebar_position: 5
title: "原生模块与平台能力"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 构建 — 原生模块与平台能力

## 1. 两类入口

- CLR 能力优先通过普通 C# 互操作暴露，使用同一类型与 Marshal 契约。
- 确需原生 JS 扩展时通过所选 backend 的模块注册接口实现；它不是默认业务脚本加载器。

不把 QuickJS 的 JSModuleDef/js_init_module 签名作为跨引擎 API，也不承诺加载 Node.js addon 或提供 Node.js 标准库。内嵌 V8 不等于内嵌 Node。

## 2. Native V8

扩展链接在原生插件或 Player 中，由适配器在域建立、业务模块求值前注册。扩展值遵守 V8 handle 和线程规则，CLR 指针通过合法 wrapper/Opaque 管理。不能把 v8::Local、原始堆指针或 C++ 异常跨 Mono ABI 返回。

## 3. HostJs 与小游戏

WebGL 通过 JS/WASM import/export 接入能力；微信脚本可访问可用的 wx API。平台适配器处理 bundle、启动/恢复事件和资源就绪，而 CLR 互操作核心保持平台无关。

不要求小游戏实现原生动态库加载。脚本代码发布、分包、远程数据和可执行代码加载各按具体平台能力与发布流程处理，不能把任意远程源码求值写成通用承诺。

## 4. 生命周期

模块实例、事件订阅、定时器及原生资源需要明确所有者。Reset 使旧 generation 的 ZenTS callback 失效；纳入域管理的资源应自动释放，业务自行管理的资源应主动清理。双 GC 不会自动收集所有 CLR↔JS 强引用环。

## 5. 配置范围

原生模块注册不能作为运行时加载 Alias/MarshalAs/Extension XML 的旁路。XML 仅对 AOT 程序集在初始化/Generate 阶段有效；热更新程序集使用 Attribute。
