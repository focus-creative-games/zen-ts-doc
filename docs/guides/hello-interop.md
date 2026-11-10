---
sidebar_position: 2
title: "双向调用示例"
---

# 双向调用示例

把脚本域集中放在一个入口管理，业务代码通过模块导出和 CLR 类型对象互调。下面的示例使用 `Assembly-CSharp` 中的类型，不需要生成逐类型 Wrap。

## CLR 类型

```csharp
public sealed class Counter
{
    public int Value { get; set; }
    public Counter(int initial) { Value = initial; }
    public int Add(int delta) => Value += delta;
}
```

## JavaScript 模块

```javascript
const Counter = CSharp['Assembly-CSharp']['Counter'];
export function run() {
  const counter = new Counter(10);
  counter.Value = 12;
  return counter.Add(3);
}
```

也可生成声明后使用 `import { Counter } from 'csharp:Assembly-CSharp'`。两条路径指向同一 CLR 类型绑定，不是两套注册系统。

## 取得导出并调用

```csharp
JsAppDomain.Initialize(JsFileModuleLoader.Load);
var run = JsAppDomain.GetFunction<System.Func<int>>("main", "run");
UnityEngine.Debug.Log(run()); // 15
```

普通业务组件应使用已经初始化的域。`GetFunction` 要求已完成初始化，类型参数是闭合委托，模块和导出名非空。

## 提取方法时保留 receiver

```javascript
const counter = new Counter(1);
const add = counter.Add;
add.call(counter, 2);
```

成员方法闭包不自动捕获实例；错误 receiver 会失败。返回引用对象时，默认按声明类型建立可见门面，不能因为实际派生类型有更多成员就隐式开放。

发布时仍需处理 IL2CPP 裁剪、泛型实例及签名桥；“无 Wrap 白名单”不免除这些要求。参见[类型模型](../concepts/type-system-overview.md)和[发布构建](build.md)。
