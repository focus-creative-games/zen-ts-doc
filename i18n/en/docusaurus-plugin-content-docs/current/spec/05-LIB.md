---
sidebar_position: 5
title: "zents standard library"
---

# zents standard library

zents is engine-independent. Internal hooks/SDK values are not business APIs. CSharp/csharp: expose CLR types/members; zents supplies type factories, generic closing, marshaling utilities, and array tools.

## 1. Initialization and typeArg

Install the facade with the domain. Source, embedded scripts, and zents.d.ts must match. Public typeArg accepts type objects, factory results, resolvable CLR names/AQN/generics/arrays, name constants, and System.Type wrappers. It is not limited to corlib. GTAP accepts System.Type wrappers only; plain objects cannot forge types.

## 2. Type queries

- typeof(typeObject) returns a System.Type wrapper for any ZenTS type object.
- get_type_from_name(name) resolves CLR/AQN/array/closed-generic names; failure throws type not found, not undefined.
- types contains full CLR name strings: void, bool/boolean, char, byte/sbyte, short/ushort, int/int32, uint, long/ulong, float/float32, double/float64, intptr/uintptr, decimal, object, string. These are not JS constructors or GTAP prefixes.

## 3. Generic types and methods

make_generic_type(openType, ...args) validates arity/constraints and interns a closed type within the domain. It also accepts a single args Array.

```javascript
const f = zents.inflate(closedDeclaringType, 'Describe(T)', zents.types.int32);
const result = f.call(receiver, 42);
```

inflate accepts short/open-signature keys and explicit declaring type; ambiguous short names fail. It closes method parameters only, returns static or ByObj instance closures, and does not infer ByVal from old closures. ByVal generics use their own GTAP. Cache keys include closedMethod/isStatic/isByVal, shared with GTAP. A single type-argument Array is accepted.

make_generic_method is removed. GTAP requires System.Type prefixes and applicable closed ordinary arguments; see [overloads](04-METHOD-OVERLOAD.md).

## 4. Opaque and object helpers

get_opaquevalue/set_opaquevalue validate scope and use the registered element policy: default long/ulong number, explicit BigInt bigint. Readonly/expired writes fail.

box(typeArg, value) boxes primitive/enum/struct values as ByObj, not reference types. unbox extracts by the CLR value's default policy; past BigInt input is not a persistent annotation. cast preserves identity and changes compatible views. to_user_data explicitly copies supported borrowed values into retainable wrappers; it does not extend borrowed-address lifetime or make arbitrary ref structs persistent.

## 5. Arrays

make_szarray_type(elementType) and make_mdarray_type(elementType, rank) create distinct array types; mdarray rank is 1..32.

new_szarray_by_element_type(type, length), new_szarray_by_szarray_type(type, length), new_mdarray_by_spec(type, lowbounds, sizes), and new_mdarray_by_mdarray_type(type, lowbounds, sizes) validate sizes/bounds/products and initialize default(T). Bounds/sizes are dense Arrays.

to_bytes(array) copies accepted blittable array storage to Uint8Array, including supported mdarrays; bool/char and references are rejected. to_array(szarray) copies elements into a dense zero-based Array using default policies. long/ulong elements remain number.

## 6. Delegates and signatures

Concrete delegate parameters accept callable JS values. to_delegate(fn, closedDelegateType) performs explicit conversion. Returning a JS-backed delegate can recover its original function; CLR delegates expose callable wrappers. Event removal needs stable identity.

signature(...typeArgs), or one Array, returns `(System.Int32,...)` without method name. Short names are defined at binding by Alias/AOT XML, not register_method. Cached instance closures use call(receiver).

## 7. Engine boundary and declarations

Hooks express resolution, factories, closing, boxing/views, Opaque, bytes, and calls. Implementations may use native functions or HostJs binary operations; no fixed SDK API or hook count defines the interop workload.

Declarations, C# type modules, slot accounting, and tests must change together. Removed registration/generic APIs have no compatibility fallback. See [API reference](../reference/js-surface.md).
