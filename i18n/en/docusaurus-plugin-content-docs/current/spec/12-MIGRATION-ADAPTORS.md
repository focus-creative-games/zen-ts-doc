---
sidebar_position: 12
title: "Migration and compatibility adapters"
---

# Migration and compatibility adapters

Adapters may change business syntax, not overloads, views, lifetimes, or XML scope. Retired APIs have no second compatibility semantics.

## Replacements

| Previous design | Current contract |
|---|---|
| Eagerly attach every full signature | Restricted lazy public-signature resolution/cache |
| register_method(name, closure) | Binding-time Alias/AOT XML; cache closures and call with receiver |
| make_generic_method(closure, ...types) | inflate(closedType, key, ...types), or GTAP |
| Reject System.Type as typeArg | Public typeArg accepts it; GTAP requires it |
| Single params-array slot only | Expanded tail or matching CLR array; spread JS Arrays |
| out placeholders | Zero input, tuple output |
| Default/forbidden bigint | Default number plus explicit concrete BigInt slots |
| Runtime XML registration | AOT-only configuration; attributes for hot-update assemblies |
| Engine SDK API in CLR core | Owned EngineApi with V8/HostJs adapters |

## Types and cached methods

Use CSharp[assembly][fullName] or csharp: imports. Business aliases are ordinary JS objects; the core does not guess namespace chains or convert nesting plus to dots.

```javascript
const run = obj['Run(System.Int32)'];
run.call(obj, 5);
const f = zents.inflate(MyClosedType, 'Describe(T)', zents.types.int32);
const text = f.call(instance, 42);
```

Do not rewrite frozen member tables for caching. inflate makes static/ByObj intent explicit; ByVal generics use their own GTAP, not ByObj closures.

## Results and configuration

```javascript
const [ok, value] = Store.TryGet(key);
const approx = Store.GetCounter();       // default long: number
const exact = Store.GetExactCounter();   // explicit BigInt: bigint
```

Only explicit slots become TS bigint. Default large numbers can round; change CLR annotations/declarations when exactness is needed.

Remove runtime XML registration/Reload dependencies. Initialize/generation consumes AOT configuration; Reset or Assembly.Load cannot activate XML dynamically.

## Engines and testing

Business code must not carry SDK values/handles or depend on removed refcount layouts. Native extensions adapt separately; V8 does not promise Node addons. Unsupported targets fail explicitly.

Compare returns, candidates, views, writeback, and errors on common fixtures. Record capability-based skips separately, without skipping core methods/delegates/Opaque to claim support.
