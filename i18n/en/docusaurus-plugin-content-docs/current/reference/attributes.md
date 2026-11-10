---
sidebar_position: 3
title: "Attributes and configuration"
---

# Attributes and configuration

## JsAlias

Selects supported members' short names at binding time; original CLR full signatures remain accessible. Names freeze after binding. See [aliases](../guides/js-alias.md).

## JsMarshalAs

```csharp
[return: ZenTS.JsMarshalAs(ZenTS.JsMarshalType.BigInt)]
public static long GetId() => 9007199254740993L;
```

Policies are Default, Object, Bytes, OpaqueValue, UnpackedValues, Table, ActualTypeUserData, and BigInt. Parameters, returns, fields, properties, classes, and structs have position/type restrictions; not every policy applies everywhere.

Table/UnpackedValues use Members for CLR field/property names. Optional Table input keys may end in `?`; UnpackedValues forbids it. Type-level policies apply only to legal nongeneric class/struct definitions; generic members validate after closing.

ActualTypeUserData is restricted to legal reference return slots; BigInt to concrete long/ulong slots. See [MarshalAs](../spec/marshal/02-MARSHAL-AS.md).

## JsExtension

```csharp
[ZenTS.JsExtension(typeof(CounterExtensions))]
public sealed class Counter { }
```

Place it on the extended type, naming extension classes. Multiple attributes are allowed, subject to self-type and candidate rules. It does not enable global scanning.

## AOT XML

| Setting | Root |
|---|---|
| marshalAsXmlPaths | ZenTSMarshalAs |
| jsAliasXmlPaths | JsAlias |
| jsExtensionXmlPaths | JsExtensions |

XML applies only to AOT assemblies. Hot-update assemblies use attributes. Editor initialization snapshots configuration; Player generation bakes tables. No runtime registration, XML hot reload, or Reload exists. Duplicate slots fail; attributes precede valid XML.
