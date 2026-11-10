---
sidebar_position: 16
title: "Extension methods"
---

# Extension methods

Configured CLR static extension methods become instance candidates on the extended type. ZenTS does not scan all assemblies or treat arbitrary static functions as extensions.

## Attribute

```csharp
using ZenTS;
[JsExtension(typeof(CounterExtensions))]
public sealed class Counter { public int Value; }
public static class CounterExtensions
{
    public static int Plus(this Counter self, int amount) => self.Value + amount;
}
```

Place the attribute on the **extended type**, naming extension classes. `counter.Plus(2)` supplies the first CLR self argument from the receiver. Extracted closures still need `.call(counter, ...)`.

## AOT XML

Use Settings.jsExtensionXmlPaths for AOT types whose source cannot be changed. The root is JsExtensions. Follow the [extension specification](../spec/13-EXTENSION-METHODS.md) for structure and generic restrictions; there is no runtime registry or XML hot reload.

## Selection

Methods need legal static/self signatures and assignability; generic cases need supported closed paths. Real instance and extension methods follow common binding/overload rules. A name collision does not mean last-loaded wins.

Exact signatures remain lazy. Alias, inheritance, declared views, and ByVal/ByObj receiver checks still apply. Preserve extension code and required AOT bridges/instantiations in IL2CPP.
