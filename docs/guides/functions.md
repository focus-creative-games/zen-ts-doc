---
sidebar_position: 13
title: "函数、委托与事件"
---

# 函数、委托与事件

JavaScript 函数、CLR delegate 和成员方法闭包是三种不同对象。需要明确委托类型和 receiver，并管理长期订阅。

## 将函数转换为委托

```javascript
const Action = CSharp['mscorlib']['System.Action'];
const handler = zents.to_delegate(() => console.log('tick'), Action);
```

普通 CLR 形参已声明具体 delegate 时，可以按该槽位转换 JS 函数；显式 `to_delegate` 适合保存稳定 CLR 委托并用于事件配对。开放泛型委托不能直接调用，需要先闭合。

## 事件

对定义了 Tick 事件的实例：

```javascript
obj.add_Tick(handler);
// 结束使用时，传回同一个 handler
obj.remove_Tick(handler);
```

不要重新创建一个看似相同的箭头函数去解除原订阅。CLR event 持有 delegate、delegate 保活 JS 函数、JS 再持有 CLR 对象时，可能形成跨 GC 强引用环；显式取消订阅。

## 成员闭包

```javascript
const method = obj.Run;
method.call(obj);
```

方法闭包不自动绑定实例。值类型还有 ByVal/ByObj 调用域的区别，不能把一个域的 closure 用在另一个域来绕过复制语义。

## C# 入口

C# 用 `JsAppDomain.GetFunction<T>` 取得导出；其桥接按委托固定签名工作，不进行 params 展开。旧域委托在 Reset 后失效；长期引用不能用于延长旧 generation 的有效期。详细 ABI 与生命周期见[函数规范](../spec/marshal/09-FUNCTION.md)。
