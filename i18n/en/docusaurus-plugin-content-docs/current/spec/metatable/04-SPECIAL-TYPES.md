---
sidebar_position: 5
title: "Special-type dispatch"
---

# Special-type dispatch

## Enums

Readonly number constants; no construction/_default/_ctor. box creates ByObj enum identity. Defaults remain underlying number, without extending long/ulong BigInt policies to enums.

## Nullable

No value is null; values use T representation without independent Nullable IEO. Use N(value), not a contract that new returns primitives. Legal enum Nullable input does not require enum construction. Nullable long/ulong remain default number; whole-Nullable BigInt is not implied.

## Structs

new T invokes public construction and returns ByVal; T._default creates default(T). No _ctor exists. Boxed ByObj and ByVal use their own closures; extracted methods need call(receiver).

## Arrays

Use the full zents.new_szarray/new_mdarray factory names, not generic new on array types. Arrays are ByObj. length is total elements; get takes rank CLR indices, set adds value. Check integral number indices/lower bounds and reject bigint indices. No JS Array-style arr[i] promise exists. Elements use default/legal policies, with 64-bit defaults number.

## Delegates

CLR delegate wrappers are callable as Invoke without an extra instance receiver. JS-backed delegates retain function identity on round trip. JS→CLR Invoke uses zero-input out tuples; C#→JS bridge uses Opaque. Do not mix directions.

## References

Classes use ByObj, interfaces declared interface views. Abstract/interface/static types cannot construct. Virtual execution still targets actual objects. ActualTypeUserData changes only legal reference returns, not defaults globally.

Physical V8 fields/proxies/tokens do not alter these rules. Diagnose unsupported host capabilities explicitly. See [types](../02-TYPE-SYSTEM.md).
