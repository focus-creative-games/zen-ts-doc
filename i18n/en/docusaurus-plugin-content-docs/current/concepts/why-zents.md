---
sidebar_position: 1
title: "Evaluating ZenTS"
---

# Evaluating ZenTS

ZenTS is intended for Unity projects using TypeScript/JavaScript with consistent CLR interop. It follows ZLua's binding-plan and marshaling design rather than exposing a JS engine API to business code.

## Benefits

- Bind types/members on demand without a business-maintained per-type Wrap list.
- Share overload, view, byref, and lifetime rules across Mono/IL2CPP and V8/HostJs.
- Use official static V8 natively and the existing platform VM on WebGL/WeChat.
- Connect TS declarations/checks/maps with Editor Inspector.
- Install SDKs without modifying read-only packages; distribute complete SDKs per project.

## Constraints

Native SDKs require platform toolchains. IL2CPP still needs metadata preservation, AOT generics, and bridges. iOS uses JITless V8, so desktop JIT measurements do not predict device performance. HostJs requires weak-reference capabilities and precompiled modules, not arbitrary downloaded source evaluation.

JS number precision, this, Promise, and GC semantics remain relevant. Select BigInt explicitly, manage events, and keep borrows within synchronous calls.

## Evidence

Validation scope differs by platform, emulator, and tool. See [compatibility](../getting-started/compatibility.md). Without comparable benchmarks, do not assume unconditional performance or size advantages.
