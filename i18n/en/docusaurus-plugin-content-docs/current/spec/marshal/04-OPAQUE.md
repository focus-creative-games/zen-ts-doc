---
sidebar_position: 10
title: "OpaqueValue borrowing"
---

# OpaqueValue borrowing

OpaqueValue exposes controlled access to CLR parameter storage during one C#→JS call. It is a borrowed token, not a persistent address or ordinary CLR wrapper.

## 1. Representation and creation

Use an opaque object/internal handle with generation/index and no CLR member dispatch. It is scoped, not a long-lived ObjectRegistry entry. JS cannot forge valid handles.

Byref ref/in/out defaults to Opaque. Explicit OpaqueValue is legal only on supported by-value types; primitive/IntPtr by-value policies are not allowed. For byref, the scope tracks referenced element storage. The policy controls C#→JS, not unrestricted JS inputs.

## 2. Lifetime

Valid only until the creating C#→JS call returns. Read, write, or forward synchronously according to target rules. Later calls, timers, closures, Promise/await, and expired generations fail with a diagnostic invalid-handle error. Exceptions revoke scopes too; nested scopes remain independent.

to_user_data copies supported borrowed values into retainable wrappers, not an extension of the original address lifetime. It cannot make unsupported ref structs persistent.

## 3. get/set

get_opaquevalue resolves storage and pushes with its registered element policy. set_opaquevalue converts and writes with that policy. Default long/ulong remains number; explicit BigInt uses bigint with complete range checks. Byref is dereferenced before conversion. in is read-only and cannot be forwarded as writable ref.

```javascript
export function onRefInt(h) {
  zents.set_opaquevalue(h, zents.get_opaquevalue(h) + 10);
}
```

Invalid/expired/non-Opaque handles fail; no CLR members are available through dot/index access.

## 4. Forwarding JS→CLR

| Target | Handling |
|---|---|
| Managed reference by value | Compatible Opaque can be resolved implicitly |
| Ordinary struct by value | Compatible Opaque can be resolved/copied |
| Primitive/enum/IntPtr by value | Read get_opaquevalue first; no implicit Opaque probe |
| ref/in A | Exact compatible storage/permissions may bind directly |
| out | No input slot, so no Opaque placeholder |

Primitive hot-path conversion does not inspect arbitrary Opaque tokens. Default struct by-value output is ByVal; explicit Opaque/byref selects borrowing. A copied ByVal is separate from its borrow.

See [byref](03-BYREF.md), [structs](05-STRUCT.md), and [lifetime](../10-LIFETIME.md).
