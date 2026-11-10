---
sidebar_position: 1
title: "Member dispatch specification"
---

# Member dispatch specification

These pages define the engine-independent type/instance member model.

- [Layout](01-LAYOUT.md): static/instance and ByVal/ByObj layers.
- [Lookup and this](02-INDEX.md): priority, writes, misses, protocol probes.
- [Binding](03-BINDING.md): inheritance, aliases, generics, freezing.
- [Special types](04-SPECIAL-TYPES.md): enums, Nullable, structs, arrays, delegates.

Conversions follow [marshaling](../marshal/index.md); selection follows [overloads](../04-METHOD-OVERLOAD.md). Default long/ulong are number; explicit legal slots use BigInt, without changing enum constants.
