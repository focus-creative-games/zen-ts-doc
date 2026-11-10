---
sidebar_position: 16
title: "Pointers and restricted types"
---

# Pointers and restricted types

## 1. Numeric pointers versus tokens

| CLR type | JS form | Arithmetic/call |
|---|---|---|
| IntPtr/UIntPtr/nint/nuint | Pointer-width integral number | Numeric operations subject to range/precision; no default bigint |
| T*/void* | Opaque Pointer token | Pass through only |
| Function pointer | Pointer token | Not JS-callable |

Pointer tokens expose no member tables, memory reads/writes, arithmetic, or arbitrary address calls. Use only within the valid synchronous chain, not later async calls. Null pointers push null consistently.

## 2. Pointer policies

Default and legal C#→JS OpaqueValue are allowed; Object/Table and other policies are not. Pop accepts matching Pointer tokens/null, not numbers, bigint, CLR wrappers, or implicit Opaque conversion. Mismatches throw.

CLR delegates are callable wrappers/functions; function-pointer addresses are not delegates and cannot be called from JS.

## 3. Restricted types

- TypedReference is Opaque by default and accepts only compatible Opaque input; other policies are illegal.
- decimal has no ordinary default by-value support; explicit supported C#→JS Opaque paths are separate.
- ref structs such as Span&lt;T&gt; have no ordinary by-value marshaling; reject unsupported signatures at binding. Controlled borrows do not become persistent objects.
- Nullable values use T representation or null; input null/undefined means no value.
- dynamic is object at CLR signature level.
- Open generic slots are resolved by actual closed arguments before policy validation.

BigInt is only for explicit concrete long/ulong slots and legal byref elements, never a raw address/enum/IntPtr/token shortcut. Unknown byref combinations fail rather than fabricating storage. GetFunction/delegate byref remains supported under its Opaque contract.

## 4. Distinctions

Pointer passes unmanaged addresses without dereference; Opaque permits scoped storage get/set; ByObj/ByVal supports CLR member dispatch. Width, validation, lifetimes, and failure categories agree across Mono/IL2CPP. See [Opaque](04-OPAQUE.md) and [policies](02-MARSHAL-AS.md).
