---
sidebar_position: 14
title: "Arrays and bytes"
---

# Arrays and bytes

CLR arrays default to identity-preserving wrappers, not JS Arrays. SZArrays and multidimensional arrays use CLR indices.

```javascript
const values = zents.new_szarray_by_element_type(zents.types.int32, 3);
values.set(0, 10);
values.set(1, 20);
console.log(values.length, values.get(0));
const copy = zents.to_array(values);
```

Use get/set rather than integer properties. to_array copies to a zero-based JS Array; modifying it does not update the CLR array.

## Inputs

Ordinary T[] parameters accept compatible wrappers, null, or dense JS Arrays with convertible elements. Array-like objects are not Arrays. Nested JS Arrays do not automatically become multidimensional CLR arrays. Present undefined elements follow element-slot rules; holes are rejected.

`zents.new_mdarray_by_spec(elementType, lowbounds, sizes)` creates multidimensional arrays. Indices respect each CLR lower bound; length is the total element count.

## Bytes

Default byte[] is a wrapper. `JsMarshalType.Bytes` selects copied Uint8Array in both directions, not UTF-8/binary strings or shared WASM storage.

to_bytes copies raw storage from accepted blittable CLR arrays, including supported multidimensional arrays. It rejects bool, char, references, and structs containing references. Layout depends on type, endianness, and ABI; do not treat it as a portable wire format.

## params and byref

Ordinary methods/constructors support expanded params elements or one compatible CLR array wrapper. Usually spread a JS Array explicitly; delegate/GetFunction bridges do not expand params.

ref/in consume input; out does not. Only out values enter the result tuple. In-place element changes are visible, but ref reassignment does not rebind a JS local. See the [array specification](../spec/marshal/07-ARRAY.md).
