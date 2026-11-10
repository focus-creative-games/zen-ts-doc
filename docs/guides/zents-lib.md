---
sidebar_position: 17
title: "zents 常用工具"
---

# zents 常用工具

`zents` 是各引擎共用的脚本门面。内部 `__zents_*` hook、V8 handle 和 WASM token 不是业务 API。

## 类型和泛型

```javascript
const Int32 = CSharp['mscorlib']['System.Int32'];
const systemType = zents.typeof(Int32);
const listType = CSharp['mscorlib']['System.Collections.Generic.List`1'];
const IntList = zents.make_generic_type(listType, Int32);
```

`typeof` 返回 CLR System.Type wrapper；`get_type_from_name` 解析完整 CLR 名称。`inflate(owner, key, ...typeArgs)` 闭合方法泛型。

## 数组

```javascript
const array = zents.new_szarray_by_element_type(zents.types.int32, 2);
array.set(0, 5);
const values = zents.to_array(array);
```

`make_szarray_type` / `make_mdarray_type` 创建数组类型，`new_mdarray_by_spec` 接受各维下界和长度。`to_array` 与 `to_bytes` 都是复制工具，不改变默认 wrapper 规则。

## 对象与调用

`box` / `unbox` 管理装箱值，`cast` 选择兼容 CLR 门面；`to_delegate(func, delegateType)` 创建指定 CLR 委托。Opaque 使用 `get_opaquevalue` / `set_opaquevalue` 访问，不能越过产生它的调用期；`to_user_data` 也不免除类型和生命周期检查。

`signature(...typeArgs)` 构造规范参数签名；`types` 提供常用 CLR 完整名称常量。已移除的 `register_method` 和 `make_generic_method` 不应出现在新代码中。完整参数表见[JS API](../reference/js-surface.md)。
