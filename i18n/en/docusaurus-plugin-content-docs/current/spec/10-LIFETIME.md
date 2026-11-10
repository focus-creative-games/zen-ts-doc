---
sidebar_position: 10
title: "Lifetime, GC, and exceptions"
---

# Lifetime, GC, and exceptions

## 1. Ownership

Model CLR ownership, JS ownership, and borrowed addresses separately. One Unity main-thread domain is the default; caches belong to runtime/generation. Tokens are not permanently dereferenceable addresses.

ByObj wrappers hold GC-visible CLR roots and declared view types. Multiple views may represent one object; cast does not copy it. Weak finalization queues root release on the owner thread. Weak caches must not strongly retain wrappers. HostJs currently requires WeakRef/FinalizationRegistry; collection is not immediate.

## 2. Struct storage and Opaque

ByVal owns copies, ByObj represents boxed identity, and Opaque borrows a call frame. Reference-containing copies need GC-visible storage; managed heap writes need barriers. Native memcpy alone cannot keep managed references alive.

Opaque records type, storage, scope, generation, and readonly state. It expires when the creating C#→JS call returns, on success or failure. Nested scopes are independent. Element policies govern get/set: default long/ulong number, explicit BigInt bigint. in cannot be written or forwarded as writable ref. Expired read/write/pop fails; no borrowing across await, timers, events, or later calls.

## 3. Functions and cycles

CLR delegates retain JS functions; JS wrappers retain CLR delegates/targets. Event add/remove requires stable identity. Use stable JS identity tokens, not moving-heap addresses. Managed finalizers enqueue, rather than directly releasing on arbitrary threads.

Cross-GC strong cycles require unsubscribe/Dispose/domain cleanup. GetFunction need not return identical delegate instances; old delegates fail after Reset.

## 4. Threads and jobs

Interop runs on the Unity owner thread. V8 background GC/compiler threads do not authorize Unity worker calls. Workers need explicit asynchronous messaging.

Native adapters advance microtasks at safe boundaries; HostJs uses the platform queue. Do not resume asynchronously while borrowing invalidatable CLR addresses. Synchronous delegates do not await Promise and reject incompatible returns.

## 5. Initialize and Reset

Initialize creates the engine domain, modules, configuration snapshot, registry, and pump; repeats fail. Play Mode Reset schedules EndOfFrame cleanup/rebuild; Editor edit/batch applies synchronously. Drain releases, invalidate generation, and detach callbacks/modules/handles before rebuilding.

Native may recreate contexts or isolates but must invalidate all old-domain resources. HostJs rebuilds only ZenTS-managed state, not its VM; stale platform imports/events are not a new domain. Reset never reloads XML. Hot-update assemblies use attributes and do not automatically alter existing frozen bindings.

## 6. Errors

JS errors become diagnostic CLR exceptions; CLR errors become JS-catchable errors. Neither unwinds unsafely across the callback ABI. Pending-error state is not Lua longjmp or cross-ABI C++ throw.

Every reentrant call owns errors, argument/result buffers, roots, and scopes; restore outer state afterward. Do not swallow failures as zero values or partial out tuples. Categories/zents: prefix agree; stack text may vary.

## 7. Validation

Cover incremental GC, reference structs, event-cycle cleanup, nested callbacks/errors, obsolete delegates after Reset, Opaque expiry, and host memory growth. See [platform scope](03-ALIGNMENT.md).
