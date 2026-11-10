---
sidebar_position: 7
title: "Engine boundary and binding plans"
---

# Engine boundary and binding plans

## 1. Interfaces

Native execution uses zents::engine; Editor uses owned managed EngineApi. V8/HostJs are the current adapters. Shared CLR contracts are not SDK typedefs or a cloned engine C API.

EngineApi.h includes standard headers only. Runtime/Context/Module are opaque; Value is an owned 16-byte envelope. This internal C++ API, Mono ABI, and HostJs wire protocol are separately adapted, not interchangeable because sizes match.

The interface covers conversions, strings/properties/arrays, callbacks, payloads, errors, modules, jobs, and lifecycle. V8Engine.cpp and HostEngine.cpp implement it; CLR code does not decode SDK handles/tokens.

## 2. Ownership

- Copying Value copies a borrowed token, not an implicit retain. New/Get/Call/Eval/Dup return owned references according to API contracts.
- SetProperty, DefinePropertyGetSet, and Throw consume corresponding value arguments, including on failure. Receivers are borrowed.
- Callback receiver/argv/captured data are borrowed for the call; retain for longer use.
- GetIdentity is a cache key while retained, not a dereferenceable or moving-GC-invalid address.
- GetCompiledModule extracts modules; core code does not inspect pointer layouts.
- Do not mix runtime/context/generation. Errors use pending state and boundary conversion.

Stack/overflow buffers are optimizations, not permanent argument limits. Refresh HostJs heap views and isolate reentrant frames.

## 3. Binding plans

BindingPlan.h contains no engine/libil2cpp SDK headers. MarshalPlan, MethodPlan, FieldPlan, OverloadPlan, MemberPlan, and TypeBindingPlan record CLR types, candidates, defaults, arity, byref/out, params, and policies—not JS values/context.

Execution extensions hold writers/invokers/prototypes. Actual binding consumes these plans rather than maintaining unused shadow metadata. Mono BindingPlan similarly supports real Emit/Marshal via one backend.

## 4. Validation

Keep SDK types, P/Invoke, and payload access inside adapters. Static interface checks cannot replace actual platform execution. Compare overloads/views/copies/errors/GC/Reset across Mono/IL2CPP and V8/HostJs. See [platform scope](../03-ALIGNMENT.md).
