---
sidebar_position: 19
title: "Member aliases"
---

# Member aliases

JsAlias selects a stable short name at binding time. It does not change CLR identity or the original full-signature key.

```csharp
using ZenTS;
public static class Demo
{
    [JsAlias("AddInts")]
    public static int Add(int a, int b) => a + b;
}
```

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
Demo.AddInts(1, 2);
Demo['Add(System.Int32,System.Int32)'](1, 2);
```

The alias replaces the original short name. Different methods can share an alias and form an overload group; duplicate XML rules for the same slot are errors.

## AOT XML

```xml
<JsAlias version="1">
  <Assembly name="Assembly-CSharp">
    <Type fullName="Demo">
      <Method name="Add" signature="(System.Int32,System.Int32)" alias="AddInts"/>
    </Type>
  </Assembly>
</JsAlias>
```

Configure files/directories in Settings.jsAliasXmlPaths. Attributes take precedence over valid XML, without skipping XML validation. XML is AOT-only; there is no runtime registration or Reload.

Reinitialize the Editor session after changes and regenerate/rebuild Players. Reset does not reload XML. The removed register_method cannot modify frozen names. See [overloads and aliases](../spec/04-METHOD-OVERLOAD.md).
