---
sidebar_position: 3
title: "属性访问与 this"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 02 — 属性访问与 this

## 1. 静态与实例域

类型对象只访问静态索引；实例 wrapper 只访问实例门面。struct ByVal 与 ByObj 的 this 解析不同，不能使用另一侧的 function 去解释 payload。

## 2. 属性 get

1. 查当前分派域的 method 表，再查 getter 表。
2. 若有 setter 而无 getter，按只写属性错误处理。
3. 对含括号的字符串全签名键尝试受限懒解析：public、静/实例正确、排除构造/cctor/访问器，沿类型链找精确 CLR 签名后缓存。
4. 处理必要的类型保留入口及 JS 语言协议；仍未命中则 member not found。

get 的缓存不改变 Bind 后冻结的短名 overload 组。普通属性 miss 不进行任意反射 promotion。

### 2.1 JS 协议探测

真实绑定成员优先。未提供的 then 或 Symbol 协议探测按 JS 规则返回 undefined，不让普通 CLR wrapper 因 strict miss 破坏 Promise/语言协议。若真实存在可调用 then，它仍按真实成员参与 thenable 语义。

必要的 toString 等辅助须在各 backend 采用一致行为；不能借协议处理开放任意未知字符串键。业务普通 JS 对象仍使用普通 JS 属性规则。

## 3. 方法与 receiver

`obj.Method(args)` 使用该次调用的 this；提取方法不自动捕获原对象。`fn.call(obj, args)` 显式绑定 receiver。缺失、过期或不兼容 receiver 必须失败，不能读取全局对象或错解另一种 payload。

扩展方法使用相同 JS this，但 CLR 调用为 static，第一个真实 CLR 参数是扩展的 this。

## 4. 属性 set

只查对应 setter/可写 field；readonly、未注册成员或不合法值均报错。写入 CLR 引用/含引用 struct 的堆槽执行 write barrier。不允许给 CLR wrapper 随意新增短名方法来绕过冻结。

## 5. 索引与保留入口

普通 CLR indexer 使用 get_Prop/set_Prop；数组使用 get/set，整数键 arr[i] 不承诺像 JS Array 一样工作。struct _default、必要的类型诊断信息按保留入口处理；不能伪造 _ctor 或公开可写 native 指针。

## 6. 错误

miss、无 getter、readonly、参数不匹配、receiver 错误分别可诊断，并带 zents: 前缀。backend 的完整堆栈格式可不同，不能以捕获错误后返回 undefined/零值掩盖失败。

## 7. 一致性

Mono/Il2Cpp、V8/HostJs 共用命名、查找优先级、签名缓存、receiver 和门面规则。只有实际语言/平台能力差异记录在对齐规范，不能把 QuickJS 物理对象形态当作例外来源。
