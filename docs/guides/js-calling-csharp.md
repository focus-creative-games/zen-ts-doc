---
sidebar_position: 3
title: "JavaScript 调用 C#"
---

# JavaScript 调用 C#

CLR 类型首次被访问时建立绑定；短名在绑定后冻结，全签名键可以按需解析并缓存。对象不因脚本添加了某个公开字段就获得 CLR 身份。

## 类型、构造与成员

```javascript
const Counter = CSharp['Assembly-CSharp']['Counter'];
const counter = new Counter(10);
counter.Value = 20;
const value = counter.Add(2);
const invoke = counter.Add;
invoke.call(counter, 3);
```

命名空间类型使用完整 CLR 名称作键，如 `CSharp['Assembly-CSharp']['Game.Counter']`。也可使用生成声明支持的 `csharp:` import。实例方法读取 JS `this`，静态方法属于类型对象，两者不会互换 receiver。

属性和字段通过普通读写访问；索引器使用相应 `get_Item`/`set_Item` 方法，数组使用 `get`/`set`。事件使用 `add_Event` 和 `remove_Event`，应缓存同一 handler 并显式解除订阅。

## 错误与查找

未知 CLR 成员会抛错，不是默默返回 undefined。为了 JS 协议探测，确实不存在的 `then` 和相应 Symbol 探测有专门规则，但不覆盖真实同名成员。不要用任意属性读取判断 CLR 类型是否有某个成员。

继承成员在绑定期扁平化，声明门面决定可见范围。可用 `zents.cast(obj, TargetType)` 请求合法门面；不能强行访问实际类型上的所有成员。

## 重载与泛型

先用自然短名调用；需要精确选择时使用全签名键。泛型方法使用 `zents.inflate` 或 System.Type 前缀。参见[重载](overloads.md)、[泛型](generics.md)。

## 发布约束

懒绑定仍要求元数据、AOT 方法与桥存在。被裁剪的类型、缺失的闭合泛型和签名桥会导致 Player 失败，即使 Editor 反射调用成功。对目标平台执行 Generate 和运行测试。
