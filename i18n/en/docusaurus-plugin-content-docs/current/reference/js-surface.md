---
sidebar_position: 4
title: "JavaScript API"
---

# JavaScript API

`CSharp[assembly][fullClrName]` resolves CLR type objects lazily; csharp: named imports select the same objects. Use new for construction and this for instance methods.

| zents API | Purpose |
|---|---|
| `typeof(typeObject)` | System.Type wrapper |
| `get_type_from_name(fullName)` | Resolve a full CLR name |
| `make_generic_type(type, ...args)` | Close a generic type; also accepts one args Array |
| `inflate(owner, key, ...args)` | Close method generics; also accepts one args Array |
| `make_szarray_type(elementType)` | SZArray type |
| `new_szarray_by_element_type(type, length)` | SZArray by element type |
| `new_szarray_by_szarray_type(type, length)` | SZArray by array type |
| `make_mdarray_type(elementType, rank)` | Multidimensional array type |
| `new_mdarray_by_spec(type, lowbounds, sizes)` | Multidimensional array by element type |
| `new_mdarray_by_mdarray_type(type, lowbounds, sizes)` | Multidimensional array by array type |
| `to_array(szarray)` | Copy to zero-based JS Array |
| `to_bytes(array)` | Copy accepted blittable CLR array storage |
| `to_delegate(func, delegateType)` | Concrete closed CLR delegate |
| `get_opaquevalue(handle)` | Read valid call-scoped Opaque |
| `set_opaquevalue(handle, value)` | Write valid writable Opaque |
| `to_user_data(handle)` | Convert a supported borrowed value into a retainable wrapper |
| `box(typeArg, value)` / `unbox(value)` | Box / extract value |
| `cast(obj, targetType)` | Compatible declared view |
| `signature(...typeArgs)` | CLR parameter signature; also accepts one Array |
| `types` | CLR name constants, e.g. int32, long, string |

Public typeArg accepts type objects, CLR names, and System.Type wrappers. GTAP prefixes accept only System.Type wrappers.

Arrays expose length/get/set, not integer-property access. Events use add_Event/remove_Event. Ordinary member misses throw, with restricted then/Symbol protocol exceptions.

register_method and make_generic_method do not exist. Internal hooks and engine-specific handles are not public APIs. See [standard library](../spec/05-LIB.md).
