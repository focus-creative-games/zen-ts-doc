---
sidebar_position: 4
title: "Call JavaScript from C#"
---

# Call JavaScript from C#

`JsAppDomain.GetFunction<T>` binds a module export to a closed C# delegate. The main-thread script domain controls calls and lifetime.

```javascript
export function multiply(a, b) { return a * b; }
```

```csharp
JsAppDomain.Initialize(JsFileModuleLoader.Load);
var multiply = JsAppDomain.GetFunction<System.Func<int, int, int>>("calc", "multiply");
int result = multiply(6, 7);
```

Module names have no extension and may contain paths such as `game/calc`. A csharp: type module is not a GetFunction target. The module must be available and the export callable.

## Lifetime

Cache delegates; repeated GetFunction calls need not return the same instance. A live delegate keeps its JS function reachable. References are released according to domain lifetime; Reset invalidates old delegates, which must be reacquired.

Do not call script delegates from workers. Synchronous delegates do not automatically await Promises. Define application-level completion/task adapters explicitly and keep CLR entry on the main thread.

## Parameters and errors

Marshal against the fixed delegate signature, without ordinary-method params expansion. C#→JS ref/out/in use call-scoped Opaque handles; in is read-only, and handles expire when the call returns. See [byref](ref-out-in.md).

JS failures become diagnostic managed script exceptions. JS try/catch can catch translated CLR callback errors. Stack text need not match across engines; exceptions must not unwind directly across native callback ABIs.
