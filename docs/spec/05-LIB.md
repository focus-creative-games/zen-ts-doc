---
sidebar_position: 5
title: "zents 标准库"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# 05 — `zents` 标准库

`zents` 为引擎无关的 JavaScript 门面。内部 `__zents_*` hook 是实现细节，不能把 QuickJS 类型或 V8 句柄写成业务 API。本文描述当前公开接口；验收范围见 [实现状态](./03-ALIGNMENT.md)。

## 1. 职责边界

CSharp/csharp: 负责类型与成员入口；zents 负责类型构造、泛型闭合、Marshal 辅助与数组工具。实例成员仍使用 this，zents 不提供动态改写方法短名的正式接口。

## 2. 加载

域初始化安装内置库与 CSharp。Native V8 使用域内 context；HostJs 使用 ZenTS 管理的模块/命名空间。两者不要求同一个引擎对象布局，但结果必须等价。源码、内嵌脚本与 zents.d.ts 必须同版本生成。

## 3. 类型实参（typeArg）

公共 typeArg 接受：CSharp/csharp: 类型对象、工厂返回的类型对象、可由 CLR 解析的类型名（含 AQN/数组/泛型，**不限 corlib**）、zents.types 常量、`System.Type` wrapper（含 typeof 返回值）。普通 JS object 不可伪装类型。

GTAP 是严格子集，只接受 System.Type wrapper；不要把公共 typeArg 的宽松形式直接用于 GTAP。

## 4. 类型查询

### 4.1 `zents.typeof(typeObject)`

接受任意 ZenTS 类型对象，返回 System.Type ByObj wrapper，可再作为 typeArg 或传入需要 System.Type 的 CLR API。

### 4.2 `zents.types`

预置 CLR 全名字符串：void、bool、char、byte/sbyte、short/ushort、int/int32、uint、long/ulong、float、double、intptr/uintptr、decimal、object、string。它们是类型名，不是 JS 构造器，也不是 GTAP 前缀。

### 4.3 `zents.get_type_from_name(name)`

按 CLR 名称规则查找类型对象，支持 AQN、数组和闭合泛型。失败抛 `zents: type not found`，不能返回 undefined。

## 5. 泛型类型

`zents.make_generic_type(openType, ...typeArgs)` 要求泛型 arity 和约束匹配，返回 intern 的闭合类型对象。相同闭合类型须命中相同域内类型身份；不能据此保证不同引擎或 Reset 之间共享对象。

## 6. Opaque 读写

`get_opaquevalue(h)` / `set_opaquevalue(h, value)` 只在登记作用域有效。默认元素策略为 Default；显式 BigInt 的 Int64/UInt64 槽按 bigint 读写。过期必须失败，不能把 token 当指针。详见 [Opaque](./marshal/04-OPAQUE.md)。

## 7. 装箱、拆箱与转换

- `box(typeArg, value)`：对基元/enum/struct 显式装箱为 ByObj；引用类型不能再次装箱。
- `unbox(boxed)`：按目标 CLR 值类型的默认策略拆出值。Int64/UInt64 默认结果为 number；不会从一次历史 BigInt 输入猜测持久标注。
- `cast(obj, targetType)`：保持对象身份，改变声明门面；不创建新 CLR 实例。
- `to_user_data(opaque)`：显式复制到可持有 wrapper；不延长借用地址本身的有效期。实际支持的值种类须与 struct/引用形态一致，不能复制任意 ref struct 为持久对象。该复制入口与 ZLua 生命周期语义对照；ZLua 标准库索引缺项不应被误读为借用可直接长期保存。

## 8. 数组

### 8.1 类型

`make_szarray_type(typeArg)`、`make_mdarray_type(typeArg, rank)` 返回对应类型对象。SZArray 与 rank=1 的非 SZArray 不合并，mdarray rank 为 1..32。

### 8.2 实例

`new_szarray_by_element_type(typeArg, length)`、`new_szarray_by_szarray_type(arrayType, length)`；
`new_mdarray_by_spec(typeArg, lowbounds, sizes)`、`new_mdarray_by_mdarray_type(arrayType, lowbounds, sizes)`。

长度、上下界、积和分配大小要校验；参数数组为连续 JS Array。元素初始化为 default(T)，数组 wrapper 通过 get/set 访问，SZArray 提供 length。

### 8.3 `to_bytes(array)`

接受 blittable 元素的 CLR 数组（含当前可接受的多维数组），输出**复制的 Uint8Array**，不再允许各引擎自行选择 binary string。bool[]、char[] 和含托管引用元素拒绝；遵守 [数组规则](./marshal/07-ARRAY.md)。

### 8.4 `to_array(szarray)`

返回连续、零基 JS Array，逐元素使用默认策略。Int64/UInt64 元素默认 number；本 API 不自动给整个数组加 BigInt 策略。

## 9. 泛型方法

### 9.1 `zents.inflate`

```javascript
const f = zents.inflate(closedDeclaringType, methodNameOrSignature, ...typeArgs);
const value = f.call(receiver, ...args); // 实例 closure，ByObj 接收者
```

声明类型须闭合；只闭合方法自身泛型形参。名字可以是短名或开放签名如 `Describe(T)`；短名不能唯一确定时必须用全签名，不能依 metadata 顺序任选。

查找静态与 ByObj 实例域；返回 static direct 或 ByObj instance direct。struct ByVal 侧开放泛型通过其自身 GTAP 调用，不从 inflate 凭空推断 ByVal。intern 键包含 closedMethod/isStatic/isByVal，与 GTAP 共用。

### 9.2 GTAP

调用开放泛型方法前缀传 N 个 System.Type wrapper，余参按闭合后签名匹配。符合泛型前缀与余参的路径优先于普通非泛型候选。详见 [重载 §3.8](./04-METHOD-OVERLOAD.md)。

目标接口不提供 `make_generic_method(closure, ...)`；旧实现迁移到 inflate 时必须显式给出声明类型和名字。

## 10. Delegate

delegate 形参默认接受 JS callable；`to_delegate(fn, closedDelegateType)` 提供显式转换。回传已有 JS bridge 可恢复同一函数身份，普通 CLR delegate 可表现为可调用 wrapper。事件 remove 需要与 add 保持稳定的 CLR delegate 身份。

## 11. 签名与短名

`zents.signature(...typeArgs)` 返回不含方法名的 `(System.Int32,...)`，供签名键拼接与调试。该轻量脚本辅助不改变绑定模型。

**没有正式 `register_method`。** 短名通过 Bind 期 Alias/AOT XML 定义；缓存方法后使用 `.call`，不要为了缓存闭包改写类型的短名表。

## 12. 内部 hook

`__zents_typeof`、类型/数组工厂、inflate、box/unbox/cast、Opaque 与字节操作为门面实现所需概念。Native V8 可直接绑定函数，HostJs 可使用操作 ID 和二进制调用帧；本规范不要求维持 QuickJS 全套 C API，也不把 hook 的数量固定为完整互操作工作量。

## 13. 示例

```javascript
import { Demo } from "csharp:Assembly-CSharp";
const demo = new Demo();
const run = demo['Run(System.Int32)'];
run.call(demo, 10);
const [ok, value] = Demo.TryGet(7);
const exact = Demo.GetExactCounter(); // CLR 返回值须显式标注 BigInt
```

## 14. 声明与实现同步

新 API、out 元组和 BigInt 标注必须同步 zents.d.ts、csharp: 声明和 Editor/Player 用例。缺失实现要登记，不得让声明承诺未实现行为。当前已移除 make_generic_method/register_method，迁移使用 inflate 和 Bind 期 Alias。
