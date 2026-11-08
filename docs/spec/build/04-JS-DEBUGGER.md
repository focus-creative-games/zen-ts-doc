---
sidebar_position: 4
title: "JS 调试器"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 构建 — JavaScript 调试器

## 1. 目标与现状

Native V8 Editor 目标采用 V8 Inspector；HostJs 目标使用浏览器/小游戏开发者工具及 source map。当前过渡包中的 Editor debugger host 接口仅是接入点，不能当作完整调试器或断点功能已经验收。

不再要求某个 QuickJS 专有调试 API，也不把 EmmyLua 协议移植为 JS 协议。调试不改变重载、Marshal、线程或生命周期语义。

## 2. Native V8

调试默认关闭。开启后由宿主创建 inspector session、传输与主线程消息调度；网络 I/O 可以后台处理，引擎调用回到所属线程。source URL/canonical 模块名与 source map 要稳定对应。

暂停时不得破坏 CLR callback 的错误状态和嵌套帧；断开、结束 Play、Domain Reload 和 Reset 必须清理 session/context 引用。重建域后重新关联 context，不能继续调试旧 generation。

## 3. HostJs

脚本在平台 VM 中，由平台工具观测。保留业务 TS 到 bundle 的 source map；分包仍应有可诊断模块名。不同宿主的暂停、性能工具能力不属于 ZenTS 可统一保证的接口。

HostJs 不另外嵌入 V8 Inspector，也不建立一个与宿主 Promise/微任务系统竞争的调试 VM。

## 4. 设置与边界

Settings 的 debugger 字段只控制宿主调试接入，不能让脚本绕过正常 callback backend。目标设置与当前过渡字段的关系见 [15-SETTINGS.md](../15-SETTINGS.md)。Inspector 传输和完整 source map 验收在 V8/HostJs 对应阶段完成。
