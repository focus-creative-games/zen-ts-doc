---
sidebar_position: 16
title: "扩展方法"
---

# 扩展方法

ZenTS 将配置过的 CLR 静态扩展方法纳入目标类型的实例候选。不会自动扫描所有程序集，也不会把任意静态函数当作扩展方法。

## Attribute 配置

```csharp
using ZenTS;
[JsExtension(typeof(CounterExtensions))]
public sealed class Counter
{
    public int Value;
}
public static class CounterExtensions
{
    public static int Plus(this Counter self, int amount) => self.Value + amount;
}
```

Attribute 放在**被扩展类型**上，参数是扩展类。脚本通过 `counter.Plus(2)` 调用，首个 CLR self 参数由 receiver 提供；提取 closure 后仍需 `.call(counter, ...)`。

## AOT XML

对不能修改源码的 AOT 类型，在 `Settings.jsExtensionXmlPaths` 配置扩展规则。XML 根为 `JsExtensions`，完整结构和泛型绑定约束以[扩展规范](../spec/13-EXTENSION-METHODS.md)为准。不要创建运行时注册表或依赖 XML 热更新。

## 竞争规则

扩展方法需要合法的静态方法、self 参数和可赋值关系，泛型定义需要可验证的闭合路径。原生成员和扩展方法按统一规则参与绑定和重载；同名不表示后加载者覆盖前者。

用全签名键进行精确访问时仍走受限懒解析。Alias、继承、声明门面和 ByVal/ByObj receiver 限制同时生效。IL2CPP 需要保留扩展方法代码和对应泛型/桥接实例。
