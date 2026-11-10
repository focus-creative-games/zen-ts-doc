---
sidebar_position: 3
title: "Type system"
---

# Type system

This specification defines CLR type access, members, construction, and views for Mono/IL2CPP and V8/HostJs. Recommended csharp: imports and the authoritative `CSharp[assembly][fullName]` route resolve to the same type object. See [member lookup](metatable/index.md) and [marshaling](marshal/index.md).

## 1. Principles

Only public members are visible. Static and instance metadata/dispatch are separate. Binding flattens inherited members; ordinary runtime misses do not promote members from base classes. Full signatures have a restricted lazy exception. Unknown CLR properties throw zents: errors. JS method calls supply this; extracted closures do not capture it.

Mono may use reflection/Emit; IL2CPP uses metadata/invokers and compiled bridges. Observable semantics must agree.

## 2. Names and type resolution

### CSharp root

```text
CSharp
  [assembly simple name]
    [CLR full type name]
```

Assembly names omit .dll. Brackets are required for punctuation and full names containing namespaces or nesting:

```javascript
CSharp.AC = CSharp['Assembly-CSharp'];
const Demo = CSharp.AC.Demo;
const Panel = CSharp.AC['MyGame.UI.Panel'];
const Inner = CSharp.AC['MyGame.UI.Outer+Inner'];
```

Namespace dots belong to one string key, not a JS object chain. Nested types use CLR `+`, never a guessed dot conversion. Generic definitions retain backtick arity.

### Public typeArg

Accepts CLR type objects, closed type/array factory results, resolvable full CLR names including assembly-qualified/generic/array names, zents.types constants, and System.Type wrappers. Names are not limited to corlib. Plain objects cannot forge types.

GTAP is a stricter subset: System.Type wrappers only. zents.typeof accepts any ZenTS type object and returns that reflection object, including for arrays/closed generics.

```javascript
const ListDef = CSharp.mscorlib['System.Collections.Generic.List`1'];
const ListInt = zents.make_generic_type(ListDef, zents.types.int32);
const reflected = zents.typeof(ListInt);
const intArrayType = zents.make_szarray_type(zents.types.int32);
const matrixType = zents.make_mdarray_type(zents.types.int32, 2);
```

Generic arity/constraints must match. Equivalent closed types intern within a domain. SZArray and rank-one mdarray remain distinct. Resolve closed generics/arrays through factories or get_type_from_name, not direct CSharp/csharp: definition lookup.

### Lazy lookup and diagnostics

Assembly/type misses resolve and cache on first access. Missing assemblies or types throw `zents: assembly not found: ...` / `zents: type not found: ...`, never undefined. Initialize the CSharp root once per domain.

Diagnostic metadata may include __typeid, __assembly, __fullname, __name, __struct, __enum, __nullable, and ByVal/ByObj prototype associations. These are conceptual/read-only diagnostics; business code must not forge native pointers or identity. Physical keys follow the implementation, not public writable storage guarantees.

## 3. csharp: virtual modules

### Grammar

```text
csharp:assembly[/namespace-or-declaring-type]
```

The first slash separates a simple assembly name from the path. Further slashes are invalid; namespaces use dots and nesting uses plus. Empty path selects the global namespace. Preserve the absolute csharp: scheme through module normalization. Invalid examples: csharp:, csharp:/foo, csharp:asm/MyGame/UI, csharp:asm/../x.

```javascript
import { Demo } from 'csharp:Assembly-CSharp';
import { Panel } from 'csharp:Assembly-CSharp/MyGame.UI';
import { GameObject } from 'csharp:UnityEngine.CoreModule/UnityEngine';
```

Modules are synthesized by ZenTS, not business files; no default export exists.

### Namespace versus declaring type

For path P without a trailing plus:

| Condition | Result |
|---|---|
| Empty P | Global namespace |
| Public top-level types have Namespace == P | Namespace module, even if a type also has full name P |
| Otherwise type full name P exists | Declaring-type module |
| Otherwise | Empty module; assembly must still exist |

A namespace exports public nonnested definitions with exactly that namespace. A declaring-type module exports only immediate public nested types. Use a trailing `+` to force the declaring-type interpretation:

```javascript
import { Baz } from 'csharp:Assembly-CSharp/Foo.Bar';
import { Inner } from 'csharp:Assembly-CSharp/Foo.Bar+';
import { Deep } from 'csharp:Assembly-CSharp/Foo.Bar+Inner+';
```

A nonexistent forced declaring type throws. Nested types are not own properties on the outer type object, avoiding static-member collisions. Access through nested modules or full CSharp names.

### Export names

Legal short identifiers remain unchanged. Generic backticks encode as `$`: List`1 becomes List$1. A unique arity-free name may also export the same type object:

```javascript
import { List, List$1 } from 'csharp:mscorlib/System.Collections.Generic';
console.assert(List === List$1);
```

Do not add the sugar name when it collides with another export; a nongeneric Foo remains Foo, while Foo`1 uses Foo$1. Encoded duplicate names fail module creation. Unrepresentable JS IdentifierNames remain accessible through CSharp. Closed generics and arrays are not exported.

### Identity and loading

Imported types have the same reference identity as CSharp lookup. Export enumeration may create lightweight handles but must not eagerly construct unused member bindings. Missing static imports follow module linking failure; missing properties on a module namespace yield standard undefined, unlike CSharp misses.

Reserve csharp: before business loaders or third-party native modules. Missing assemblies throw without forwarding. GetFunction explicitly rejects csharp: regardless of whether a type happens to be callable.

Do not flatten every namespace into one assembly export, invent official CS namespace chains, depend on runtime .d.ts loading, or assume a public CommonJS require API. HostJs's build-time CommonJS factories are an execution detail.

## 4. Type objects and instance dispatch

A type object T holds static dispatch (STO), diagnostics, and construction. Instance dispatch (IEO) is independent, with ByVal/ByObj views, payload, finalization, and a type association.

```text
T → static method / getter / setter tables
  → construction dispatch
instance → declared-view IEO
         → CLR identity or struct copy
```

Only static members are accessible through T, except construction via new. Instance lookups do not implicitly expose static members. TypeBinding keeps separate static, ByVal, and ByObj maps. A CLR object can have several wrappers/views; cast changes the view without copying identity.

EnsureBinding collects public fields, properties, methods, constructors, flattened inherited members, and final alias names on first type use.

### Enums

Public static literals become readonly number constants. No construction, _default, or _ctor exists. Default marshaling uses underlying number even for 64-bit enums; bigint is not implicitly accepted. Explicit box produces ByObj enum identity.

### Nullable

No-value maps to null; a value uses T's representation, without a separate Nullable IEO. Use callable `N(value)` rather than relying on new returning a primitive:

```javascript
const N = zents.make_generic_type(CSharp.mscorlib['System.Nullable`1'], zents.types.int32);
Service.Take(N(42));
Service.Take(null);
```

Nullable long/ulong still default to number. BigInt does not automatically apply to the whole Nullable slot. Nullable reference annotations are not System.Nullable.

### Structs

new invokes parameterized construction and returns ByVal. `_default()` creates default(T); no equivalent _ctor field is exposed. Boxed values use ByObj. Structs have no derived-type hierarchy; value-copy and receiver-domain rules remain separate from class dispatch.

## 5. Members

| Member | Access |
|---|---|
| Public fields | obj.field / T.field; readonly writes fail |
| Nonindexed properties | Ordinary getter/setter property access |
| Indexed properties | get_Name(...) / set_Name(...) methods |
| Methods | One candidate direct, multiple dispatch; full signatures lazy |
| Events | add_Event / remove_Event; no get/set/fire event subobject |
| Constructors | new T(...), current-type public instance constructors only |

Arrays specifically use get/set, not get_Item or arr[i]. Interface/abstract/static types cannot be constructed. Use callable Nullable factories as above. Public raise/invoke methods, if present, are ordinary methods, not special event fire operations.

```javascript
const method = obj.Run;
method.call(obj, 5);
```

## 6. Inheritance

EnsureBinding flattens base public static members into the derived static map and base instance members into instance maps, applying derived hiding/override rules. Ordinary lookup searches the bound tables, not a runtime base-chain promotion path. Exact signature misses are the restricted exception.

Virtual execution still targets the actual receiver. Applicable inherited and aliased final-name candidates form one dispatch group; see [overloads](04-METHOD-OVERLOAD.md).

## 7. Generic methods

```javascript
const f = zents.inflate(ClosedType, 'Describe(T)', zents.types.int32);
const result = f.call(instance, 42);
```

The declaring type must already be closed; only method parameters are closed. inflate returns static or ByObj instance closures, not a guessed ByVal domain from an old closure. make_generic_method is removed.

GTAP supplies N System.Type wrappers before ordinary values. Valid prefix/closed-signature paths precede ordinary candidates. ByVal uses its own triggering-side GTAP. Both paths intern by closedMethod/isStatic/isByVal; constraints and missing AOT code fail explicitly.

## 8. Arrays

```javascript
const arr = zents.new_szarray_by_element_type(zents.types.int32, 10);
const matrix = zents.new_mdarray_by_spec(zents.types.int32, [0, 0], [2, 3]);
arr.set(0, 10);
const value = arr.get(0);
matrix.set(0, 1, 7);
```

length is total elements; use GetLength for each dimension. get takes rank CLR indices, set takes those indices plus value. Respect nonzero lower bounds; no integer-property mapping exists.

to_array copies SZArray elements into a zero-based dense JS Array. to_bytes copies accepted blittable array storage, including supported mdarrays, and rejects bool/char/reference-containing elements. See [arrays](marshal/07-ARRAY.md).

## 9. Special types and consistency

Interfaces/abstract/static classes have no ordinary construction; delegates have callable instances; class references are ByObj and structs ByVal unless explicitly selected otherwise.

Naming, csharp: identity, static separation, flattening, errors, events, construction, generics, arrays, and this must agree across backends. Error stack text may differ, with equivalent categories/zents: prefix.

## 10. Protocols, views, and configuration

After actual members, absent then/Symbol probes may return undefined so wrappers do not accidentally become thenables. Existing real members retain normal behavior. Diagnostics are read-only; native pointers are not forgeable identity markers.

ByObj defaults to declared views. Only legal explicit ActualTypeUserData returns select runtime views. Default 64-bit numbers and explicit BigInt do not alter enum/type-object rules.

Alias/MarshalAs/Extension XML is AOT-only, consumed at initialization/generation, without runtime registration/hot reload/Reload. Hot-update assemblies use attributes. Platform scope is listed in [alignment/status](03-ALIGNMENT.md).

## 11. Implementation responsibilities

TypeRegistry/MetaBinding resolve and bind types. Reserved module resolution synthesizes csharp: before business loading; HostJs performs this at build time. MetaBinding owns flattened member plans, dispatch owns closure execution, and array adapters provide get/set. See [IL2CPP](../impl/IL2CPP.md) and [Mono](../impl/MONO.md).
