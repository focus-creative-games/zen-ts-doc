---
sidebar_position: 5
title: "Native modules and platform capabilities"
---

# Native modules and platform capabilities

## 1. Entry points

Expose CLR capabilities through ordinary C# interop first. Custom native JS extensions require backend-specific integration; this is an adapter boundary, not a delivered universal dynamic-plugin registry or business module loader.

Do not treat removed SDK module signatures as cross-engine APIs. V8 does not include Node standard libraries or addon compatibility.

## 2. Native V8

Link extensions into plugins/Players and register through adapters before business modules evaluate. Follow V8 handles/owner-thread rules; manage CLR pointers through wrappers/Opaque. Do not return v8::Local, raw heap pointers, or C++ exceptions across Mono ABI.

## 3. HostJs

Use JS/WASM imports/exports for platform capabilities. WeChat scripts can call wx where available. Adapters manage bundles, startup/resume events, and resources while the CLR core stays platform-independent.

Mini Games need not support native dynamic loading. Code publishing, subpackages, remote data, and executable code follow platform workflows; arbitrary remote source evaluation is not a universal feature.

## 4. Lifetime and configuration

Assign owners to modules, events, timers, and native resources. Reset invalidates old callbacks; domain-managed resources clean up, business resources need explicit release. Cross-GC cycles are not automatically collectible.

Native registration cannot bypass AOT-only XML timing. Hot-update assemblies use attributes, not runtime Alias/MarshalAs/Extension XML loading.
