---
sidebar_position: 17
title: "Common zents utilities"
---

# Common zents utilities

zents is the shared script facade. Internal hooks, V8 handles, and WASM tokens are not business APIs.

## Types and generics

```javascript
const Int32 = CSharp['mscorlib']['System.Int32'];
const systemType = zents.typeof(Int32);
const listType = CSharp['mscorlib']['System.Collections.Generic.List`1'];
const IntList = zents.make_generic_type(listType, Int32);
```

typeof returns a CLR System.Type wrapper; get_type_from_name resolves a full CLR name. `inflate(owner, key, ...typeArgs)` closes method generics.

## Arrays

```javascript
const array = zents.new_szarray_by_element_type(zents.types.int32, 2);
array.set(0, 5);
const values = zents.to_array(array);
```

make_szarray_type/make_mdarray_type create array types. new_mdarray_by_spec accepts lower bounds and lengths. to_array and to_bytes copy; they do not change default wrapper rules.

## Objects and calls

box/unbox manage boxed values; cast selects compatible views; to_delegate creates a specified CLR delegate. Opaque get/set are call-scoped; to_user_data still checks type and lifetime.

signature builds a CLR parameter signature; types provides name constants. register_method and make_generic_method are removed. See the [API reference](../reference/js-surface.md).
