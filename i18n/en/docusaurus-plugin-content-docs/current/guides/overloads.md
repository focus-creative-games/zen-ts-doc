---
sidebar_position: 10
title: "Overloads, signatures, and params"
---

# Overloads, signatures, and params

Use short names normally and full CLR signatures when an exact candidate is required. Short-name candidates freeze at binding; no runtime method-registration API exists.

For Demo.Add(int,int):

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
Demo.Add(2, 3);
Demo['Add(System.Int32,System.Int32)'](2, 3);
```

Full signatures resolve on a miss and cache, **including single-candidate methods**. Inherited and aliased methods retain exact access using the original CLR method name.

## Matching

Matching considers arity, optional defaults, conversions, declared views, generics, and params. Boolean uses no truthiness conversion; integers must be finite, integral, and in range. Required-reference undefined is not null. Equally suitable candidates are ambiguous, not selected by enumeration order.

JS number has no static int/float/long label. Use a signature to select explicitly rather than changing numeric spelling.

## params

After fixed arguments, pass zero or more elements, or one matching CLR array wrapper. JS Array/TypedArray does not automatically become the whole params array; use spread. Null participates as an element, not as a null params-array reference.

Ordinary non-params T[] still accepts dense JS Arrays or null. GetFunction/delegate bridges use fixed signatures. Generic methods can be closed explicitly with inflate. See the [selection specification](../spec/04-METHOD-OVERLOAD.md).
