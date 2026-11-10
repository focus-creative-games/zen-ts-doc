---
sidebar_position: 10
title: "生命周期、GC 与异常"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# 10 — 生命周期、GC 与异常边界

## 1. 设计原则

CLR 所有权、JS 所有权和借用地址分别建模；引擎类型不是公共生命周期契约。默认一个 Unity 主线程脚本域，按 runtime/generation 隔离缓存。不能把不再使用的 token 当作仍可解引用地址。

## 2. ObjectRegistry 与门面

ByObj wrapper 持有 CLR 对象的 GC root/handle 和声明 viewType；同一对象可有不同门面，cast 不复制对象。wrapper 不得仅在非托管内存保存一个 GC 看不到的对象地址。

JS 释放 wrapper 后排队解除 CLR 根。V8 使用弱 handle；HostJs 根据实际能力使用弱引用/finalizer 或显式释放。回收时机不保证立即发生，弱缓存不能反过来强持有 wrapper 导致永不回收。

## 3. Struct 存储

ByVal 拥有副本，ByObj 表示 boxed 引用，Opaque 表示调用帧借用。含托管引用字段的副本须使用 CLR GC 可追踪的存储；写入托管堆中的引用字段/数组元素必须执行正确 write barrier。不能只 memcpy 到 native buffer 后认为 CLR 仍会追踪其引用。

## 4. OpaqueValue

Opaque 登记类型、地址、scope、generation 和只读性；有效期到产生它的那次 C#→JS 调用返回。所有成功/失败出口都撤销 scope，嵌套 scope 不互相覆盖。

get/set 按登记元素策略转换，默认 64 位整数为 number，显式 BigInt 则为 bigint。in 不允许写；传入 ref 也不得绕过只读性。过期 get/set/传回均失败，不能在 Promise、定时器、事件回调或后续调用中继续使用旧地址。

## 5. Delegate 与 JS 函数引用

C# delegate 保活 JS function，JS wrapper 保活 CLR delegate/目标；事件 add/remove 需稳定身份。V8 不允许缓存移动 GC 的裸 JS 地址，使用稳定 identity token。托管 finalizer 只排队释放，由所属线程处理。

CLR↔JS 强引用环不是任一 GC 自动保证可回收的图，业务需要解除事件、Dispose 或域管理的资源清理。GetFunction 不保证重复调用返回同一个 delegate；Reset 后旧 delegate 必须失败。

## 6. 线程与微任务

互操作默认在所属 Unity 主线程。V8 后台 GC/编译线程不改变 Unity API 的线程约束。Worker 需显式异步消息模型，不默认为同步 CLR 调用宿主。

Native 由适配器在定义的安全边界推进微任务；HostJs 使用宿主队列。不能在 CLR 栈仍持有可失效地址时异步继续执行。同步 delegate 不隐式 await Promise，拒绝不兼容返回值。

## 7. Initialize / Reset

Initialize 完成引擎域、模块、AOT 配置快照、Registry 和 frame pump；重复调用失败。Reset 只预约，EndOfFrame 才排空释放队列、失效旧 generation、解绑旧 callback/模块/句柄并重建域。

- Native 可以销毁 context，并按实现选择保留或重建 isolate；所有旧域资源仍必须失效。
- HostJs 不能关闭宿主 VM；重建的是 ZenTS 管理的模块世界与句柄。缓存原生 ESM 单例或未注销事件不能冒充“整域已重建”。
- AOT XML 是初始化/Generate 的配置快照；Reset 不重新加载 XML，不提供注册、热更或 Reload。
- 新热更新程序集使用 Attribute。加载它不自动修改已绑定类型的成员表；相关规则在首次绑定时解析，不通过 XML 注入。

## 8. 异常边界

JS 失败转换成可诊断 C# 异常；C# 失败转换成可被 JS try/catch 捕获的错误。托管异常不穿过 native callback ABI，原生引擎异常不跳过 CLR 帧。引擎 pending-error 设置不等同 Lua longjmp 或跨 ABI 的 C++ throw。

每次重入有独立错误槽、参数/返回缓冲、临时 CLR 引用根及 scope；失败后恢复外层状态。不得吞掉错误返回零值或半成品 out 元组。引擎堆栈全文可不同，但错误分类与 zents: 前缀一致。

## 9. 验收

必须包含增量 GC、含引用 struct、事件闭环解除、嵌套重入、callback 抛错、Reset 前后旧委托、Opaque 过期及宿主内存增长。各平台已执行结果见 [对齐状态](./03-ALIGNMENT.md)，不能从单个平台结果推断所有设备、宿主和进程退出都已验收。
