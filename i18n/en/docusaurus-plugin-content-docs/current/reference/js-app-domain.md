---
sidebar_position: 2
title: "JsAppDomain"
---

# JsAppDomain

ZenTS.JsAppDomain is the static main-thread domain facade. The environment selects the implementation; business code does not inject backends.

```csharp
public static void Initialize(Func<string, object> moduleLoader);
public static T GetFunction<T>(string jsModule, string jsExportName)
    where T : MulticastDelegate;
public static void Reset(Func<string, object> moduleLoader);
public static void ApplyPendingResetNow();
```

## Initialize

Rejects null loaders and repeated initialization of a live domain. Prepare native plugins or HostJs factories first. Initialization installs libraries, configuration, loader, and frame pump. Loaders return supported module sources, commonly strings; JsFileModuleLoader.Load implements conventional paths.

The wrapped loader intercepts csharp: and synthesizes type modules. HostJs only executes precompiled modules/source variants; returning a new string does not authorize eval.

## GetFunction

After initialization, binds a nonempty module/export to a closed delegate. Canonicalizes module names and rejects csharp: modules. Cache returned delegates; instance identity is not guaranteed between lookups.

Uses fixed-signature marshaling, without params expansion or automatic Promise waiting. JS errors become managed script exceptions. Old-generation delegates fail after Reset.

## Reset

Rejects null loaders. Schedules EndOfFrame in Play Mode; applies synchronously in Editor edit/batch mode. Rebuilds contexts/caches/generation and invalidates prior values according to lifecycle rules. HostJs retains its platform VM.

Reset does not reload AOT XML, produce missing AOT code, or implement arbitrary CLR DLL hot loading.

## ApplyPendingResetNow

Applies a pending reset at a safe main-thread boundary; no pending reset is a no-op. Do not destroy a domain while nested callbacks still borrow its values.

There is no public Shutdown. Unity initialization captures the main thread; public entry points and bound delegates reject worker access. See [host API](../spec/01-HOST-API.md) and [lifetime](../spec/10-LIFETIME.md).
