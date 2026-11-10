---
sidebar_position: 13
title: "C# extension methods"
---

# C# extension methods

Configured extensions appear as JS instance methods on the extended type, on both Mono and IL2CPP. See [binding](metatable/03-BINDING.md) and [overloads](04-METHOD-OVERLOAD.md).

## 1. Discovery model

The configuration maps **extended type → extension class list**. Place JsExtension on the extended type, not the extension class. No global ExtensionAttribute scan occurs. Merely calling a static method on its declaring class is not instance-extension support.

Real instance and extension candidates merge by final name, without an instance-first tie-break. Open/unclosed generic extensions are not supported.

## 2. Attributes and AOT XML

```csharp
using ZenTS;
[JsExtension(typeof(TransformExt), typeof(TransformTweenExt))]
public class MyBehaviour : UnityEngine.MonoBehaviour { }
```

Allow multiple attributes and union their lists. Walk the extended type's BaseType chain for metadata. Interface extensions require configured matching interface/self types; implementing an interface does not inject unconfigured extension classes.

Settings.jsExtensionXmlPaths is separate from jsAliasXmlPaths; root JsExtensions:

```xml
<JsExtensions version="1">
  <Assembly name="UnityEngine.CoreModule">
    <Type fullName="UnityEngine.Transform">
      <Extension assembly="Assembly-CSharp" fullName="MyGame.TransformExt"/>
      <Extension assembly="Assembly-CSharp" fullName="MyGame.TransformTweenExt"/>
    </Type>
  </Assembly>
</JsExtensions>
```

Assembly/Type identify the extended type; Extension identifies its class's assembly/full name. Do not mix Method/MarshalAs/alias structures into this file.

For each type, union/deduplicate attribute and legal AOT XML lists. Editor initialization snapshots XML; Bind does not reread it. IL2CPP generates static tables and does not parse XML in Player. Unresolvable extension classes fail generation or throw in Mono. No runtime XML registration/hot reload exists; hot-update assemblies require attributes.

## 3. Candidate collection

After collecting real/inherited instance methods, enumerate configured classes' public static methods. Require ExtensionAttribute, at least one parameter, assignability of target T to first parameter P0, and no open generic method.

Insert candidates into ByObj instance maps and, for struct T, the corresponding ByVal map. Resolve final names through Alias attribute/XML/CLR name, then group with real methods. Later assembly loading does not rebind an already bound T.

## 4. Static-as-instance calls

| Aspect | Contract |
|---|---|
| Exposure | Instance IEO only, not extended type STO |
| CLR call | Static Invoke; JS receiver supplies CLR parameter 0 |
| Remaining arguments | Align after CLR self, with common out/optional/params/UnpackedValues slots |
| Full signatures | Omit self and retain full remaining CLR types |
| Execution | Emit and native bridges recognize extension candidates |

Do not use a receiver-free ordinary-static path or instance-dispatch the extension class. Extracted closures do not capture this; missing/incompatible receivers fail diagnostically.

## 5. Overload competition

Same final name/domain means one group: direct if one candidate, dispatch otherwise, with lazy full signatures available even for single candidates. Compare parameters after self. No instance-first tie-break is inserted.

## 6. Example

```csharp
public static class TransformExt
{
    public static void ResetLocal(this UnityEngine.Transform t)
    {
        t.localPosition = UnityEngine.Vector3.zero;
    }
}
```

Configure UnityEngine.Transform to use TransformExt through the XML above, then:

```javascript
const t = go.transform;
t.ResetLocal();
```

Without applicable type/base configuration, member lookup throws. Implementations collect via MetaBinding, execute static-as-instance via Emit/MethodBridge, and bake XML through ExtensionCodegen. See [types](02-TYPE-SYSTEM.md).
