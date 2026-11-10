---
sidebar_position: 1
title: "Default marshaling rules"
---

# Default marshaling rules

Explicit JsMarshalAs overrides legal defaults. CLR plans contain no engine SDK values; wrapper/view/borrow semantics are engine-independent.

## 1. null and undefined

| Situation | Result |
|---|---|
| CLR null/Nullable no value → JS | null |
| CLR void → JS | undefined |
| JS null → reference/Nullable | null/no value |
| Required ordinary reference/nonnullable value ← undefined | Missing/mismatch failure |
| Nullable ← undefined | No value |
| Optional missing/undefined | Cached CLR default |
| Omitted params tail | Empty array |
| JS→CLR out | No input slot |

Undefined retains its argument position. Plain JS missing properties return undefined; CLR misses throw. Table checks own-property presence separately from present undefined.

## 2. Numbers

bool is boolean; char and integer types are integral number; Single/Double are number. Int64/UInt64 default to number with possible precision loss. IntPtr/UIntPtr/nint/nuint use pointer-width numbers, distinct from pointer tokens. Enums use underlying numbers even when 64-bit.

Integer reads require number, finite/integral value, and target range, not strings/bigint. Int64 checks `[-2^63, 2^63)` and UInt64 `[0, 2^64)` so rounded double maxima cannot admit overflow. Values beyond safe JS precision can round; receiving a rounded number cannot recover the original integer.

Explicit BigInt applies only to concrete long/ulong slots and legal byref elements: exact bigint output, bigint-only input, full signed/unsigned range checks. Do not extend to enums, IntPtr, object, whole arrays, or global type defaults. Valid direct Opaque storage remains address-bound; converted values use the slot policy.

```csharp
[return: JsMarshalAs(JsMarshalType.BigInt)]
public static long GetExactCounter() => long.MaxValue;
public static void SetExactCounter([JsMarshalAs(JsMarshalType.BigInt)] long value) { }
```

```javascript
Counter.SetExactCounter(9223372036854775807n);
```

## 3. Type matrix

| CLR type | CLR→JS | JS→CLR |
|---|---|---|
| string | string/null | String, compatible wrapper, null |
| class/interface/object | Declared-view ByObj/null | Compatible wrapper/null; object supports specified primitive boxing |
| enum | number | In-range number or compatible boxed wrapper |
| struct | Default ByVal; explicit Opaque where legal | Compatible value/boxed/Opaque under struct rules |
| Nullable&lt;T&gt; | null or T representation | null/undefined or convertible T |
| T[] | ByObj/null | Wrapper, dense JS Array, null |
| mdarray | ByObj/null | Compatible wrapper/null only |
| delegate | Original JS function or callable wrapper/null | Callable, compatible delegate, null |
| Unmanaged/function pointer | Pointer token/null | Compatible token/null |
| TypedReference | Opaque | Compatible Opaque only |
| decimal/ref struct | No ordinary default by-value promise | Only explicitly supported paths |

object does not guess long versus ulong from bigint. Define concrete annotated slots for exact 64-bit values.

## 4. Arrays and results

Ordinary SZArray inputs accept dense zero-based JS Arrays, converted/copied elementwise; holes fail. TypedArrays are not universal CLR arrays. Bytes defines only byte[]/Uint8Array.

Without out retain ordinary return shape; with out use `[ret, out1, ...]` or `[out1, ...]` for void. Each return/out is one logical result, including nested UnpackedValues arrays, never recursively flattened.

## 5. Configuration

Legal member attributes precede AOT XML, then legal nongeneric type policies and Default. No XML for hot-update assemblies or runtime registration/reload. See [policies](02-MARSHAL-AS.md).
