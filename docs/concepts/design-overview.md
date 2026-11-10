---
sidebar_position: 2
title: "设计总览"
---

# 设计总览

ZenTS 将 ZLua 的 CLR 互操作设计移植到 JavaScript/TypeScript：共享绑定规则、签名桥和配置模型，只为 JS 语言及宿主能力作必要适配。

## 三个独立维度

| 维度 | 职责 |
|---|---|
| 语言门面 | CSharp、csharp:、zents、JS this、null/undefined、模块 |
| CLR 执行 | Editor Mono + Emit；Player IL2CPP + 静态桥 |
| JS 引擎 | 原生 V8；WebGL/微信使用平台 VM |

CLR 绑定计划记录类型、成员、重载、默认值和 Marshal，不携带引擎 SDK 值。适配层负责函数、对象、异常、模块、微任务、GC 引用和生命周期。这使 HostJs 复用互操作内核，而不是另写一套反射绑定。

## 绑定与调用

首次访问类型时建立绑定；继承普通成员扁平化，短名冻结，全 CLR 签名键在受限 miss 路径按需解析。成员调用先验证 receiver、候选和 Marshal，再使用 CLR invoker/签名桥执行。

不要求业务逐类型 Wrap 白名单，但依赖元数据和 AOT 代码保留。优化集中在共享计划与调用路径，不能改动重载选择、声明门面或值复制语义。

## 配置与宿主

Alias、MarshalAs、Extension 采用 Attribute 与 AOT XML。XML 是构建/会话配置，不是热更新 API。原生 V8 静态库与适配器作为 SDK 安装到 Library；Editor 插件自动生成到 Assets，兼容只读 UPM。

HostJs 不内嵌另一套解释器，以预编译模块工厂和二进制调用协议连接 WASM。平台没有的能力不能由“兼容 JavaScript”推定存在。详见[规范总览](../spec/00-OVERVIEW.md)。
