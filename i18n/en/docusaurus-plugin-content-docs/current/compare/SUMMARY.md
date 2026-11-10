---
sidebar_position: 2
title: "Choosing a scripting solution"
---

# Choosing a scripting solution

Evaluate workflow and platform constraints, not only engine names or test totals. ZenTS emphasizes ZLua-aligned CLR design, lazy binding, shared bridges, and V8/HostJs backends.

| Dimension | ZenTS benefit and cost |
|---|---|
| Binding maintenance | No business per-type Wrap list; AOT/preservation still required |
| Consistency | Shared Mono/IL2CPP and V8/HostJs rules |
| Development | TS declarations/checks/maps and Inspector |
| Native engine | Official static V8; platform SDK/toolchain maintenance |
| Web | Platform VM; capabilities and precompiled modules required |
| Installation | Read-only Git package; project-local SDK/plugins |
| Validation | Explicit platform scope; emulator/tool results do not replace devices |

Compare Puerts, Lua, or custom V8 solutions with the same workloads, platforms, stripping, warmup, and size definitions. ZenTS's architecture does not establish another project's current feature gaps or performance.

Include migration costs and reproduce important calls, generics, lifetime, and Mini Game packaging first. See [tradeoffs](FEATURES.md) and [platforms](../getting-started/compatibility.md).
