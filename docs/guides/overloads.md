---
sidebar_position: 10
title: "重载、签名与 params"
---

# 重载、签名与 params

优先使用自然短名，只有在歧义或需要指定版本时才使用全 CLR 签名键。短名候选在类型绑定后冻结；不提供运行时注册方法的 API。

假设静态 Demo 有 Add(int,int)：

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
Demo.Add(2, 3);
Demo['Add(System.Int32,System.Int32)'](2, 3);
```

全签名键按 miss 懒解析并缓存，**即使只有一个候选也适用**；继承方法和被 Alias 换名的方法仍按原 CLR 方法名进行精确签名访问。不要凭空把 JS 数值标签当作 CLR 签名。

## 匹配原则

匹配考虑 arity、可选默认值、类型可转换性、声明门面、泛型和 params。bool 不按 truthiness 转换；整数要求有限、整数值和范围匹配；必选引用参数的 undefined 不等于 null。多个同等合适候选会报告歧义，不依靠枚举顺序选第一个。

JS number 不携带 int/float/long 的静态标签。确需选择时用签名键，而不是通过改变一个数值的写法猜选中重载。

## params

固定前缀之后可传 0..N 个元素，或一个类型匹配的 CLR 数组 wrapper。JS Array/TypedArray 不自动当作整个 params 数组；需要展开时用 spread。null 按元素候选参与匹配，不表示整个 null params 数组。

普通非 params 的数组参数仍按数组规则接收连续 JS Array 或 null。GetFunction/delegate bridge 按固定签名处理，不进行此展开。

泛型方法可用 `zents.inflate` 消除泛型选择的不确定性。完整选优顺序和惩罚规则见[重载规范](../spec/04-METHOD-OVERLOAD.md)。
