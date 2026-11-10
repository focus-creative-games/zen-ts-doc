---
sidebar_position: 5
title: "Marshal 模型"
---

# Marshal 模型

Marshal 由 CLR 槽位类型、调用方向、byref 修饰和显式策略共同决定，不是统一的“JS 值自动转 object”。

| CLR/场景 | 默认或显式表现 |
|---|---|
| bool | 严格 boolean，不做 truthiness |
| 整数 | number；需要有限、整数值和目标范围 |
| Int64/UInt64 | 默认 number；显式 BigInt 槽位使用 bigint |
| null / void | null / undefined，二者不合并 |
| 引用对象 | ByObj wrapper，按声明门面 |
| struct | ByVal；可选择合法 Table/UnpackedValues 策略 |
| 数组 | CLR wrapper；普通 SZArray 参数另可接收连续 JS Array |
| byte[] + Bytes | 复制 Uint8Array |
| C#→JS byref | 调用期 Opaque，in 只读 |

undefined 表示缺失。可选参数可使用默认值；必选引用槽不能把 undefined 自动当 null；Nullable 的无值规则单独定义。

JS→CLR 的 out 不占输入，通过结果元组返回。ref/in 占输入，临时重赋值不回写 JS 局部变量，也不会附加到 out 元组。

含引用 struct、数组元素和堆字段需要正确 GC 根及 write barrier。Opaque 和内部借用值不能跨调用期或 await。默认复制的 Bytes/to_array 不承诺零拷贝。

详见[Marshal 规范](../spec/marshal/index.md)及[策略指南](../guides/js-marshal-as.md)。
