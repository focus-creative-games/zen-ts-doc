---
sidebar_position: 15
title: "Generic types and methods"
---

# Generic types and methods

Close type and method generics separately. Editor reflection does not establish that a corresponding AOT instantiation exists.

## Generic types

```javascript
const List = CSharp['mscorlib']['System.Collections.Generic.List`1'];
const IntList = zents.make_generic_type(List, zents.types.int32);
const values = new IntList();
values.Add(7);
```

Public typeArg accepts CLR type objects, full CLR type names, and System.Type wrappers. zents.types.int32 is a name constant, not a JS number constructor.

## Generic methods

For `static T Echo<T>(T value)`:

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
const echoInt = zents.inflate(Demo, 'Echo', zents.types.int32);
echoInt(7);
```

inflate takes an already closed declaring type and a method key, and closes only the method's generic parameters. Call static closures directly and instance closures with `.call(receiver, ...)`.

The generic type argument prefix (GTAP) is another option:

```javascript
const Int32 = CSharp['mscorlib']['System.Int32'];
Demo.Echo(zents.typeof(Int32), 7);
```

**GTAP accepts only System.Type wrappers**, not type-name strings or arbitrary JS values. zents.typeof is not the JavaScript typeof operator.

## Constraints and selection

Validate constraints, closed declaring types, and overload competition. Use inflate/full signatures when ambiguous. make_generic_method has been removed.

IL2CPP needs preserved closed types/methods and bridges; typeArg cannot generate native code at runtime. See [types](../spec/02-TYPE-SYSTEM.md) and [overloads](../spec/04-METHOD-OVERLOAD.md).
