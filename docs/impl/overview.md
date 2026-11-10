---
sidebar_position: 0
title: "实现导航"
---

# 实现导航

本组文档说明代码职责与修改入口。公开行为以 [spec](../spec/00-OVERVIEW.md) 为准；文件存在或编译成功不能单独证明某个平台已验收。

| 层 | 主要目录 |
|---|---|
| 公共 C# 门面 | Runtime/Common |
| Editor Mono 执行 | Runtime/Mono |
| 原生/HostJs Player 门面 | Runtime/Il2Cpp、Runtime/HostJs |
| CLR native 内核 | ZenTS~/zents-runtime 的 binding、bridge、marshal、mt、jvm |
| 引擎接口和适配器 | engine/EngineApi.h、engine/v8、engine/host |
| HostJs JS/WASM 导入 | Plugins/WebGL/HostEngine.jslib |
| 标准脚本门面 | ZenTS~/jslib |
| SDK、安装和生成 | ZenTS~/v8、Editor 的 Native SDK/安装/构建处理器 |

[Mono 实现](MONO.md)解释反射、Emit 与 native callback；[IL2CPP 实现](IL2CPP.md)解释静态桥、平台链接和 HostJs 传输。调整规则时应同时检查声明生成和跨宿主测试，不能只改一个执行分支。
