---
sidebar_position: 1
title: "Specification overview"
---

# Specification overview

ZenTS is the JavaScript/TypeScript port of ZLua. CLR types, binding, overloads, marshaling, lifetime, and build configuration follow ZLua unless the JS language or host requires an explicit adaptation.

These pages define current contracts. Native platforms and Editors use official static V8; WebGL/WeChat use the platform VM. QuickJS is removed. See [alignment and status](03-ALIGNMENT.md).

## 1. Product model

- C#→JS uses `JsAppDomain.GetFunction<T>(module, exportName)`; callers cache the delegate.
- JS→CLR uses lazy `CSharp[assembly][fullName]`; recommended csharp: imports resolve to the same type object.
- Use Type.Method, obj.Method, and new Type. Extracted instance closures require `.call(receiver, ...)`.
- No per-type Wrap allowlist is required, but metadata, AOT code, and calling bridges must exist.
- TypeScript is an editing/build tool; emitted JavaScript executes at runtime.

IL2CPP keeps metadata, binding plans, overloads, and marshaling in C++. First binding caches member/default/closed-generic information. Mono uses reflection/Emit. Optimization must preserve selected overloads, declared views, value copies, and GC-safe reference writes.

| Boundary | Contract |
|---|---|
| Events | add_Event/remove_Event, no event subobject |
| CLR member miss | JS error with zents: prefix, subject to protocol probes |
| Inheritance | Binding-time flattening; restricted lazy full-signature lookup |
| Short names | Frozen after binding; no register_method |
| XML | AOT assemblies only; no runtime registration/hot reload/Reload |
| Backends | Native V8 and HostJs, no QuickJS fallback |
| Wrappers | Abstract exotic/slot model, independent of physical SDK layout |

undefined means missing; null means explicit reference/Nullable no-value. CLR null pushes null; void produces undefined. See [default marshaling](marshal/01-OVERVIEW.md).

## 2. CLR hosts and engines

```text
JsAppDomain / IJsRuntime / zents / csharp:
                    |
             CLR binding plans
              /           \
       Mono + Emit     IL2CPP + C++
              \           /
              owned EngineApi
                /        \
          Native V8    HostJs (JS/WASM)
```

| Environment | CLR host | Engine |
|---|---|---|
| Windows/macOS Editor | Mono | Native V8 |
| Win64/macOS/Android Player | IL2CPP | Native V8 |
| iOS | IL2CPP | JITless V8 |
| WebGL/WeChat | IL2CPP/WASM | Existing platform VM |

Unity 2022.3.x and later LTS, plus Tuanjie based on 2022.3, are supported. Backend selection is not validation of every device/version. Unsupported native targets have no old-engine fallback.

## 3. Specification map

| Page | Responsibility |
|---|---|
| [Host API](01-HOST-API.md) | Initialize, Reset, GetFunction, errors |
| [Types](02-TYPE-SYSTEM.md) | Names, views, construction, inheritance |
| [Alignment](03-ALIGNMENT.md) | ZLua/JS decisions and platform status |
| [Overloads](04-METHOD-OVERLOAD.md) | Signatures, GTAP, params, selection |
| [Library](05-LIB.md) | zents and typeArg |
| [Marshaling](marshal/index.md), [members](metatable/index.md) | Conversions and dispatch |
| [Lifetime](10-LIFETIME.md) | GC, scopes, threads, Reset |
| [Build/version](11-MULTI-VERSION.md) | Installation, SDKs, iteration |
| [Migration](12-MIGRATION-ADAPTORS.md) | Retired APIs |
| [Extensions](13-EXTENSION-METHODS.md) | Configuration and competition |
| [TypeScript](14-TYPESCRIPT.md) | Emit, declarations, modules |
| [Settings](15-SETTINGS.md), [Unity optimization](16-UNITY-OPTIMIZATIONS.md) | Configuration |
| [V8](build/02-V8.md), [boundary](build/07-ENGINE-BOUNDARY.md), [HostJs](build/06-HOSTJS.md) | Engine integration |

## 4. Initialization

Create host/adapter and generation; install loaders, libraries, type roots, and AOT tables. First type access builds bindings with frozen short names and lazy signatures. GetFunction binds ready exports without awaiting Promises. FramePump drains releases and applies scheduled Reset at EndOfFrame; edit-mode Editor applies it synchronously.

HostJs must preload required bundles/subpackages before synchronous entry. Reset rebuilds the managed script world, not the platform VM.
