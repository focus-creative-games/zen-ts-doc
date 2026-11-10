---
sidebar_position: 6
title: "HostJs, WebGL, and WeChat"
---

# HostJs, WebGL, and WeChat

## 1. Backend selection

Use the platform VM with no V8/QuickJS in WASM. Reuse EngineApi and CLR plans/overloads/marshaling; specialize transport, modules, and startup.

Explicitly match WebGL or WeixinMiniGame, not any MiniGame-like name. Managed routes include UNITY_WEBGL, explicit WeChat macros, and ZENTS_HOST_JS. Editor always uses native V8. Tuanjie and its WeChat target use the shared HostJs core and corresponding build flow.

## 2. Synchronous binary protocol

JS/WASM calls use owned 16-byte values and HostOperation binary imports, not the retired JSON/ccall prototype. Nested calls have independent receiver, argument, result, and error frames.

| Value | Transport rule |
|---|---|
| number/boolean/null/undefined | Separate tags |
| Default long/ulong | number, with defined precision loss |
| Explicit BigInt long/ulong | Exact payload, never first through double |
| Strings | UTF-8 pointer/length, preserving NUL and non-BMP |
| Objects/functions | Owner, handle, generation |
| Bytes | Length and explicit copy ownership |
| out/UnpackedValues | Preserve outer tuple/nested array structure |

Refresh TypedArray heap views after growth. UTF-8 covers BOM, replacement for malformed sequences, NUL, and missing TextDecoder. Do not reuse invalid views or one global scratch frame.

## 3. GC and Reset

Require Proxy, BigInt, WeakRef, and FinalizationRegistry. Missing weak-reference capabilities fail; no permanent strong table pretends to be weak.

Wrappers root CLR objects; delegates retain JS functions. FinalizationRegistry enqueues and FramePump releases roots. Collection is not immediate. Tokens/generations prevent old references reaching reused slots.

Reset rebuilds ZenTS instances/caches/handles, not the platform VM. Unsubscribe business-owned wx events/timers and strong cycles explicitly.

## 4. Static modules

esbuild parses ESM, synthesizes csharp:, and emits CommonJS factory registries. Both facade and business code avoid runtime eval/new Function/with. Preload bundles/subpackages before synchronous entry.

Reject dynamic import/import.meta; top-level await fails CommonJS compilation. Do not fake fulfilled Promises. Other import/export/cycle/live-binding support follows actual builder/tests.

Precompile loader/Reset source variants. UTF-16-hex source keys preserve identity through WeChat converter rewriting. Source mismatch fails; never fall back only by module name.

## 5. Jobs and threads

Use platform Promise/microtasks with equivalent observable safe-boundary behavior, not a competing queue or automatic await. Old callbacks cannot enter a new generation; Opaque cannot cross await.

Current builds are single-threaded. Workers are not synchronous CLR reentry hosts. wx APIs are usable directly on platform, not automatically in Editor V8.

## 6. WeChat integration

The official converter SDK is optional. ZenTS/Build WeChat Mini Game or ZenTS.Editor.WeChatBuild.RunBatch invokes WXConvertCore.DoExport(true) through reflection.

Normal builds preserve subpackage/CDN/development settings and restore temporary template/graphics/exception/thread/codegen changes. HostJs requires single-threaded/full-exception configuration. OptimizeSize fully shared generic delegate ABI is supported; GTAP checks invoker availability, not methodPointer alone.

ZENTS_WECHAT_APPID, ZENTS_WECHAT_OUTPUT, and ZENTS_NODE configure builds. ZENTS_WECHAT_ACCEPTANCE=1 is validation-only. The validator copies output into Library and injects run-scoped temporary logging, never into normal release output; network failure cannot count as success.

## 7. Validation

Chrome/WeChat tools pass 434 named cases with one managed-worker skip, Smoke 10/10, TS 3/3, plus GC/Reset/Unicode/NUL/throw-undefined and shared-generic checks.

WeChat validation uses Unity 2022.3.62f3, SDK 202610200817, tools 2.01.2510260, base library 3.17.6; converter commit 915d4bf4f60ef0cd1c29316a8d67257185d609a7. Tuanjie WeChat is also supported. Phone/upload/release and other Mini Game platforms are separate scopes. See [status](../03-ALIGNMENT.md).
