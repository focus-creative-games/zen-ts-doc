---
sidebar_position: 19
title: "成员别名"
---

# 成员别名

使用 `JsAlias` 在绑定期决定稳定短名。Alias 影响脚本可见的短名，不改变 CLR 方法身份和原始全签名键。

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

被换名方法不再依靠原 CLR 短名暴露；精确签名仍使用 CLR 名。多个方法具有同一 Alias 时可以形成重载组，但同一配置槽被多份 XML 重复配置属于错误。

## 为 AOT 程序集配置 XML

```xml
<JsAlias version="1">
  <Assembly name="Assembly-CSharp">
    <Type fullName="Demo">
      <Method name="Add" signature="(System.Int32,System.Int32)" alias="AddInts"/>
    </Type>
  </Assembly>
</JsAlias>
```

在 `Settings.jsAliasXmlPaths` 配置文件或目录。Attribute 优先于合法 XML；配置不能借优先级绕过 XML 校验。XML 只对 AOT 程序集有效，没有运行时注册或 Reload。

改变别名后重新初始化 Editor 会话，Player 重新 Generate/构建。不要在 Reset 时期待 XML 热重载。短名冻结后不能通过已删除的 `register_method` 修改。细节见[重载与 Alias 规范](../spec/04-METHOD-OVERLOAD.md)。
