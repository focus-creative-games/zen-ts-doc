---
sidebar_position: 11
title: "ref, out, and in"
---

# ref, out, and in

The two calling directions use different representations. Do not copy C# out placeholders into JavaScript calls.

## JavaScript → C#

```csharp
public static int Split(int value, out int twice)
{
    twice = value * 2;
    return value;
}
```

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
const [result, twice] = Demo.Split(5); // [5, 10]
```

out consumes **no input**. Results are `[returnValue, out1, ...]`, or `[out1, ...]` for void. Without out, the ordinary return shape remains. Do not pass null placeholders. Nested UnpackedValues arrays remain nested.

ref/in consume input. A compatible Opaque or exact ByVal struct may provide direct storage; other legal values use temporary storage. Reassignment of a temporary does not rebind the JS local and **does not add a result-tuple element**. In-place object/array modifications remain visible.

## C# → JavaScript

ref/out/in are call-scoped Opaque handles:

```javascript
export function fill(output) {
  zents.set_opaquevalue(output, 42);
}
```

Read with get_opaquevalue and write with set_opaquevalue. in is read-only. Handles expire when this call returns; retaining them across Promise/await is invalid and must fail.

Policies such as BigInt apply to legal byref element slots, not the handle token. See the [byref specification](../spec/marshal/03-BYREF.md).
