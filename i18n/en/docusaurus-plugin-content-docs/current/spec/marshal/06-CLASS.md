---
sidebar_position: 12
title: "Class and interface marshaling"
---

# Class and interface marshaling

## 1. Default forms

References use identity-preserving ByObj wrappers with CLR GC roots and declared-type IEO views. Null maps to null; required undefined fails. Arrays/delegates have additional behavior in their own specifications.

Declared string outputs JS string; declared object containing a runtime string remains a System.Object view, not automatic JS string. Interfaces use interface views. Nullable reference annotations do not change CLR reference types.

## 2. Identity and view

Identity is the actual CLR reference; viewType controls visible members. Cache by `(identity, viewType)`. Virtual methods dispatch against the actual receiver; nonvirtual/new-hidden members follow declared slots.

```javascript
const baseView = ObjectFactory.CreateChild();
const childView = zents.cast(baseView, Child);
```

cast validates compatibility and produces the target view without creating a new CLR instance. Do not hold only an untracked native object address.

object inputs accept supported primitive boxing and compatible wrappers, not guessed bigint-to-long/ulong. Interfaces expose their own/inherited interface members.

## 3. Policies

Table/UnpackedValues are illegal for class/interface; invalid attributes follow fallback rules and generation errors fail. Object/Opaque are legal where specified. Object on string yields a CLR String wrapper. Bytes belongs to byte[], not System.String.

ActualTypeUserData is legal only on default-ByObj reference return slots. It selects actual runtime views while preserving identity; runtime string remains a String wrapper, null remains null. Declared string/struct returns, parameters, fields, properties, and type-level use are illegal.

## 4. byref

JS→CLR ref/in binds exact compatible Opaque storage or uses a temporary reference slot from legal wrapper/string/null inputs. Reassigning it does not change a JS local; mutating a shared object is visible. Required undefined fails. out consumes no input and enters the result tuple.

C#→JS ref/in/out uses call-scoped Opaque, with in readonly. No result-tuple writeback in that direction.

## 5. this and consistency

Methods require valid this; extraction does not bind it. Push/pop, identity/view caching, cast, Opaque, errors, and write barriers agree across backends. See [lifetime](../10-LIFETIME.md), [arrays](07-ARRAY.md), and [functions](09-FUNCTION.md).
