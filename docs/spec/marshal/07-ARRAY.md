---
sidebar_position: 13
title: "数组 Marshal"
---

# 数组 Marshal

数组默认为 ByObj wrapper，保留 CLR 对象身份及 GC 根。SZArray、多维数组与 byte[] 不因为进入 JS 而变成同一种普通 Array。

## 1. 默认矩阵

| CLR 类型 | CLR→JS | JS→CLR |
|---|---|---|
| T[] | CLR wrapper 或 null | 兼容 wrapper、null、连续 JS Array |
| T[,…]（含非 SZArray 的 rank 1） | CLR wrapper 或 null | 仅兼容 wrapper 或 null |
| byte[] 默认 | 同 SZArray | 同 SZArray |
| byte[] + Bytes | 复制 Uint8Array 或 null | 按 Bytes 规则接受 Uint8Array/null，不能用 string |

必选 undefined 为缺失错误；可选参数/Nullable 按其规则处理。JS Array 的 holes 被拒绝；存在但为 undefined 的元素按元素槽位规则校验，不能与 holes 混为一谈。类数组普通对象不自动当作 Array。

## 2. 元素与下标

wrapper 使用 `get(i, ...)`、`set(i, ..., value)` 及 `length`，不实现整数属性访问。get/set 用 CLR 下标，各维按 lower bound 和长度校验；length 是总元素数。元素按声明类型默认策略推送/接收，引用和堆中 struct 写入遵守 write barrier。

GetValue/SetValue 等 CLR 方法仍可访问，但 GetValue 声明返回 object，其装箱/门面表现不同于专用 get。

## 3. SZArray 输入

连续 JS Array 按 0..length-1 转换为新 T[n]，逐元素验证。空 Array 构造 T[0]，null 为 CLR null；不是共享后备存储。多维数组不接受嵌套 JS Array 自动推导维度或下界。

```javascript
const array = zents.new_szarray_by_element_type(zents.types.int32, 2);
array.set(0, 7);
const copy = zents.to_array(array);
```

## 4. Bytes

Bytes 仅用于 byte[]，双向使用**复制的 Uint8Array**，不是八位 string 或 UTF-8。默认 byte[] 仍为 wrapper；显式 Bytes 输入不因此接受任意 Array、string 或 CLR wrapper。

复制语义不承诺 WASM heap 共享。内存增长会使内部旧视图失效，适配层刷新 view；业务不得据此长期保存指向旧 heap 的裸视图。

## 5. to_array / to_bytes

`to_array(szarray)` 返回新建、零基连续 JS Array，逐元素使用默认 Marshal。修改复制品不回写 CLR；long/ulong 元素默认 number，不自动变 BigInt。

`to_bytes(array)` 复制可接受 blittable CLR 数组的原始存储，当前允许对应多维数组。bool、char、引用元素及含引用 struct 拒绝。原始字节依赖 CLR 布局/端序/ABI，不等于跨平台序列化格式。

## 6. 创建

make_szarray_type / make_mdarray_type 返回数组类型；new_szarray_by_element_type / new_szarray_by_szarray_type 创建 SZArray；new_mdarray_by_spec / new_mdarray_by_mdarray_type 接收各维 lowbounds、sizes。输入数组连续，长度、rank、上下界、乘积与分配大小都需验证，初始元素为 default(T)。

## 7. params

普通方法/构造的 params 在固定前缀后接受 0..N 个元素或一个可赋值 CLR 数组 wrapper。JS Array/TypedArray 不自动视为整个 params 数组，显式 `...array` 展开；元素 T 自身允许该形态时可作为一个元素。null 只是一个待匹配元素，不表示整个 null 数组。

delegate/GetFunction bridge 不做 params 展开。普通非 params T[] 的输入规则不变。选优和惩罚见[重载](../04-METHOD-OVERLOAD.md)。

## 8. byref 与结果

JS→CLR ref/in 使用输入引用或临时槽；原地改元素可见，ref 重新绑定临时引用不改变 JS 局部变量，**不加入返回元组**。out 不占输入，结果按 CLR 声明顺序进入 out 元组。

C#→JS 的 ref/out/in 数组使用调用期 Opaque，in 只读，回调返回后过期。不能从 JS return tuple 写回该方向的 out。详见[byref](03-BYREF.md)。

## 9. 显式策略与一致性

Object 通常与默认 wrapper 等价，OpaqueValue 仅控制合法 CLR→JS 借用；ActualTypeUserData 只适用合法返回槽，BigInt 不能标在整个 long[]/ulong[] 上。Mono/IL2CPP、V8/HostJs 的元素、复制、下标、错误分类与生命周期须一致。
