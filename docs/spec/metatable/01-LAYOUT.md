---
sidebar_position: 2
title: "对象与分派布局"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 01 — 对象与分派布局

## 1. 抽象模型

类型对象、STO、IEO 与 ByVal/ByObj 是引擎无关模型。Native V8 可以使用 template/内部字段/函数，HostJs 可以使用 Proxy、闭包与句柄表；只要 JS 可观察结果一致，不要求复制 QuickJS 的对象内存布局。

所有 [[...]] 表示概念内部槽，不是可由业务随意写入的属性。诊断元数据可只读暴露，但不得把原生 CLR/JS 指针作为可伪造标记。

## 2. 类型对象

每个域内 CLR 类型对应 intern 的类型对象。静态成员由 STO 分派；实例成员不因为类型对象是 callable 就被当成静态成员暴露。csharp: 与 CSharp 返回同一对象身份。

## 3. STO

持有静态 method/getter/setter 元数据和合法构造入口。struct 保留 _default 入口，enum/数组/静态类没有通用构造。Nullable 有值工厂单独采用函数调用，不能要求 JS new 返回 primitive。

构造、_default 与必要 JS 语言协议不是普通 CLR 方法短名，不混进重载组。类型对象缓存不得因模块导出枚举而急切绑定全部无关类型。

## 4. IEO

ByObj IEO 以对象身份及 viewType 选择成员；ByVal IEO 以 struct 副本选择成员。struct 两侧的成员名集合相同，但接收者解析不同；静态与实例分表。

所有权为对象 GC root、可追踪 struct 副本或有效期受限的 Opaque，不能把这些形态混合成裸地址。数组和 delegate 在该模型上分别增加 get/set、length 或调用能力。

## 5. 三表

methodTable、fieldGetterTable、fieldSetterTable 是概念性的独立索引。get 优先 method，再 getter；setter 单独处理。只写 property 有 setter 而无 getter 时，读必须给出明确错误。

Bind 完成后短名冻结；只有全签名键受限解析及闭合泛型缓存允许惰性建立内部条目，不提供运行时改短名 API。

## 6. 计划与执行对象

CLR 计划只含类型、成员、候选、默认值、策略及绑定域；引擎对象持有函数、prototype、wrapper 与 JS 引用。实际 P1 路径见 [引擎边界](../build/07-ENGINE-BOUNDARY.md)。不能以共享计划为由让 Mono 必须使用 Il2Cpp 执行方式。

## 7. 门面与缓存

同一 CLR 对象可有多种 view，缓存需区分 identity/viewType。实际类型返回策略只在合法返回槽生效；Object 默认门面不是“按实际类型自动扩展”。weak cache 不能强持有 wrapper 使其无法被回收。

## 8. 引擎映射

V8 handle、HostJs token 和过渡 QuickJS 值都停留在 adapter。getIdentity 不能是移动 GC 后失效的地址；host 句柄带 generation。任何 JS 对象不能仅因拥有 __zents_id 等公开字段就获得 CLR 对象身份。
