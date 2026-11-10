---
sidebar_position: 6
title: "CLR wrappers and member lookup"
---

# CLR wrappers and member lookup

Exotic objects, internal slots, STO, and IEO describe observable behavior, not one engine's layout. V8 templates/internal fields and HostJs proxies/handle tables can implement the same rules.

## Types and instances

Type objects expose static members and construction. Instance wrappers expose members through their view. ByVal stores struct copies; ByObj preserves CLR identity. Invalid receivers or cross-domain closures fail.

Binding flattens inherited members and separates static/instance domains. Short names freeze; full CLR signatures resolve lazily. This internal cache is not runtime short-name registration.

## Identity and views

One CLR object may have several declared-type views. A view controls visibility without changing identity. cast selects compatible views; explicit ActualTypeUserData requests a runtime-type view only on legal return slots.

Public properties such as __zents_id cannot forge identity. Host tokens require registry/generation checks; V8 identity cannot use a raw address invalidated by moving GC.

## JS protocols

Ordinary misses throw; absent then/Symbol probes have restricted exceptions after real lookup. Methods use this and extracted closures need `.call(receiver, ...)`. Arrays use get/set and length.

See the [member specification](../spec/metatable/index.md).
