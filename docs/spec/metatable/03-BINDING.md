---
sidebar_position: 4
title: "成员绑定与继承"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# 03 — 成员绑定与继承

## 1. 范围

只绑定 public 成员。静态与实例、ByVal 与 ByObj 分域；构造只收集当前类型实例构造，不混入方法表或基类构造。抽象类、接口、静态类不能因“有 public ctor 元数据”就实例化。

## 2. 方法

解析 Attribute → 合法 AOT XML → CLR 名所得最终名字后分组：一个候选 direct，多个 dispatch。Alias 替换默认名，不双挂。不同方法最终名相同允许；同一 XML 配置槽重复禁止。

真实例与配置扩展方法同名合并竞争；不增加实例优先 tie-break。绑定时物化 optional 默认值，保留 params/out/展开槽信息，不能把 CLR 形参数当成 JS 输入数。

## 3. 字段与 property

field/property 各按可见读写能力建 getter/setter。readonly 无 setter；只写属性读给出明确无 getter 错误。有参 property 只作为 get_Prop/set_Prop 方法，不误放进无参 getter 表。

enum literal 是 readonly number 常量，不因为底层 long/ulong 就变成 bigint。显式 BigInt 是 Int64/UInt64 成员槽位策略，不能标整个 enum。

## 4. 继承

普通成员在 Bind 期按类型层次扁平化，处理 override/new 隐藏及同名方法候选时遵循类型系统和重载规范。虚调用针对真实 CLR 实例解析；声明门面决定可见成员，不更改对象实际类型。

普通键不在 miss 时向基类动态 promotion。**全签名键是明确例外**：沿层次解析 public 方法，缓存到触发域，不改变已有短名组。构造/cctor/属性访问器不参与该例外。

## 5. struct 双绑定

同一成员集合分别建立 ByVal/ByObj 执行入口。ByVal this 指向自身副本，ByObj this 来自 boxed 引用。不能复制一份函数表却保留错误接收者约定。ByVal 开放泛型通过该侧 GTAP 闭合。

## 6. 泛型与冻结

开放泛型 direct/dispatch 可以接受 GTAP；inflate 使用已闭合声明类型和方法名字，不从旧 closure 推断语义。闭合缓存键含 closedMethod/isStatic/isByVal。

Bind 后短名冻结，没有 register_method。全签名与泛型缓存的内部惰性写入不是开放运行时短名注册。

## 7. 元数据配置

Alias、MarshalAs、Extension XML 只用于 AOT 程序集并在编辑初始化/Generate 消费；Player 不解析，运行期间不注册、不热更、不 Reload。热更新程序集使用 Attribute，加载程序集本身不修改已冻结的绑定表。

## 8. 验收

继承隐藏/override、静实例隔离、ByVal/ByObj、Alias 撞名、单候选签名、泛型签名和配置重复均须有对照用例。历史旧行为通过不能代替当前 435 命名用例与各平台真实运行。
