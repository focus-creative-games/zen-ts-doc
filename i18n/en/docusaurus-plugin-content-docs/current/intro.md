---
sidebar_position: 1
slug: /intro
title: "Introducing ZenTS"
---

# Introducing ZenTS

ZenTS is a JavaScript/TypeScript scripting solution for Unity and Tuanjie. It follows ZLua's CLR interop design, with adaptations for JavaScript's `this`, `undefined`, BigInt, modules, and garbage collection.

## Execution model

| Environment | CLR host | JavaScript engine |
|---|---|---|
| Windows/macOS Editor | Mono + Expression Emit | Native V8 |
| Win64/macOS/Android Player | IL2CPP + C++ interop core | Statically linked V8 |
| iOS Player | IL2CPP + C++ interop core | JITless V8 |
| WebGL/WeChat Mini Games | IL2CPP/WASM | Platform JS VM through HostJs |

QuickJS has been removed, with no fallback. V8 is built from unmodified official sources as a static SDK, then linked into the adapters and Editor plugins. ZenTS does not embed Node.js. See [platform compatibility](getting-started/compatibility.md) and [implementation status](getting-started/project-status.md) for supported configurations and validation limits.

## Main capabilities

- `CSharp[assembly][fullName]` and `csharp:` modules bind CLR types on demand, without a developer-maintained per-type Wrap allowlist.
- `JsAppDomain.GetFunction<T>` calls JS from C#. Constructors, methods, generics, aliases, and extensions follow explicit matching rules.
- Interop covers structs, Nullable, arrays, delegates, events, ref/in/out, and explicit marshaling policies. Int64/UInt64 default to `number`; exact integer slots can opt into `JsMarshalType.BigInt`.
- HostJs shares the CLR binding and marshaling core while running scripts in the platform VM. Module factories are produced at build time.
- Git URL installation, read-only PackageCache, project-local SDKs, TypeScript declarations and emit, and Editor V8 Inspector are integrated.

Lazy binding still requires setup: Players need IL2CPP integration, generated configuration, AOT preservation, and the appropriate platform SDK.

Start with [installation](getting-started/installation.md) and the [quick start](getting-started/quick-start.md). The [specification](spec/00-OVERVIEW.md) defines behavior; [design tradeoffs](compare/FEATURES.md) and [testing](community/testing.md) explain evaluation and validation.
