---
sidebar_position: 4
title: "类型与声明门面"
---

# 类型与声明门面

ZenTS 区分 CLR 类型对象、System.Type wrapper、实例 wrapper 和普通 JS 值。它们并不因为“都能表示一个类型”就可以在所有位置互换。

| 形态 | 用途 |
|---|---|
| `CSharp[assembly][fullName]` | 获取 CLR 类型对象 |
| `zents.typeof(typeObject)` | 获取 System.Type wrapper |
| 公共 typeArg | 可接受类型对象、完整 CLR 名或 System.Type |
| GTAP 前缀 | 仅接受 System.Type wrapper |
| `zents.types.int32` 等 | CLR 名称字符串常量 |

## 对象身份和声明类型

引用对象默认按声明类型建立门面。实际对象是派生类型不代表脚本自动拥有所有派生成员；合法 `cast` 可转换门面。显式 ActualTypeUserData 仅用于允许的引用返回槽位。

struct 默认 ByVal 副本，装箱 struct 属于 ByObj。字段、数组元素和嵌套值的写回遵守复制与 GC 规则。接口、继承、泛型约束和可空类型仍由 CLR 类型关系决定。

## 集合与构造

构造使用 `new Type(...)`。泛型类型通过 make_generic_type 闭合，方法泛型通过 inflate 或 GTAP 闭合。SZArray 与 mdarray 类型/对象由明确工厂创建，不把嵌套 JS Array 当作多维 CLR 数组。

## AOT 边界

懒解析只寻找已有元数据和可执行代码。Editor 能闭合泛型不保证 Player 已生成对应代码；正确保留并运行测试才构成发布证据。详见[类型系统规范](../spec/02-TYPE-SYSTEM.md)。
