---
sidebar_position: 20
title: "Allocations and data transfer"
---

# Allocations and data transfer

Shared bridges, cached binding plans, and explicit policies reduce interop costs. Allocation depends on type, direction, engine, and call shape; not every call is allocation-free.

## Reduce boundary crossings first

Batch operations and cache delegates, type objects, and closures. Avoid repeated export lookups and fine-grained JS/CLR loops. Measure first binding/generic closing separately from steady-state execution.

## Representation costs

| Representation | Cost or constraint |
|---|---|
| CLR wrapper | Identity and GC-root tracking |
| ByVal struct | Copy; managed references require safe writeback |
| JS Array / Table | Per-element/member conversion and possible allocation |
| Bytes / to_bytes | Explicit copies, not zero-copy |
| Opaque | Borrow valid only during a call; never across await |
| out tuple | JS result array; nested results remain nested |

WASM memory growth can invalidate old TypedArray views. Adapter view refresh does not authorize long-term retention of arbitrary addresses.

## Measure on target

Use Unity Profiler and the target JS tools for steady-state allocation, CPU, peak memory, and long-running GC. Distinguish Mono/IL2CPP and V8/platform VMs; record inputs, batch sizes, and warmup. Correctness validation is not a public performance ranking.

ABI, copy, and writeback rules take precedence over local allocation optimizations. Optimization must not change overload selection, views, or value semantics.
