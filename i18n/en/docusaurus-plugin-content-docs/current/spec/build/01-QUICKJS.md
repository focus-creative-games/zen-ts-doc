---
sidebar_position: 1
title: "QuickJS has been removed"
---

# QuickJS has been removed

QuickJS support is fully removed: no engine source, adapter, plugin, setting, build branch, or release fallback remains. This route preserves old links and migration context, not build instructions.

## Current backends

- Windows/macOS Editor: plugins statically linked with official V8.
- Win64/macOS/Android: static V8 Players; iOS: JITless V8.
- WebGL/WeChat: existing platform VM, without another engine inside WASM.

Unsupported native targets remain unsupported. Removed SDK APIs/layout/refcounts do not define CLR contracts. See [V8](02-V8.md), [HostJs](06-HOSTJS.md), and [migration](../12-MIGRATION-ADAPTORS.md).
