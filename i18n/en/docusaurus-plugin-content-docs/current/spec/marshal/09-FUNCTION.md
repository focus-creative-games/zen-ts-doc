---
sidebar_position: 15
title: "Delegate and function marshaling"
---

# Delegate and function marshaling

This defines both directions between CLR delegates and JS functions. There is no special event marshaler: use add_/remove_. Mono uses cached Expression Emit; IL2CPP uses available compiled calling bridges.

## 1. CLR delegate → JS

Null becomes null. A delegate backed by JsMethod can recover the original JS function; otherwise expose a ByObj callable delegate wrapper. A multicast invocation list recovers a function only when the whole delegate represents a single JS source; otherwise preserve CLR multicast behavior through a wrapper. Object policy does not override this routing.

Use `d(a,b)` for either form; d.Invoke works only for CLR wrappers, not ordinary JS functions. Null calls fail. Open delegates with no target are outside the supported open-instance contract.

## 2. JS → CLR

Concrete delegate slots accept callable functions, compatible existing delegate wrappers, or null. Required undefined fails; optional defaults apply normally. Other inputs fail.

Resolve delegateType, retain the function reference, create a JsMethod target and a signature-compatible closed delegate, then invoke CLR. JsMethod owns the persistent function until delegate lifetime ends.

```javascript
obj.RegisterCallback(v => console.log(v));
const d = zents.to_delegate(a => a, FuncIntIntType);
obj.RegisterCallback(d);
```

to_delegate uses the same binder and provides an explicit CLR delegate wrapper for stable use.

## 3. Execution and ABI

JsMethod is the closed target holding funcRef. IL2CPP bridges implement the actual Invoke ABI; missing supported signatures fail with useful diagnostics, not incompatible fallback calls. Ordinary closed and fully shared generic delegates require correct platform-specific handling.

Mono caches Expression-generated bridges by signature. Unsupported marshaling throws NotSupportedException, not a silent reflective hot-path fallback. Do not combine DynamicMethod and Delegate.CreateDelegate in ways unsafe on Unity Mono.

C#→JS calls push arguments, call through owned EngineApi, and pop return values. ref/in/out use scoped Opaque; explicit policies are read from the same slot plans. Default long/ulong are number, explicit legal BigInt slots bigint.

## 4. GetFunction

GetFunction resolves a module/named export and returns the same kind of closed calling bridge. Both it and other C#→JS delegates use fixed signatures; **params expansion is unsupported**. Caller/owner chooses caching. Reset invalidates old delegates.

JS calling a CLR delegate Invoke is the opposite direction: out consumes zero input and returns a tuple. Do not use that tuple to implement C#→JS byref writeback, which occurs through Opaque.

## 5. Ownership and GC

A delegate retains JsMethod/funcRef even if JS drops all other references. Managed finalization queues release to the owner thread; FramePump drains it. A JS-backed delegate round trip can recover the original function without an extra reference. CLR-backed wrapper finalization queues ObjectRegistry root release, not Lua __gc execution.

Invalidated calls fail. Function identity must be stable while retained, never a moving heap address. Event add/remove must preserve CLR delegate identity. Cancel subscriptions and cross-GC cycles explicitly; neither collector alone guarantees cycle reclamation.

## 6. Errors, reentry, and validation

Nested JS/CLR calls use separate error/argument/result/Opaque frames. Callback errors become catchable JS errors after the ABI boundary; JS errors become managed script exceptions. Always release temporary values and revoke borrows, including failures/Reset.

Test implicit/explicit conversion, round-trip identity, multicast, null/undefined, byref/out, policies, nested errors, GC, event removal, Reset, and actual target ABIs. Win64 trampoline success does not establish ARM64/WASM behavior. See [lifetime](../10-LIFETIME.md).
