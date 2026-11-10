---
sidebar_position: 2
title: "Object and dispatch layout"
---

# Object and dispatch layout

## 1. Abstract model

Type objects, STO, IEO, and ByVal/ByObj are behavioral models, not engine layouts. V8 templates/internal fields and HostJs proxies/tables may implement them. Conceptual [[slots]] are not arbitrary writable JS properties. Diagnostics may be readonly; native pointers cannot be forgeable identities.

## 2. Type objects and STO

Intern a type object per CLR type/domain. CSharp/csharp: share identity. STO holds static methods/getters/setters and legal construction; callability does not expose instance members statically.

Structs reserve _default. Enums/arrays/static classes have no general constructor. Nullable uses a callable factory, without requiring new to return primitives. Reserved construction/protocol operations are not ordinary overload names. Export enumeration must not eagerly bind unrelated members.

## 3. IEO and tables

ByObj uses identity/viewType; ByVal uses a struct copy. Struct domains expose matching member sets with different receiver interpretation. Keep static/instance tables separate. Arrays add get/set/length; delegates add calling.

methodTable, fieldGetterTable, and fieldSetterTable are distinct conceptual indices. Reads prioritize methods then getters; setter-only reads fail. Writes use setters separately. Short names freeze; exact signatures and closed-generic caches may be populated lazily.

## 4. Plans, caches, and adapters

CLR plans hold types/candidates/defaults/policies/domains, not JS values. Execution objects hold closures/prototypes/wrappers/references. Mono need not use IL2CPP's execution mechanism to share contracts.

Cache by identity/viewType; ActualTypeUserData changes only legal returns. Weak caches must not retain wrappers strongly. Engine handles stay in adapters; identities survive moving GC while alive, and HostJs tokens carry generations. Public __zents_id-like fields cannot forge CLR identity. See [engine boundary](../build/07-ENGINE-BOUNDARY.md).
