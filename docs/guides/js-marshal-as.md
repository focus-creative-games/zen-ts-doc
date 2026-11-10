---
sidebar_position: 18
title: "显式 Marshal 策略"
---

# 显式 Marshal 策略

默认转换不足以表达业务边界时，在合法槽位使用 `JsMarshalAs`。策略是 CLR 签名的一部分，不能给任意 JS 值贴标签后绕过验证。

## 64 位整数

Int64/UInt64 **默认 number**，可能丢失超过 JS 安全整数范围的精度。需要完整范围时显式选择 BigInt：

```csharp
using ZenTS;
public static class Ids
{
    [return: JsMarshalAs(JsMarshalType.BigInt)]
    public static long Echo([JsMarshalAs(JsMarshalType.BigInt)] long value) => value;
}
```

```javascript
const Ids = CSharp['Assembly-CSharp']['Ids'];
Ids.Echo(9007199254740993n);
```

BigInt 仅适用具体 long/ulong 槽位及合法 byref 元素，不自动扩展到 enum、IntPtr、object 或整个 long[]。

## 策略选择

| 策略 | 主要用途 |
|---|---|
| Default / Object | 默认表现或显式对象表现，按目标类型验证 |
| Bytes | byte[] 与复制 Uint8Array |
| OpaqueValue | C#→JS 调用期借用句柄 |
| Table | 合法 struct 按 Members 映射字段/属性 |
| UnpackedValues | 合法 struct 按 Members 映射位置值 |
| ActualTypeUserData | 合法引用类型返回槽按实际类型建立门面 |
| BigInt | 具体 Int64/UInt64 显式 bigint |

ActualTypeUserData 不适用于参数、字段、类型、string 声明返回或 struct；它不是任意槽位的“动态类型”开关。Table 可用 `Members = new[] { "X", "Y" }` 指定成员；可选 Table 输入键加 `?`，UnpackedValues 不允许。

## 配置有效期

Attribute 可用于支持的参数、返回值、字段、属性及非泛型 class/struct；泛型成员规则要在闭合后验证。三类 AOT XML 配置不支持热更新，修改后重新建立 Editor 会话和 Player 生成表。

非法策略、重复配置及 Attribute/XML 优先级有严格规则。不要只根据枚举值存在就认为它适用于任意类型。详见[MarshalAs 规范](../spec/marshal/02-MARSHAL-AS.md)。
