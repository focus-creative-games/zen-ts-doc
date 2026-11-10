---
sidebar_position: 4
title: "JS 调试器"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# 构建 — JavaScript 调试器

## 1. 目标与现状

Native V8 Editor 已内置官方 V8 Inspector：包括 loopback HTTP/WebSocket 发现、断点、单步、表达式、异常暂停与 TS source map。空 debugger host override 使用内置实现；保留 `IZentsJsDebuggerHost` 作为扩展入口。HostJs 继续使用浏览器/小游戏开发者工具及 source map。具体平台范围见[调试指南](../../guides/js-debugger.md)。

不再要求某个 QuickJS 专有调试 API，也不把 EmmyLua 协议移植为 JS 协议。调试不改变重载、Marshal、线程或生命周期语义。

## 2. Native V8

调试默认关闭，默认端口 9230，仅监听 IPv4 loopback。网络 I/O 在后台线程处理，V8 Inspector 派发与暂停循环在 isolate 所属线程运行。后台线程只通过线程安全的 RequestInterrupt 请求所属线程处理调试协议，不执行脚本或 Unity update。支持 CPU 密集脚本中的实时暂停。

脚本 canonical 名映射到同端口 `/source/out/<module>.js`，同一服务提供项目 `TsProject` 内的 JS/TS/map 文件。第一行业务断点可通过 Wait for attach 等待 `Runtime.runIfWaitingForDebugger`；普通运行允许稍后附加。

暂停时不得破坏 CLR callback 的错误状态和嵌套帧。客户端在业务脚本或 Inspector 自身求值暂停期间断开时恢复执行；正在派发的连接保留到调用返回，旧响应不进入新连接。

客户端断开时释放该连接的会话及远程对象引用，监听器继续用于重新附加。结束 Play、Domain Reload、Reset 和退出 Editor 时停止监听与传输线程，并释放 Inspector/context 引用。每代创建新的发现目标 ID，端口可以复用；客户端重连后重新设置断点，不继续调试旧 generation。

## 3. HostJs

脚本在平台 VM 中，由平台工具观测。保留业务 TS 到 bundle 的 source map；分包仍应有可诊断模块名。不同宿主的暂停、性能工具能力不属于 ZenTS 可统一保证的接口。

HostJs 不另外嵌入 V8 Inspector，也不建立一个与宿主 Promise/微任务系统竞争的调试 VM。

## 4. 设置与边界

Settings 的 debugger 字段只控制宿主调试接入，不能让脚本绕过正常 callback backend。当前设置及生效时机见 [15-SETTINGS.md](../15-SETTINGS.md)。内置 host 已提供 Inspector 传输和 source map 实际协议验收；客户端配置示例与验收入口见 package 的 `ZenTS~/debugger/README.md`。SDK 更新后需重编适配层并导入，已加载的 Editor 插件通过重启 Editor 激活；构建产物继续保存在项目 Library/Assets，不能回写只读 PackageCache。
