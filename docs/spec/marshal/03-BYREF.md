---
sidebar_position: 3
title: "ref、in、out Marshal"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# `ref` / `in` / `out` Marshal

## 1. 两个调用方向

| 方向 | ref/in | out |
|---|---|---|
| C#→JS delegate/GetFunction | 默认 OpaqueValue | 默认 OpaqueValue，回调内写入 |
| JS→C# | 仍占输入槽，绑定原地址或临时槽 | **不占输入槽**，调用后加入返回元组 |

不能用“JS 统一处理 byref”抹掉 out 与 ref 的输入差异。下文 A 表示去 byref 后的 CLR 元素类型。

## 2. C#→JS

每个 byref 参数登记为当前调用帧的 OpaqueValue。get/set 使用登记槽位的元素策略，默认 Int64/UInt64 仍读写 number；显式 BigInt 槽读写 bigint。in 只允许读，set 必须失败。调用返回后所有相关借用失效，不能跨 Promise/await 保存使用。

该方向不采用 JS→CLR 的 out 返回元组；JS 回调通过 Opaque 写回 CLR 原参数。

## 3. JS→C# ref/in 的地址规则

1. 有效且类型兼容的 Opaque：直接绑定登记地址；只读限制不能被 in→ref 转传绕过。
2. 精确同类型 ByVal struct：使用可写 payload 地址；in 不授权修改。
3. 其他合法输入：按元素策略转换到当前调用的临时槽，再把临时地址传给 CLR。

裸 number/bigint/string 或 ByObj 引用的临时槽被重新赋值，不会重新绑定 JS 局部变量。对象内部字段的原地修改仍通过共享对象可见。不同类型 byref 地址不能凭引用可赋值关系随意互换，例如 ref object 不得传给 ref string。

## 4. 分类细则

- 非 Nullable struct 的同类型 ByVal 可以写回 payload；T→ref Nullable\<T\> 用临时 Nullable，不反写原 T。
- 基元和 enum 从值复制到临时槽。Int64/UInt64 默认 number；只有显式 BigInt 的值转换使用 bigint。
- ref string 可从 string、兼容 wrapper、null 构造临时引用槽；必选 undefined 失败。
- ref class/interface/array/delegate 从兼容 wrapper/null 构造临时引用槽。CLR 重新赋值该临时槽不更新原 JS 变量。
- 向 GC 堆中的 payload、字段或数组写入托管引用，必须执行 write barrier。

## 5. JS→C# out：零输入与元组返回

调用帧为每个 out 分配 default(A) 临时槽，重载/arity 不为 out 消耗 JS 实参。调用成功后按 CLR 声明顺序转换这些值：

| CLR 返回 | JS 结果 |
|---|---|
| 非 void，无 out | 普通返回值 |
| void，无 out | undefined |
| 非 void，有 out | `[returnValue, out1, out2, ...]` |
| void，有 out | `[out1, out2, ...]`，即使只有一个 out 也保留数组 |

返回值与每个 out 使用各自的 Marshal 策略。UnpackedValues 的成员数组作为一个元素嵌套，不能拍平。显式 BigInt 的 out long/ulong 产生 bigint；未标注产生 number。调用失败只抛错误，不返回半成品元组。

```csharp
public static bool TryGet(int key, out string value) { value = "x"; return true; }
public static void GetPosition(out float x, out float y) { x = 1; y = 2; }
```

```javascript
const [ok, value] = Store.TryGet(7);
const [x, y] = Store.GetPosition();
// Store.TryGet(7, null) 不是 out 占位语法；多余参数按普通规则拒绝。
```

全签名键仍包含 String& 等 CLR byref 拼写；只是 JS 输入槽数与 CLR 形参数不同。

## 6. 匹配与调用共享计划

Bind 期记录 CLR 参数索引、JS 槽游标、byref 角色、默认值和结果槽。Invoke 不得再以 parameters_count 直接等同 JS arity。每次嵌套调用有独立临时槽和返回缓冲，不能覆盖外层 Opaque 或结果。

## 7. 平台一致性与状态

上述规则须覆盖方法、构造和 CLR delegate 的普通 Invoke 路径。当前 writer、匹配器、调用桥及 TS tuple 声明已使用上述规则，不保留旧 out 占位分支；平台验收见 [实现状态](../03-ALIGNMENT.md)。
