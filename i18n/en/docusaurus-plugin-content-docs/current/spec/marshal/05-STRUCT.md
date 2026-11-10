---
sidebar_position: 11
title: "Struct marshaling"
---

# Struct marshaling

## 1. Representations

Default C#→JS by-value struct output is a **ByVal copy**. Byref or legal explicit OpaqueValue uses a call-scoped borrow. JS→CLR defaults accept compatible CLR value/boxed wrappers or valid supported Opaque, not plain objects/multiple inputs without policies.

| Form | Members | Lifetime |
|---|---|---|
| Opaque | get/set/to_user_data only | Creating synchronous call |
| ByVal | Struct ByVal IEO | JS wrapper/registry |
| ByObj | Boxed CLR value, ByObj IEO | CLR GC root |

new T(...) and T._default() create ByVal. to_user_data copies a supported borrow. box creates ByObj; unbox requires a boxed value, not ByVal, and extracts a value/default scalar.

## 2. Receiver domains

ByVal methods declared by the struct use copy payload storage; methods declared by class bases require boxing. ByObj struct methods use unboxed payload; class methods use the boxed object. Do not attach/use a ByObj closure with ByVal storage or vice versa. Static members remain on type objects.

## 3. Inputs and writeback

Exact ByVal ref storage can be modified; in grants no writes. T→Nullable&lt;T&gt; uses temporary Nullable. Compatible Opaque must remain valid. Other legal inputs use temporary storage without JS-local rebinding. JS→CLR out has no input: allocate default(T), then return it in the out tuple.

Default does not accept `{ X: 1 }` or N scalars as a struct. Table/UnpackedValues opt in explicitly.

## 4. Table and UnpackedValues

```csharp
[JsMarshalAs(JsMarshalType.Table, Members = new[] { "X", "Y" })]
public struct Vector2 { public float X; public float Y; }
```

Members may name supported public fields/properties. Table is one object, with null/undefined accepted as Nullable no-value according to input rules; output no-value is null. Optional `?` Table keys use own-property existence, not merely undefined.

UnpackedValues parameters consume N inputs. Return/out slots are N-element arrays, nested in outer out tuples, never flattened. No `?` suffix exists for UnpackedValues. Nullable does not support UnpackedValues.

## 5. GC and policies

Blittable copies can use raw-copy storage where appropriate. Reference-containing copies need CLR-visible roots; heap/reference-array writes need barriers. Payload release must match registration. An unmanaged buffer alone does not root references.

Members may have legal concrete BigInt policies, but a whole struct cannot be BigInt. ActualTypeUserData is not a value-return policy. Enums have no ordinary struct constructor and default to number.

Opaque expires on all return/error paths; do not retain borrowed addresses. Mono/IL2CPP and engines must agree on copy, receiver, Table, UnpackedValues, optional keys, byref writeback, and failures. See [policies](02-MARSHAL-AS.md) and [types](../02-TYPE-SYSTEM.md).
