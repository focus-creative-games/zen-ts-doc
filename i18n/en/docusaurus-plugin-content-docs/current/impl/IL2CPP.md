---
sidebar_position: 2
title: "IL2CPP, static V8, and HostJs"
---

# IL2CPP, static V8, and HostJs

Players use the C++ core installed into project-local IL2CPP. Metadata resolution, plans, overloads, and marshaling share rules. Calls use existing CLR invokers and compiled bridges, not runtime native-code generation.

## Calls

C# facades enter through internal calls. JS member calls validate receivers/candidates, prepare storage, and invoke CLR code. Fields, arrays, and reference-containing structs need roots/write barriers. Ordinary function pointers, closed delegates, and fully shared generic delegates have distinct ABIs.

BindingPlan.h contains engine-independent CLR plans; execution extensions hold invokers/writers and engine objects. EngineApi hides V8/HostJs handles.

## Native V8

Win64/macOS/Android statically link matching official V8 and adapters. iOS uses JITless libraries copied into Xcode export. Library SDK validation covers sources, configuration, adapters, and hashes. Editor dynamic plugins are not Player runtime dependencies.

## HostJs

HostEngine.cpp and HostEngine.jslib exchange synchronous binary values with the platform VM. Handles and roots track both directions, generation rejects old values, finalizers enqueue releases, and FramePump releases CLR roots.

Modules/facades are static factories, without eval/new Function. Views refresh after memory growth; UTF-8 supports NUL, Unicode, and hosts without TextDecoder. WeChat source identity survives conversion; mismatches do not fall back to module-name-only lookup.

## Iteration

Reuse Win64 VS exports for C++-only changes. C# types/fixtures and generated inputs require regeneration/export. Test generics, byref/out, reference structs, delegates, exceptions, GC, and Reset on target. See [testing](../community/testing.md).
