---
sidebar_position: 1
title: "Marshaling specification"
---

# Marshaling specification

Marshaling is defined by CLR slot type, direction, byref role, and policy. Mono/IL2CPP and V8/HostJs must expose the same results.

| Page | Contract |
|---|---|
| [Defaults](01-OVERVIEW.md) | null/undefined, number, explicit BigInt |
| [Policies](02-MARSHAL-AS.md) | Legal slots, Members, AOT XML |
| [byref](03-BYREF.md) | ref/in inputs, zero-input out tuples |
| [Opaque](04-OPAQUE.md) | Borrow scopes and readonly storage |
| [Structs](05-STRUCT.md) | Copies, boxing, Table/UnpackedValues |
| [References](06-CLASS.md) | Identity and views |
| [Arrays](07-ARRAY.md) | CLR arrays, copies, Uint8Array |
| [Enums](08-ENUM.md) | Underlying numbers and boxing |
| [Functions](09-FUNCTION.md) | Delegates, calls, reference ownership |
| [Pointers](10-POINTER.md) | Tokens and restricted types |

Int64/UInt64 default to number, never automatic bigint. XML applies only to AOT assemblies, without runtime registration, hot reload, or Reload.
