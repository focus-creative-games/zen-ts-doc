---
sidebar_position: 18
title: "Explicit marshaling policies"
---

# Explicit marshaling policies

Use JsMarshalAs on legal CLR slots when default conversion is insufficient. A policy belongs to the CLR signature; it is not a tag that bypasses validation on arbitrary JS values.

## 64-bit integers

Int64/UInt64 **default to number**, which can lose precision outside JavaScript's safe-integer range. Opt in to exact BigInt:

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

BigInt applies only to concrete long/ulong slots and legal byref elements, not enums, IntPtr, object, or whole long[] arrays.

## Policies

| Policy | Purpose |
|---|---|
| Default / Object | Default or explicit CLR wrapper representation, validated by type |
| Bytes | byte[] ↔ copied Uint8Array |
| OpaqueValue | Borrowed C#→JS call-scoped handle |
| Table | Struct fields/properties named by Members |
| UnpackedValues | Positional struct members |
| ActualTypeUserData | Runtime-type view for legal reference return slots |
| BigInt | Explicit Int64/UInt64 bigint |

ActualTypeUserData is illegal on parameters, fields, types, declared string returns, or structs. Table uses e.g. `Members = new[] { "X", "Y" }`; optional input keys may end in `?`, unlike UnpackedValues.

## Configuration lifetime

Attributes support legal parameter, return, field, property, and nongeneric class/struct positions. Generic member policies are validated after closing. AOT XML is not hot-reloadable; regenerate session/build tables after changes.

Legality, duplicate rules, and precedence are strict. An enum value existing does not make it applicable to every type. See [MarshalAs](../spec/marshal/02-MARSHAL-AS.md).
