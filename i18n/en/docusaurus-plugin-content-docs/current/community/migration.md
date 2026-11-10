---
sidebar_position: 3
title: "Migrate to current ZenTS"
---

# Migrate to current ZenTS

Use current contracts and tests rather than retaining old semantics. Validate in Editor, then regenerate/export target Players.

| Previous usage | Current approach |
|---|---|
| QuickJS plugins/settings | Remove; import official V8 SDK, or use HostJs on supported hosts |
| Binaries in package/Git | SDK in Library; generated Editor plugins/meta in Assets |
| Dynamic register_method | Binding-time Alias attributes/AOT XML; frozen names |
| make_generic_method(closure, ...) | inflate(closed declaring type, key, ...types) or GTAP |
| out placeholders | Remove inputs; destructure results |
| ref reassignment in result tuple | No such result; follow direct-storage/in-place rules |
| Automatic bigint for long/ulong | Default number, explicit BigInt |
| Bytes binary strings | Copied Uint8Array |
| Runtime XML registration/reload | AOT session/build configuration only |
| Arbitrary HostJs source execution | Precompiled module factories and source variants |

## From ZLua

Keep CLR binding, candidate, view, configuration, and AOT concepts. Adapt this, null/undefined, out arrays, explicit BigInt, JS collections, and Promise behavior. Lua integers, binary strings, longjmp, and __gc are not JS engine interfaces. Opaque cannot cross await; unsubscribe events explicitly.

## Regression

Remove retired APIs and stale expectations, verify SDK identity, then check aliases/config conflicts, declarations, overloads, numeric limits, GC, exceptions, Reset, and generics on target. See [migration contracts](../spec/12-MIGRATION-ADAPTORS.md).
