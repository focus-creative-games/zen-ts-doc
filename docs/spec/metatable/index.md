---
sidebar_position: 1
title: "成员分派规范"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 成员分派规范

目录名 metatable 保留用于与 ZLua 对照；JavaScript 中描述的是类型对象、静态分派 STO、实例分派 IEO 与 wrapper 行为，不要求某个引擎的具体 metatable/JSClassDef。

- [布局](./01-LAYOUT.md)：静/实例、ByVal/ByObj 与概念内部槽。
- [属性访问](./02-INDEX.md)：查找顺序、this、严格 miss 和 JS 协议探测。
- [绑定](./03-BINDING.md)：public 成员、继承、别名和懒签名。
- [特殊类型](./04-SPECIAL-TYPES.md)：enum、Nullable、struct、数组、delegate。

参数/返回值规则以 [Marshal](../marshal/index.md) 为准；重载与泛型闭合以 [04-METHOD-OVERLOAD.md](../04-METHOD-OVERLOAD.md) 为准。默认 Int64/UInt64 是 number，只有显式 BigInt 标注的合法槽才用 bigint；enum 常量不自动改变。

所有文字描述目标契约，当前实现状态见 [03-ALIGNMENT.md](../03-ALIGNMENT.md)。
