---
sidebar_position: 3
title: "CLR hosts and JS backends"
---

# CLR hosts and JS backends

Editor/Player CLR execution paths and V8/HostJs backends are separate dimensions, not separate sets of interop semantics.

```text
JsAppDomain → IJsRuntime
  Editor        → Mono + Emit    → V8 Editor plugin
  Native Player → IL2CPP + C++   → static V8
  Web Player    → IL2CPP/WASM    → platform JS VM
```

The Editor selects Mono even with WebGL as the active build target. Native Players enter IL2CPP through internal calls; HostJs Players bridge to their platform VM. Business code uses the same JsAppDomain, CSharp, and zents interfaces.

## Shared and specialized code

Type resolution, plans, overloads, policies, views, and lifecycle contracts are shared. Module execution, handles, GC notifications, errors, and jobs are adapter-specific. V8 SDK types stay outside CLR plans.

HostJs calls are synchronous JS/WASM operations, not remote RPC. Modules compile into factories. Reset rebuilds ZenTS-owned instances and generations without destroying the platform VM.

## Validation

Compare fixtures across Mono/IL2CPP and V8/HostJs. Explicitly record unavailable platform capabilities, without skipping required interop to hide errors. See [testing](../community/testing.md).
