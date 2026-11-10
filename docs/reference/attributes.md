---
sidebar_position: 3
title: "特性与配置入口"
---

# 特性与配置入口

## JsAlias

给受支持成员指定绑定短名，原 CLR 全签名访问仍保留。绑定后短名冻结，XML 不能在运行时追加别名。参见[别名指南](../guides/js-alias.md)。

## JsMarshalAs

```csharp
[return: ZenTS.JsMarshalAs(ZenTS.JsMarshalType.BigInt)]
public static long GetId() => 9007199254740993L;
```

策略枚举依次为 Default、Object、Bytes、OpaqueValue、UnpackedValues、Table、ActualTypeUserData、BigInt。合法应用位置为参数、返回值、字段、属性、class/struct，且每种策略另有类型约束；不是所有枚举都能用于所有位置。

Table/UnpackedValues 使用 `Members` 指定 CLR 字段或属性。Table 输入可选键允许 `?`，UnpackedValues 不允许。类型级策略仅用于支持的非泛型 class/struct；泛型成员在闭合后校验。

ActualTypeUserData 仅合法引用返回槽位；BigInt 仅具体 long/ulong 槽位。完整校验、回退与优先级见[规范](../spec/marshal/02-MARSHAL-AS.md)。

## JsExtension

```csharp
[ZenTS.JsExtension(typeof(CounterExtensions))]
public sealed class Counter { }
```

标在被扩展类型上，指定扩展类；不是标记扩展类的自动全局扫描开关。可重复配置，仍需通过 self 类型、泛型及候选竞争规则。

## AOT XML

| 设置字段 | 根元素 |
|---|---|
| marshalAsXmlPaths | ZenTSMarshalAs |
| jsAliasXmlPaths | JsAlias |
| jsExtensionXmlPaths | JsExtensions |

仅 AOT 程序集使用 XML，热更新程序集使用 Attribute。Editor 初始化建立快照，Player Generate 烘焙表。没有 XML 热更新、注册或 Reload；同槽重复配置报错，Attribute 优先于合法 XML。
