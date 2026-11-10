---
sidebar_position: 14
title: "数组与字节数据"
---

# 数组与字节数据

CLR 数组默认是保留对象身份的 wrapper，不是 JS Array。单维零基数组（SZArray）和多维数组使用相同的 CLR 下标访问模型。

```javascript
const values = zents.new_szarray_by_element_type(zents.types.int32, 3);
values.set(0, 10);
values.set(1, 20);
console.log(values.length, values.get(0));
const copy = zents.to_array(values);
```

使用 `get`/`set`，不要用 `values[0]` 代替 CLR 数组访问。`to_array` 复制为零基 JS Array；修改复制品不会改写 CLR 数组。

## 传入数组

普通 `T[]` 参数接受匹配 CLR wrapper、null，或连续、无 holes 且元素可转换的 JS Array。类数组对象不是 JS Array，多维 CLR 数组不接受嵌套 JS Array 自动转换。显式 undefined 元素按元素槽位规则处理，不等同允许数组 holes。

多维数组可用 `zents.new_mdarray_by_spec(elementType, lowbounds, sizes)` 创建；下标按各维 CLR lower bound 检查，length 为总元素数。

## 字节

默认 byte[] 与其他数组一样是 wrapper。对 byte[] 槽位标注 `JsMarshalType.Bytes` 后，双向使用**复制的 Uint8Array**，不是 UTF-8 或八位 string，也不是共享 WASM 内存。

`zents.to_bytes` 显式复制 blittable CLR 数组的原始字节，当前包含可接受的多维数组；拒绝 bool、char、引用元素和含引用 struct。二进制布局受类型、端序和平台 ABI 影响，不应当作跨平台网络协议。

## params 和 byref

普通方法/构造的 params 支持尾部 0..N 个展开值，或一个匹配 CLR 数组 wrapper。传入 JS Array 时通常使用 `...values` 显式展开；delegate/GetFunction 不做 params 展开。

ref/in 使用输入，out 不占 JS 输入；只有 out 进入返回元组。原地修改数组元素可见，ref 对数组引用重新赋值不会重新绑定 JS 局部变量。参见[数组规范](../spec/marshal/07-ARRAY.md)。
