---
sidebar_position: 3
title: "ref, in, and out marshaling"
---

# ref, in, and out marshaling

## 1. Directions

| Direction | ref/in | out |
|---|---|---|
| C#→JS delegate/GetFunction | Opaque by default | Opaque, written during callback |
| JS→CLR | Input slot, direct or temporary storage | Zero input, result tuple afterward |

Let A be the CLR element type after removing byref.

## 2. C#→JS

Register each byref in the current call's Opaque scope. get/set uses element policies: default long/ulong number, explicit BigInt bigint. in is read-only; writes fail. All handles expire on return and cannot cross await. This direction writes the original parameters through Opaque, not JS return tuples.

## 3. JS→CLR addresses

1. Valid compatible Opaque binds registered storage; readonly cannot be bypassed by forwarding in as ref.
2. Exact same-type ByVal structs provide payload storage; in grants no writes.
3. Other legal values convert into temporary A storage.

Temporary scalar/string/reference reassignment does not rebind JS locals. In-place object mutation remains visible. Byref address compatibility is stricter than reference assignability: ref object is not ref string.

T to ref Nullable&lt;T&gt; uses temporary Nullable rather than writing the original T. Primitive/enum inputs copy; BigInt applies only where annotated. Required undefined fails. Managed-reference writes into heap payloads/fields/arrays require barriers.

## 4. Zero-input out

Allocate default(A) storage without consuming input. After success, convert out values in CLR declaration order:

| Return/out | JS result |
|---|---|
| Nonvoid, no out | Ordinary result |
| Void, no out | undefined |
| Nonvoid with out | `[returnValue, out1, ...]` |
| Void with out | `[out1, ...]`, even one out |

Each result uses its own policy. Nested UnpackedValues arrays stay nested. BigInt out long/ulong is bigint only when annotated. Failure throws without a partial tuple. ref values are not appended.

```javascript
const [ok, value] = Store.TryGet(7);
const [x, y] = Store.GetPosition();
// TryGet(7, null) is not an out placeholder form.
```

Full signatures retain CLR byref types including & despite zero JS input.

## 5. Shared plans

Binding records CLR indices, JS cursors, roles, defaults, and result slots. Do not equate CLR parameter count with JS arity. Nested calls own temporaries/results independently. These rules apply to methods, constructors, and ordinary CLR delegate Invoke; fixed C#→JS bridges retain their separate rules. See [status](../03-ALIGNMENT.md).
