---
sidebar_position: 4
title: "JavaScript API"
---

# JavaScript API

`CSharp[assembly][fullClrName]` 懒获取类型对象，`csharp:` named import 指向同一对象。成员构造使用 new，实例方法使用 JS this。下表为当前 zents 门面；类型规则详见[标准库规范](../spec/05-LIB.md)。

| API | 含义 |
|---|---|
| `typeof(typeObject)` | 得到 System.Type wrapper |
| `get_type_from_name(fullName)` | 按完整 CLR 名解析类型 |
| `make_generic_type(type, ...args)` | 闭合泛型类型，也接受一个 args Array |
| `inflate(owner, key, ...args)` | 闭合方法泛型，也接受一个 args Array |
| `make_szarray_type(elementType)` | 创建 SZArray 类型 |
| `new_szarray_by_element_type(type, length)` | 按元素类型创建 SZArray |
| `new_szarray_by_szarray_type(type, length)` | 按数组类型创建 SZArray |
| `make_mdarray_type(elementType, rank)` | 创建多维数组类型 |
| `new_mdarray_by_spec(type, lowbounds, sizes)` | 按元素、下界、长度创建多维数组 |
| `new_mdarray_by_mdarray_type(type, lowbounds, sizes)` | 按多维数组类型创建 |
| `to_array(szarray)` | 复制成零基 JS Array |
| `to_bytes(array)` | 复制可接受 blittable CLR 数组的原始字节 |
| `to_delegate(func, delegateType)` | 转为指定闭合 CLR 委托 |
| `get_opaquevalue(handle)` | 读取有效调用期 Opaque |
| `set_opaquevalue(handle, value)` | 写入非只读且有效的 Opaque |
| `to_user_data(handle)` | 按规则将 Opaque 对应值转为正式 wrapper |
| `box(typeArg, value)` / `unbox(value)` | 装箱 / 取值 |
| `cast(obj, targetType)` | 转换到兼容声明门面 |
| `signature(...typeArgs)` | 构造 CLR 参数签名，亦接受一个 Array |
| `types` | 常用 CLR 完整名称常量，如 int32、long、string |

公共 typeArg 支持类型对象、完整类型名和 System.Type wrapper；GTAP 前缀更严格，仅支持 System.Type wrapper。

数组 wrapper 提供 `length`、`get`、`set`，不通过整数属性直接访问。事件使用 `add_Event`/`remove_Event`。普通 CLR 成员 miss 抛错；then/Symbol 探测例外见类型规范。

没有 `register_method` 或 `make_generic_method`。内部 `__zents_*` 不是可依赖的业务 API，V8 和 HostJs 内部句柄也不能混用。
