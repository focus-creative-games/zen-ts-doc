---
sidebar_position: 12
title: "Value types, views, and copies"
---

# Value types, views, and copies

Value types copy by default; reference objects preserve CLR identity. JS variable assignment is not CLR struct address writeback.

## ByVal and ByObj

A ByVal struct wrapper stores a value copy. Nested value reads normally produce copies; assign modified nested values back when needed. A boxed value has ByObj identity and a separate receiver domain. Do not reuse incompatible closures across these domains.

`zents.box(typeArg, value)` boxes, unbox extracts a value, and cast selects a compatible CLR view. They are not unrestricted JS-object conversions.

## Explicit representation

JsMarshalAs can select Table or UnpackedValues for legal struct slots. Members names fields/properties explicitly. Optional Table input keys may end in `?`; UnpackedValues forbids this suffix.

Table distinguishes missing own properties from properties containing undefined. Each member still follows its own policy. Nested UnpackedValues arrays are not recursively flattened into outer out tuples.

## References and borrowing

Structs containing managed references need GC-visible storage and write barriers, not arbitrary memcpy. Opaque is a call-scoped borrowed handle, not a persistent struct address. Read a legal value or create a proper wrapper before retaining it.

See the [struct specification](../spec/marshal/05-STRUCT.md) for supported members and Nullable behavior.
