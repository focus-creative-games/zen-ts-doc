---
sidebar_position: 90
title: "Glossary"
---

# Glossary

| Term | Meaning |
|---|---|
| V8 | Official statically integrated native JS engine, without Node.js |
| HostJs | Backend connecting WebGL/WeChat to the platform VM |
| CLR host | Editor Mono or Player IL2CPP execution path |
| BindingPlan | CLR binding/call plan without engine SDK values |
| Wrap allowlist | Developer-maintained per-type binding list; not required by ZenTS |
| Signature bridge | Shared compiled CLR-ABI bridge, not a per-type Wrap |
| AOT | Ahead-of-time executable code; missing native generics cannot be created by name at runtime |
| Type object | CLR type entry obtained from CSharp/csharp: |
| System.Type wrapper | Reflection Type object; valid GTAP prefix |
| STO / IEO | Abstract static/instance member layers |
| ByVal / ByObj | Value-copy / identity-preserving wrapper |
| Declared view | Member visibility based on a declared CLR type |
| GTAP | Generic Type Argument Prefix using System.Type wrappers |
| Full-signature key | CLR method name plus full parameter type signature |
| Opaque | Call-scoped borrow, not a persistent memory address |
| Generation | Domain epoch used to reject obsolete handles/delegates |
| FramePump | Main-thread release/job processing and scheduled Reset |
| SDK fingerprint | Immutable identity of source, ABI, adapters, and files |
| Inspector / CDP | V8 debugger / Chrome DevTools Protocol |
| Named case | Named test function, distinct from module count and coverage percentage |

Exact behavior is defined by the [specification](../spec/00-OVERVIEW.md). Removed engines/APIs appear only as migration context.
