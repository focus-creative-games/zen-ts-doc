---
sidebar_position: 3.5
title: "ZLua alignment and implementation status"
---

# ZLua alignment and implementation status

ZenTS follows ZLua's CLR interop design, with explicit adaptations for JavaScript semantics and host capabilities.

## 1. Design principles

Types, member binding, overloads, marshaling, lifetime, and AOT configuration follow ZLua. this, undefined, numbers, modules, and asynchronous behavior follow the JS-specific rules below rather than mechanically copying Lua mechanisms.

## 2. Current capabilities

| Capability | Implementation |
|---|---|
| Engines | Official static V8 13.6.233.17; WebGL/WeChat platform VM; QuickJS removed |
| CLR core | Mono/Emit and IL2CPP static execution, common plans/semantics |
| Overloads/generics | Lazy signatures, frozen names, inflate/GTAP, params/defaults |
| Marshaling | Zero-input out tuples, explicit BigInt, Uint8Array Bytes, declared/actual views |
| Configuration | AOT snapshots/tables, attribute priority, GetComponent optimization |
| Distribution | Read-only UPM, Library SDKs, generated Assets plugins/meta |
| HostJs | Static factories, binary synchronous bridge, GC/Reset/Unicode, WeChat conversion |
| Debugger | Editor V8 Inspector; platform tools for HostJs |

## 3. Counts and platform scope

As of 2026-11-10, Windows Editor, macOS arm64 Editor, and Win64 pass **435 named cases**. Editor Smoke is 8/8; Player Smoke 10/10; TS examples 3/3. Chrome WebGL and WeChat tools pass **434, with one managed-worker skip**, Smoke 10/10, TS 3/3.

Named cases, modules, and Smoke/TS examples are distinct counts, not branch/device coverage. macOS Players, Android emulators, and iOS x64 Simulator have runtime validation, but not the latest complete named-case set. macOS x64 Player uses Rosetta; Android arm64 uses emulator translation; iOS arm64 has unsigned compilation only.

WeChat validation uses Unity 2022.3.62f3, SDK 202610200817, tools 2.01.2510260, and base library 3.17.6, without phone/upload/release validation. Tuanjie is supported: Editor uses native V8; WebGL/WeChat use HostJs. Unity support is 2022.3.x and later LTS plus Tuanjie based on 2022.3; patches do not establish all-version test coverage.

## 4. Debugger limitation

Windows protocol/Domain Reload validate cleanly. macOS arm64 protocol and Inspector cleanup validate, but Unity 2022.3.56f1c1/macOS 26.0 has an unresolved post-reload shutdown timeout. macOS x64 Editor plugin is compilation-only. CDP is tested; VS Code GUI is not automated.

## 5. ZLua-aligned rules

Frozen names, restricted lazy signatures, params competition, public typeArg, declared views, ByVal/ByObj, Opaque scopes, extensions, and AOT design remain aligned. XML is **AOT-only**, without runtime registration/hot reload/Reload; hot-update assemblies use attributes.

## 6. JS adaptations

| Area | Rule |
|---|---|
| Empty values | Distinguish null/undefined |
| Methods | JS this; extracted closures use call |
| out | No input; `[ret, out1, ...]` or `[out1, ...]` for void |
| ref | Input retained; temporary rebind neither changes JS local nor adds tuple result |
| Int64/UInt64 | Default number; explicit concrete-slot BigInt |
| Bytes | byte[] ↔ copied Uint8Array, not binary string |
| Async | Promise is not a Lua coroutine; no Opaque across await |
| Modules | Native V8 modules; preloaded static HostJs factories |
| GC | Different mechanisms, shared roots/generation/Reset contract |

## 7. Platform testing

See [status](../getting-started/project-status.md) and [testing](../community/testing.md). Validate your own devices, Unity version, and build configuration.
