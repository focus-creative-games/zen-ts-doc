---
sidebar_position: 13
title: "Array marshaling"
---

# Array marshaling

CLR arrays default to ByObj wrappers with identity and roots. SZArrays, mdarrays, byte[], and ordinary JS Arrays remain distinct.

## 1. Matrix

| CLR slot | CLR→JS | JS→CLR |
|---|---|---|
| T[] | Wrapper/null | Compatible wrapper, null, dense JS Array |
| Mdarray, including non-SZ rank one | Wrapper/null | Compatible wrapper/null only |
| byte[] Default | SZArray rules | SZArray rules |
| byte[] Bytes | Copied Uint8Array/null | Uint8Array/null under Bytes rules |

Required undefined fails; optional/Nullable rules remain. Holes fail; present undefined elements validate by element slot. Array-like objects are not JS Arrays.

## 2. Access and copies

Use get(i,...), set(i,...,value), and length, not integer properties. Check each CLR lower bound/length; length is total elements. Element conversion follows declared type. GetValue returns boxed object and may differ from specialized get.

JS Array→SZArray allocates/copies T[n] in zero-based order; empty produces T[0], null remains null. Nested Arrays do not infer mdarray shape/bounds.

```javascript
const array = zents.new_szarray_by_element_type(zents.types.int32, 2);
array.set(0, 7);
const copy = zents.to_array(array);
```

## 3. Bytes and utilities

Bytes only defines byte[]/copied Uint8Array, never UTF-8/binary strings. It does not accept arbitrary Arrays/CLR wrappers. Default byte[] remains a wrapper.

to_array(szarray) copies into a dense zero-based JS Array using default element policies; long/ulong remain number. to_bytes(array) copies accepted blittable storage, including supported mdarrays, and rejects bool/char/references/reference-containing structs. Layout is ABI/endianness-dependent, not a portable protocol.

No shared-heap promise exists. Refresh internal views after WASM growth; business code cannot retain invalid old heap views.

## 4. Factories

make_szarray_type/make_mdarray_type create types. new_szarray_by_element_type/new_szarray_by_szarray_type create SZArrays. new_mdarray_by_spec/new_mdarray_by_mdarray_type accept dense lower-bound/size Arrays. Validate rank, bounds, lengths, products, and allocation size; elements initialize to default(T).

## 5. params

Ordinary methods/constructors accept zero or more elements or one assignable CLR array wrapper after the fixed prefix. JS Array/TypedArray is not automatically the whole params array; spread it explicitly. If T accepts that form it can be one element. Null is an element, not null-array shorthand. Delegate/GetFunction expansion is unsupported.

## 6. byref and policies

ref/in use input references/temporaries. In-place mutations are visible; temporary ref reassignment does not rebind JS locals and is not appended to results. out uses zero input and declaration-order tuples. C#→JS uses Opaque, with readonly in and call expiry.

Object generally matches wrapper defaults; Opaque is directional borrowing; ActualTypeUserData is return-only. BigInt cannot annotate whole long[]/ulong[] arrays. Root/barrier writes and failure categories agree across hosts. See [byref](03-BYREF.md) and [overloads](../04-METHOD-OVERLOAD.md).
