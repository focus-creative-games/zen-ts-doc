---
sidebar_position: 3
title: "Property lookup and this"
---

# Property lookup and this

## 1. Domains

Types access static indices; instances access their view's instance indices. Struct ByVal/ByObj receivers differ, so closures cannot reinterpret the other payload.

## 2. Reads

1. Search methods, then getters in the current domain.
2. If only a setter exists, report a write-only property error.
3. For string keys containing parentheses, attempt restricted exact-signature lookup: public, correct static/instance domain, excluding constructors/cctors/accessors, through the type hierarchy, then cache.
4. Handle reserved type operations and necessary JS protocol probes; otherwise throw member not found.

Caches do not change frozen short-name groups. Ordinary misses do not perform arbitrary reflection promotion.

Real members precede protocol handling. Absent then/Symbol probes may return undefined so wrappers do not accidentally become thenables. Real callable then retains JS thenable behavior. Helpers such as toString must be consistent without opening all unknown string keys.

## 3. Receiver and writes

obj.Method uses this; extracted closures need fn.call(obj,...). Missing/obsolete/incompatible receivers fail, never use a global or wrong payload. Extension methods use the same JS receiver but pass it as CLR static parameter 0.

Writes require a setter/writable field and legal conversion. Readonly/missing members fail. Heap reference writes require barriers. Scripts cannot add CLR short-name methods to bypass freezing.

## 4. Indexing and errors

Indexers use get_Prop/set_Prop; arrays use get/set, not native arr[i]. Reserved struct _default/diagnostics do not authorize _ctor or writable pointers.

Diagnose misses, unreadable/readonly members, arguments, and receivers with zents: errors. Do not swallow errors as undefined/zero. Names, priorities, caches, views, and receivers agree across backends.
