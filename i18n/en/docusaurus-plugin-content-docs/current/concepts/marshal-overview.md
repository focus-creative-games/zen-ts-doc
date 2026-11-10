---
sidebar_position: 5
title: "Marshaling model"
---

# Marshaling model

Marshaling depends on CLR slot type, direction, byref role, and explicit policy, rather than a universal JS-to-object conversion.

| CLR/scenario | Representation |
|---|---|
| bool | Strict boolean, no truthiness |
| Integers | Finite, integral, in-range number |
| Int64/UInt64 | Default number; explicit BigInt slots use bigint |
| null / void | null / undefined |
| References | ByObj with declared view |
| Structs | ByVal; legal Table/UnpackedValues policies |
| Arrays | CLR wrapper; ordinary SZArray inputs also accept dense JS Arrays |
| byte[] + Bytes | Copied Uint8Array |
| C#→JS byref | Call-scoped Opaque; in read-only |

undefined means missing. Optional slots may use defaults; required references do not treat undefined as null. Nullable has separate no-value rules.

JS→CLR out consumes no input and returns tuple entries. ref/in consume input; temporary reassignment does not rebind JS variables or append out-tuple results.

Managed-reference structs and heap writes need roots/barriers. Borrows cannot cross return or await. Bytes/to_array copies are not zero-copy promises. See [marshaling](../spec/marshal/index.md) and [policies](../guides/js-marshal-as.md).
