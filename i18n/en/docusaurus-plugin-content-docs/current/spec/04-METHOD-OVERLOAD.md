---
sidebar_position: 4
title: "Method overloads"
---

# Method overloads

## 1. Binding domains

One final-name candidate yields a direct closure; multiple candidates yield dispatch. Short names freeze. Full-signature keys resolve on a miss and cache, even for one candidate. Static, ByObj instance, and ByVal instance domains are independent.

Real instance and configured extension methods compete together; no extra instance-first rule exists. Final names follow attribute Alias, AOT XML Alias, then CLR name. Aliases replace, not duplicate, short names. Constructors use only current-type declarations.

## 2. Applicability and slots

Check applicability before better-member comparison. Never select by metadata enumeration order or a total score that hides per-argument tradeoffs.

| Parameter | JS input |
|---|---|
| Ordinary/ref/in | One normally; Members count for UnpackedValues |
| out | Zero; result tuple afterward |
| Optional tail | Missing/undefined selects cached CLR default |
| params | Zero or more remaining elements, or one assignable CLR array wrapper |

Missing required/excess arguments fail. Direct, dispatch, constructors, and ordinary delegate Invoke share slot calculation. Undefined retains its position. Null matches legal references/Nullable; see [defaults](marshal/01-OVERVIEW.md).

params omission produces empty T[]. JS Array/TypedArray is not the entire params array; spread explicitly, unless T itself accepts it as one element. Null is an element, not a null array: params string[] may accept one null, params int[] does not. Delegate/GetFunction bridge expansion is unsupported.

## 3. Conversions and better member

Default long/ulong use number, not bigint. Explicit BigInt slots accept bigint only with complete range checks. No cross-conversion silently mixes these channels. Boolean/string/wrapper rules are strict; conversion classification does not allocate boxes before selection.

Identity is better than ImplicitNumeric, ImplicitEnum, NullLiteral, ImplicitReference, and ImplicitBoxing according to the common comparison rules. A candidate wins conversions only if at least one argument is better and none worse.

For equal conversions, compare in order:

1. Fewer optionalUsed.
2. paramsExpanded = 0, without expansion.
3. paramsKind = 0, non-params.

Remaining ties are ambiguous. Diagnostics may sort candidates but must not resolve true ambiguity.

## 4. Lazy full signatures

Keys are `CLRMethodName(Type.FullName,...)`, without return type. Extension signatures omit self; byref uses `&`; open generic parameter names remain in open signatures. Alias does not rename the CLR key.

On an ordinary miss containing `(`, search public methods in the current/base chain in the correct static/instance domain, excluding constructors, cctors, and property accessors. Create/cache direct or GTAP closures on the triggering side. This is restricted signature lookup, not arbitrary miss-time reflection promotion.

```javascript
const direct = obj['Run(System.Int32)'];
direct.call(obj, 5);
obj['Run(System.Int32)'](5);
```

## 5. GTAP and inflate

An open generic candidate accepts N System.Type wrappers before ordinary inputs, where N is method generic arity. Type objects, strings, and zents.types constants are not valid GTAP prefixes; convert type objects with zents.typeof.

A valid prefix plus applicable closed signature takes the generic path; otherwise consider ordinary nongeneric candidates. Constraints and missing AOT code fail explicitly. GTAP/inflate share an intern key including closedMethod/isStatic/isByVal.

signature(...typeArgs) builds only `(System.Int32,...)`; prepend the CLR method name for a key. Signatures still include out CLR parameter types despite zero JS input slots.

## 6. Alias, this, and configuration

Alias XML is Settings.jsAliasXmlPaths, root JsAlias, separate from other XML. Same-slot duplicates fail; different methods may share aliases. XML applies only at AOT session/build time, not registration/Reload.

Instance/extension calls use this; extracted closures do not bind receivers. Static closures need no instance. register_method and make_generic_method are removed; use Alias, signatures, and inflate.

## 7. Examples and consistency

```csharp
public static int Sum(params int[] values) { return 0; }
public static bool TryGet(int key, out string value) { value = null; return false; }
```

```javascript
Demo.Sum(1, 2, 3);
Demo.Sum(...[1, 2, 3]);
const [ok, value] = Demo.TryGet(7);
```

Slots/defaults/penalties/constraints/views/errors must match Mono/IL2CPP and V8/HostJs, regardless of Emit, invoker, or specialized bridge implementation. See [status](03-ALIGNMENT.md).
