---
sidebar_position: 2
title: "JsMarshalAs and legal policies"
---

# JsMarshalAs and legal policies

## 1. Positions and values

Legal positions are parameters, returns, fields, properties, and supported nongeneric classes/structs—not the method itself. Generic member definitions may carry rules, validated against closed slot types.

```csharp
public enum JsMarshalType
{
    Default = 0, Object = 1, Bytes = 2, OpaqueValue = 3,
    UnpackedValues = 4, Table = 5, ActualTypeUserData = 6, BigInt = 7,
}
```

JsMarshalAsAttribute has a policy constructor (Default by default), readonly JsMarshalType, and writable string[] Members. Object means CLR wrapper representation, not ordinary JS object or universally boxed structs.

## 2. Legal sets beyond Default

| CLR type | Allowed policies |
|---|---|
| bool/char/8–32-bit integers/floats | None |
| Int64/UInt64 member slots | BigInt |
| IntPtr/UIntPtr | None |
| string | Object, OpaqueValue; no Bytes |
| byte[] | Object, Bytes, OpaqueValue, legal return ActualTypeUserData |
| Other arrays/class/interface/object | Object, OpaqueValue, legal return ActualTypeUserData |
| struct | Object, OpaqueValue, Table, UnpackedValues |
| Nullable&lt;struct&gt; | Object, OpaqueValue, Table; no UnpackedValues |
| enum | OpaqueValue; not BigInt based on underlying type |
| delegate | Object, OpaqueValue; Object retains callable routing |
| Unmanaged/function pointer | OpaqueValue; Default is Pointer |
| TypedReference | Default Opaque, explicit Opaque equivalent |
| decimal/ref struct | Only explicitly supported Opaque paths |

Opaque controls CLR→JS borrowing, not permissive JS→CLR inputs. ActualTypeUserData is only a return policy for default-ByObj references, not parameters/fields/properties/types, declared string returns, or structs.

BigInt is legal on concrete long/ulong parameters, returns, fields, properties, and byref elements. It is not type-level or array-wide. Outer byref remains a borrow; value get/set/out applies the element policy.

## 3. Errors and generics

Invalid Editor attributes log member/type/reason and fall back to Default. Invalid XML/generation rules fail loading/build. Do not silently alter default numbers or apply actual-type policies to illegal slots.

Type-level policies do not propagate from generic definitions. Member rules match definition identity and validate after inflate/GTAP closing; unresolved slots are not assumed legal.

## 4. Table and UnpackedValues

Members is an ordered list of public CLR field/property names, with required getters/setters for each direction. Convert nested members under their own legal policies, not guessed layouts.

Table maps one JS object, with Nullable null bypassing members. UnpackedValues parameters consume N inputs; return/out slots produce one N-element Array, nested inside any out tuple. C#→JS explicit by-value expansion uses the same plan as declarations; it cannot bypass byref borrowing. GC tracks managed-reference copies and barriers.

A Table member suffix `?` permits a missing own property to retain default. Present undefined still validates normally. Required missing keys fail. UnpackedValues forbids `?`.

## 5. params and precedence

Ordinary methods/constructors follow common params rules: zero or more elements, or one compatible CLR array wrapper; spread JS Arrays. No params policy changes a whole long[] into BigInt elements. Delegate/GetFunction expansion is unsupported.

Precedence: member attribute, corresponding AOT XML, legal type-level attribute/XML, Default. Inheritance/generic-definition matching and closed validation agree across backends.

## 6. AOT XML

Settings.marshalAsXmlPaths uses ZenTSMarshalAs, separately from Alias/Extension. XML only configures AOT assemblies: session snapshots and generated Player tables, never runtime registration/hot reload/Reload.

```xml
<ZenTSMarshalAs version="1">
  <Assembly name="Assembly-CSharp">
    <Type fullName="Counter">
      <Method name="GetExact" signature="()">
        <Return><MarshalAs type="BigInt" /></Return>
      </Method>
      <Method name="SetExact" signature="(System.Int64)">
        <Param index="0"><MarshalAs type="BigInt" /></Param>
      </Method>
    </Type>
  </Assembly>
</ZenTSMarshalAs>
```

Param uses zero-based CLR indices, not expanded JS slots; extension self is CLR index 0 even though JS exact signatures omit it. Locate Return/Param/Field/Property explicitly, not a policy directly on Method.

Duplicate slots fail; attributes precede valid XML. Generic members use definition containers, validated when closed, not closed-type XML containers. Baking tokens/IDs/tables is implementation-specific.

ActualTypeUserData/BigInt are implemented in policies, parsers, writers, overload checks, and declarations. Position restrictions still apply. See [status](../03-ALIGNMENT.md).
