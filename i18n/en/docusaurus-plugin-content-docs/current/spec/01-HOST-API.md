---
sidebar_position: 2
title: "Host API"
---

# Host API

## 1. JsAppDomain

ZenTS.Common does not reference concrete backend assemblies. It creates an IJsRuntime implementation for the environment.

```csharp
public interface IJsRuntime
{
    void Initialize(Func<string, object> moduleLoader);
    void Reset(Func<string, object> moduleLoader);
    void ProcessPendingRefReleases();
    Delegate GetFunction(Type delegateType, string jsModule, string jsExportName);
}
public static class JsAppDomain
{
    public static void Initialize(Func<string, object> moduleLoader);
    public static void Reset(Func<string, object> moduleLoader);
    public static void ApplyPendingResetNow();
    public static T GetFunction<T>(string jsModule, string jsExportName)
        where T : MulticastDelegate;
}
```

Editor uses Mono/V8, native Player IL2CPP/V8, and WebGL/WeChat IL2CPP/HostJs. No public Shutdown or manual backend injection exists.

### Domain reset

Initialize creates the unique domain and rejects repeated initialization. Reset in Play Mode schedules teardown/rebuild at EndOfFrame; the last request in a frame wins. Editor edit/batch mode applies synchronously. ApplyPendingResetNow applies a pending reset at a safe main-thread boundary.

Drain releases, invalidate the old generation, tear down modules/bindings/persistent references/resources, then create the new domain. Process-level bridge registration/AOT tables do not accept XML changes through Reset. Old delegates/wrappers become invalid.

HostJs retains the platform VM. Business-owned wx events/timers must be removed explicitly if not domain-managed.

### Loader and pump

moduleLoader(canonical) returns supported module sources, commonly string. Canonical names omit .js; runtime does not load TS. Object return type is not arbitrary-format support. Failures are diagnostic; csharp: is intercepted before business loaders.

V8 uses module APIs; HostJs executes prebuilt factories. Finish asynchronous bundle/subpackage loading before synchronous entry; do not block a callback waiting for network or depend on eval.

LateUpdate drains releases; EndOfFrame applies reset. Adapters advance microtasks at safe boundaries.

### AOT XML

Alias, MarshalAs, and Extension XML apply only to AOT assemblies. Editor initialization snapshots them; Player generation bakes tables. Hot-update assemblies use attributes. There is no RegisterAliasXml/RegisterMarshalAsXml/RegisterExtensionXml, Reload, or other runtime XML registration. Reset/Assembly.Load cannot activate new XML.

## 2. GetFunction

Bind a ready module's callable named export to a concrete closed delegate after Initialize. Cache it; repeated lookups need not return identical delegates.

```csharp
var add = JsAppDomain.GetFunction<Func<int, int, int>>("app", "add");
int sum = add(10, 20);
```

```javascript
export function add(a, b) { return a + b; }
```

Uninitialized domains, unavailable modules/exports, noncallables, and missing AOT bridges fail explicitly. Do not return null delegates or incompatible bridges.

C#→JS ref/in/out use call-scoped Opaque get/set. Synchronous delegates do not await Promise. Delegate/GetFunction params expansion is unsupported.

## 3. Attributes

JsMarshalAs applies to legal parameters, returns, fields, properties, and nongeneric type-level positions. Open generic member rules validate after closing. Invalid Editor attributes log and fall back to Default; XML/generation errors fail hard. See [policies](marshal/02-MARSHAL-AS.md). Int64/UInt64 default to number; BigInt is explicit.

JsAlias replaces the default short name, without dual registration. Different methods may share an alias and compete. Attributes precede valid AOT XML. Frozen short names cannot be rewritten from scripts; exact signatures remain available lazily.

## 4. Callback and exception boundary

Business members need no per-member callback attribute. Editor callbacks pass through owned adapters; managed exceptions cannot unwind across native callbacks.

| Direction | Failure behavior |
|---|---|
| C#→JS | Diagnostic JsScriptException or equivalent managed error |
| JS→CLR | Error catchable by JS try/catch |
| Nested calls | Independent errors, parameters, and result frames |
| Expired Opaque | Read/write/pop fail, never dereference stale storage |

Error categories and zents: prefix are stable; full stack text need not match engines.

## 5. Calling plans

Defaults materialize at binding, not from metadata blobs on each call. JS→CLR out consumes zero input and returns tuple entries. Matching and invocation share params/UnpackedValues slot accounting across Mono/IL2CPP.
