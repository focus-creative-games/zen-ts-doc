---
sidebar_position: 2
title: "Testing and validation"
---

# Testing and validation

Test CLR rules across Mono/IL2CPP and V8/HostJs. A pass on one execution path does not establish every backend; unsupported-capability skips must not hide required interop failures.

## Counts

The current list contains **435 named cases**. `56/56` counts 52 named-suite modules plus four C#-driven support modules, not individual functions or coverage. Smoke and TS examples are separate.

| Environment | Named cases | Smoke | TS |
|---|---|---|---|
| Windows/macOS arm64 Editor | 435 passed | 8/8 | 3/3 |
| Win64 Player | 435 passed | 10/10 | 3/3 |
| Chrome WebGL/WeChat tools | 434 passed, 1 explicit skip | 10/10 | 3/3 |

The HostJs skip is the managed-worker test unavailable in single-threaded builds. Android/macOS Players and iOS Simulator have runtime validation but have not covered the latest full named-case set.

## Coverage areas

Identity/views, inheritance, signatures/aliases, generics/params, numeric ranges/BigInt, byref/out, arrays/bytes, reference-containing structs, events/delegates, errors, Opaque expiry, GC, Reset, Unicode/NUL, and TS workflows. HostJs also tests actual collection, memory views, and precompiled-source identity.

Lua/JS differ; compare observable rules rather than inferring branch coverage from function totals.

## Debugger and platforms

Inspector uses real CDP. Windows Domain Reload exits cleanly; macOS arm64 cleanup assertions pass but shutdown timeout remains. Tuanjie is supported; counts apply to listed environments, not every engine version. Validate phones, releases, and later LTS versions separately.

## Reproduction

Record source/SDK identity, versions, commands, module/case counts, skips, and process exit. Reuse Win64 exports for C++-only changes; regenerate/export after C# or generated-input changes. Static checks are not runtime execution.
