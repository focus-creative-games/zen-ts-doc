---
sidebar_position: 4
title: "Types and declared views"
---

# Types and declared views

CLR type objects, System.Type wrappers, instance wrappers, and plain JS values have different roles.

| Representation | Role |
|---|---|
| `CSharp[assembly][fullName]` | CLR type object |
| `zents.typeof(typeObject)` | System.Type wrapper |
| Public typeArg | Type object, full CLR name, or System.Type |
| GTAP prefix | System.Type wrapper only |
| `zents.types.int32` | CLR name constant |

## Identity and declaration

Reference values default to their declared-type view. A derived runtime object does not automatically expose every derived member. cast can select compatible views; ActualTypeUserData explicitly changes legal reference return views.

Structs default to ByVal copies; boxed structs are ByObj. Nested values, fields, and array writes obey copy/GC rules. CLR relationships still determine interfaces, inheritance, generic constraints, and Nullable compatibility.

## Construction

Use new for constructors, make_generic_type for generic types, and inflate/GTAP for generic methods. Explicit factories create SZArray/mdarray types and instances; nested JS Arrays do not imply multidimensional CLR arrays.

## AOT

Lazy lookup finds existing metadata/code; it does not create missing machine code. Preserve and test closed generics in the actual Player. See the [type specification](../spec/02-TYPE-SYSTEM.md).
