---
sidebar_position: 12
title: "值类型、门面与复制"
---

# 值类型、门面与复制

值类型默认按值复制，引用对象保留 CLR 身份。不要把 JS 变量的赋值与 CLR struct 的地址写回混为一谈。

## ByVal 与 ByObj

ByVal struct wrapper 保存值副本；读取字段得到的嵌套值一般也是副本。要改写外层值，通常需要修改后赋回。ByObj 包装的是有 CLR 对象身份的装箱值；调用域和 receiver 验证不同，不能复用不匹配的 closure。

`zents.box(typeArg, value)` 创建装箱对象，`zents.unbox(boxedValue)` 取得值，`zents.cast(obj, targetType)` 选择兼容门面。它们不是任意 JS 对象转 CLR 的万能强制类型转换。

## 自定义表现

`JsMarshalAs` 可为合法 struct 槽位选择 Table 或 UnpackedValues。Members 明确列出字段/属性，Table 的可选输入键可加 `?`，UnpackedValues 不接受该标记。

Table 输入区分缺少 own property 与存在但为 undefined；成员值仍按各自 Marshal 规则校验。UnpackedValues 的嵌套结果不会因为外层 out 元组而被递归展平。

## 引用字段与生命周期

含托管引用的 struct 复制和写回必须遵守 GC 根和 write barrier，不能按 blittable 内存块随意 memcpy。Opaque 是调用期借用句柄，不是可长期保存的 struct 地址。需要控制生命周期时先读出合法值或建立正式 wrapper。

详细支持范围、字段/property 限制及 nullable 规则见[struct 规范](../spec/marshal/05-STRUCT.md)。
