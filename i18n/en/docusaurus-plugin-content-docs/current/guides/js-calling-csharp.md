---
sidebar_position: 3
title: "Call C# from JavaScript"
---

# Call C# from JavaScript

The first access binds a CLR type. Short names freeze after binding; full CLR signature keys resolve lazily and cache. Ordinary public JS properties cannot forge CLR identity.

## Types and members

```javascript
const Counter = CSharp['Assembly-CSharp']['Counter'];
const counter = new Counter(10);
counter.Value = 20;
const value = counter.Add(2);
const invoke = counter.Add;
invoke.call(counter, 3);
```

Use full CLR names for namespaced types, such as `CSharp['Assembly-CSharp']['Game.Counter']`, or generated `csharp:` imports. Instance methods read JS this; static methods belong to type objects.

Read/write properties and fields normally. Use `get_Item`/`set_Item` for corresponding indexers and get/set for arrays. Events expose `add_Event`/`remove_Event`; retain and unsubscribe the same handler.

## Lookup and errors

Unknown CLR members throw. Absent then/Symbol protocol probes have specific exceptions after real member lookup. Arbitrary property reads are not a safe CLR-member existence test.

Inherited members are flattened during binding. Declared-type views determine visibility; `zents.cast(obj, TargetType)` requests a compatible view, not unrestricted access to runtime-type members.

## Overloads and generics

Use short names normally and full signatures for exact selection. Generic methods use `zents.inflate` or System.Type prefixes. See [overloads](overloads.md) and [generics](generics.md).

## Publishing

Lazy binding still needs metadata and AOT code. Stripped types, missing generic instantiations, or missing bridges can fail in Players even when Editor reflection succeeds. Generate configuration and test the target Player.
