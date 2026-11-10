---
sidebar_position: 14
title: "Enum marshaling"
---

# Enum marshaling

Enums default to integral number, not wrappers or bigint—even with Int64/UInt64 underlying types.

## 1. Type constants and values

Public static enum literals are readonly number properties on the enum type object. No new/_default/_ctor exists. Default CLR→JS converts underlying integer to number; JS→CLR validates finite integral number and underlying range. Valid values need not be declared enum names, supporting flags/combined values.

Reject names as strings, booleans, plain objects, and bigint. Complete 64-bit precision is not guaranteed by number; BigInt on concrete long/ulong slots does not make enum policy legal.

## 2. Boxing

```javascript
const Color = CSharp['Assembly-CSharp']['MyGame.Color'];
const boxed = zents.box(Color, Color.Red);
const value = zents.unbox(boxed);
```

Boxing creates ByObj enum identity; unbox yields its default number representation. Compatible boxed enums can be passed where allowed. No enum ByVal constructor is introduced.

## 3. byref and policies

ref/in may bind exact valid Opaque storage; ordinary numeric/boxed values use temporaries, so reassignment does not rebind JS locals. JS→CLR out consumes no input and returns number in its tuple. C#→JS byref uses Opaque.

Default is number; legal OpaqueValue controls C#→JS borrowing. Object by-value is illegal and follows attribute/generation error rules. Table/UnpackedValues/BigInt are not enum policies.

## 4. Consistency

Constants, bounds, boxing, byref, bigint rejection, and diagnostic categories must match backends. See [defaults](01-OVERVIEW.md), [policies](02-MARSHAL-AS.md), and [byref](03-BYREF.md).
