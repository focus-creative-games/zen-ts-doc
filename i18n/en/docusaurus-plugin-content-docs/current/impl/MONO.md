---
sidebar_position: 1
title: "Editor Mono and V8"
---

# Editor Mono and V8

JsMonoAppDomain implements IJsRuntime with reflection and Expression Emit, while JS runs in the native V8 plugin. No QuickJS execution path remains.

## Isolation

Runtime/Mono/Binding owns CLR plans. EngineApi supplies values, callbacks, errors, and modules. Engine/V8 contains P/Invoke and native handles; Marshal/Emit do not interpret SDK payloads.

The native Editor interface is engine/v8/V8Mono.cpp. Official static V8 links into DLL/dylib plugins. They are generated from Library SDKs into Assets, without writing PackageCache.

## Callback boundary

Managed callbacks catch failures and return controlled status; native gates set JS errors after managed return. Pointer-output ABI avoids compiler differences for 16-byte structure returns. Release temporary roots and references on all paths; managed exceptions cannot unwind across unmanaged callbacks.

## Lifecycle and Inspector

Persistent functions belong to generations; entry rejects workers. Reset, Domain Reload, and exit clean runtimes, targets, and ports. Inspector operations run on the owner thread; background threads handle transport. Paused loops do not execute gameplay updates.

macOS arm64 protocol validation passes, but a Domain Reload shutdown timeout remains; see [status](../getting-started/project-status.md).

After native changes rebuild/import adapters and restart an Editor with loaded old plugins. Also run Player regression for shared behavior changes.
