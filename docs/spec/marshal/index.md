---
sidebar_position: 1
title: "Marshal 规范"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# Marshal 规范

本目录定义 CLR 与 JavaScript 双向值转换。Native V8/HostJs、Mono/Il2Cpp 使用同一契约；实现状态见 [对齐状态](../03-ALIGNMENT.md)。

| 分册 | 内容 |
|---|---|
| [默认矩阵](./01-OVERVIEW.md) | null/undefined、默认 number、显式 BigInt |
| [MarshalAs](./02-MARSHAL-AS.md) | 策略、合法位置/类型、泛型、AOT XML |
| [byref](./03-BYREF.md) | ref/in 输入与 out 零输入/结果元组 |
| [Opaque](./04-OPAQUE.md) | 作用域、只读性及元素策略 |
| [struct](./05-STRUCT.md) | ByVal/ByObj、复制与引用字段 |
| [class/interface](./06-CLASS.md) | 声明门面与 ActualTypeUserData |
| [数组](./07-ARRAY.md) | CLR 数组、JS Array、Bytes 与 params |
| [enum](./08-ENUM.md) | 默认 number 与 box |
| [函数](./09-FUNCTION.md) | 双向 delegate、身份与 ABI |
| [指针](./10-POINTER.md) | Pointer、IntPtr 和受限类型 |

Int64/UInt64 默认 number，不是默认 bigint。BigInt 仅由合法槽位显式 opt-in；XML 仅用于 AOT 程序集，运行时注册、热更新和 Reload 均不支持。
