---
sidebar_position: 15
title: "泛型类型与方法"
---

# 泛型类型与方法

类型泛型和方法泛型分别闭合。Editor 可反射查找不代表 IL2CPP 已有对应 AOT 实例。

## 泛型类型

```javascript
const List = CSharp['mscorlib']['System.Collections.Generic.List`1'];
const IntList = zents.make_generic_type(List, zents.types.int32);
const values = new IntList();
values.Add(7);
```

公共 typeArg 接受 CLR 类型对象、完整 CLR 类型名和 System.Type wrapper。`zents.types.int32` 是名称常量；它不是 JavaScript number 的构造器。

## 泛型方法

假设 Demo 定义了 `static T Echo<T>(T value)`：

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
const echoInt = zents.inflate(Demo, 'Echo', zents.types.int32);
echoInt(7);
```

`inflate` 显式接收已闭合声明类型和方法键，只闭合方法自身泛型参数。静态 closure 直接调用，实例 closure 用 `.call(receiver, ...)`。

另一种写法是泛型类型实参前缀（GTAP）：

```javascript
const Int32 = CSharp['mscorlib']['System.Int32'];
Demo.Echo(zents.typeof(Int32), 7);
```

**GTAP 前缀只接受 System.Type wrapper**，不把类型名字符串或任意 JS 值猜成泛型参数。`zents.typeof` 与 JS 的 `typeof` 运算符不同。

## 约束和竞争

泛型约束、声明类型闭合状态、普通重载与泛型候选都参与验证；出现歧义时显式 inflate 或用全签名键。已删除的 `make_generic_method` 不再是兼容入口。

IL2CPP 需要预先保留对应闭合类型/方法及桥；无法仅凭运行时 typeArg 凭空生成 native 代码。详见[类型系统](../spec/02-TYPE-SYSTEM.md)和[重载规范](../spec/04-METHOD-OVERLOAD.md)。
