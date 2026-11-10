---
sidebar_position: 2
title: "Design overview"
---

# Design overview

ZenTS brings ZLua's CLR interop design to JavaScript/TypeScript: shared binding rules, signature bridges, and configuration, adapted where JS or its host requires different behavior.

## Three dimensions

| Dimension | Responsibility |
|---|---|
| Language facade | CSharp, csharp:, zents, this, null/undefined, modules |
| CLR execution | Editor Mono + Emit; Player IL2CPP + static bridges |
| JS engine | Native V8; platform VM for WebGL/WeChat |

Binding plans contain CLR types, members, overloads, defaults, and policies, not engine SDK values. Adapters implement functions, objects, exceptions, modules, jobs, references, and lifecycle. HostJs reuses the interop core instead of a separate reflection binding implementation.

## Binding and calls

First type access creates a binding. Inherited members are flattened, short names freeze, and full CLR signature keys resolve through a restricted miss path. Calls validate receivers, candidates, and marshaling before invoking CLR code.

No per-type Wrap allowlist is required, but metadata and AOT preservation still are. Optimizations must preserve overload selection, declared views, and copy semantics.

## Configuration and hosts

Attributes and AOT XML define aliases, marshaling, and extensions. XML is session/build configuration, not a hot-update API. SDKs install in Library; Editor plugins are generated in Assets for read-only UPM compatibility.

HostJs connects WASM to the platform VM through static factories and binary operations. JavaScript compatibility alone does not establish every platform capability. See the [overview specification](../spec/00-OVERVIEW.md).
