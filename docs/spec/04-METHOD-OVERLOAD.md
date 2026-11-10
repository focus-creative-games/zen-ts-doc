---
sidebar_position: 4
title: "方法重载"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# 04 — 方法重载

## 1. 目标

默认短名便于调用；需要精确候选时使用全签名键或 Bind 期 Alias。Mono/Il2Cpp、V8/HostJs 必须选中同一个候选，不能依赖引擎隐式强制转换或 metadata 枚举的偶然顺序。

## 2. 三层机制

1. 按最终名字聚合：一个候选为 direct，多个候选为 dispatch。
2. Bind 后短名冻结，不提供 `register_method`。
3. 全签名键首次 miss 时解析并缓存，不预挂所有签名；单候选同样支持。

静态、实例 ByObj、实例 ByVal 为独立绑定域。真实例方法与配置的扩展方法按最终名合并竞争，不额外插入“实例优先”。

## 3. 默认名与 dispatch

### 3.1 注册规则

最终名优先级为 Attribute Alias、AOT Alias XML、CLR 方法名。Alias 替换默认名，不双挂。不同方法可以撞同一最终名并形成重载组。继承按类型系统规则收集，构造不沿基类合并。

### 3.2 候选顺序

先判断 applicable，再作 better-member 比较。不得先遇到装箱候选就跳过后续更好的候选；也不得以总分掩盖“一个参数更好、另一个更差”的歧义。排序只用于稳定诊断，不能悄悄消除真正歧义。

### 3.3 实参槽与可选参数

| 形参 | JS 输入槽 |
|---|---|
| 普通参数 / ref / in | 默认一个；UnpackedValues 按成员数 |
| out | **零个**；调用后加入返回元组 |
| 尾部可选参数 | 省略或显式 undefined 时使用 Bind 期缓存的 CLR 默认值 |
| params | 消耗固定前缀之后 0～N 个元素，或一个可赋值的 CLR 数组 wrapper |

必选参数不足或多余参数未被 params 消耗均失败；direct、dispatch、构造和 delegate Invoke 的普通调用使用同一槽位计算。不能把缺少必选参数自动补成零。中间 undefined 不能让后面的实参向左移位。

null 只匹配允许空值的引用/Nullable；undefined 的可选、Nullable 和必选规则见 [默认矩阵](./marshal/01-OVERVIEW.md)。

### 3.4 params

省略得到空数组；已有匹配 CLR `T[]` wrapper 可整段传入；否则按元素 T 展开。JS Array/TypedArray 不自动作为整个 params 数组，使用 `...values` 显式展开；若 T 本身接受该形态，它可成为一个元素。

null 是一个待匹配元素，不是整个 null 数组；例如 `params string[]` 收到 null 可形成一个 null 元素，`params int[]` 则失败。delegate/GetFunction bridge 的 params 展开不支持。

### 3.5 值转换

- 默认 Int64/UInt64 使用 number；不是默认 bigint。
- 显式 `[JsMarshalAs(BigInt)]` 的 Int64/UInt64 槽只接受 bigint，进行完整范围校验。
- default 整数候选不接受 bigint；BigInt 槽不隐式接受 number，避免与默认槽混淆。
- 布尔、字符串、数值、CLR wrapper 的转换按 Marshal 规则，不能依赖 JS 的 truthy 或字符串转数值。
- GetConversionKind 不装箱；选定候选后才在实际 Marshal 中创建箱体。

### 3.6 Better function member

以 ZLua 的逐参数比较为基线：Identity 优于 ImplicitNumeric、ImplicitEnum、NullLiteral、ImplicitReference、ImplicitBoxing。只有某候选至少一处更好且没有任何一处更差，才能在转换层胜出。

转换相同后依次比较：

1. optionalUsed 更少；
2. paramsExpanded 为 0（未展开）；
3. paramsKind 为 0（非 params）。

仍不能区分则抛歧义错误，不允许 Mono 与 Il2Cpp 分别任选。JS 的 number/显式 bigint 是输入种类适配，不能另造一套默认 int64 优先规则。

### 3.7 全签名键（懒解析）

格式为 `CLRMethodName(Type.FullName,...)`，不含返回类型。扩展方法去掉 this；byref 使用 CLR `&` 拼写；泛型开放形参使用参数名。Alias 不改变全签名键中的 CLR 名。

普通表未命中且键含 `(` 时，按静态/实例域在当前类型和基类链解析 public 方法，跳过构造、cctor 和属性访问器。找到后建立 direct 或 GTAP closure，并在触发侧缓存；无匹配仍为 member not found。单候选和已被 Alias 换名的方法同样可通过签名键取得。

这条路径是**受限的签名解析**，不是允许任意属性 miss 反射 promotion。

```javascript
const direct = obj['Run(System.Int32)'];
direct.call(obj, 5);
obj['Run(System.Int32)'](5);
```

### 3.8 GTAP

开放泛型方法调用可在普通实参之前放 N 个 `System.Type` ByObj wrapper；N 等于方法泛型 arity。前缀不接受类型对象、字符串或 zents.types 常量；它们须先经过 `zents.typeof`。

```javascript
obj.GenericMethod(zents.typeof(Int32), 5);
```

若开放泛型候选满足前缀及闭合后的余参匹配，优先走该路径；否则按普通非泛型候选匹配。约束和 AOT 代码缺失必须明确失败。GTAP 与 `zents.inflate` 共用闭合缓存，键含 closedMethod、isStatic、isByVal。

## 4. 签名字符串规范

`zents.signature(...typeArgs)` 是签名字符串辅助，返回如 `(System.Int32,System.String)`；参数采用公共 typeArg。全签名键须再加 CLR 方法名，不能单独使用括号字符串。签名包含 out 的 CLR 类型，即使 out 不占 JS 输入槽。

## 5. Alias 与 XML

`[JsAlias]` 或 `JsAlias` XML 只决定 Bind 期最终短名。XML 路径为 Settings.jsAliasXmlPaths；与 MarshalAs、Extension 分文件、分根元素。同一 CLR 方法槽的重复 XML 规则失败，不同方法的别名撞名允许。

XML **仅对 AOT 程序集有效**，在 Editor 初始化或 Generate 时消费。没有热更 XML、运行时注册或 Reload；热更新程序集使用 Attribute。

## 6. 运行时辅助

精确访问用全签名键；稳定短名用 Attribute/AOT XML；需要泛型方法 closure 用 `zents.inflate`。当前已移除 `register_method` 和以已有 closure 为输入的 `make_generic_method`，不提供兼容回退。

## 7. this 绑定

实例及扩展方法的 `obj.Method(...)` 使用该次 JS 调用的 this；`const f = obj.Method; f(...)` 不自动绑定。缓存 closure 后使用 `f.call(obj, ...)`。静态 closure 不需要实例接收者。

## 8. 平台一致性

输入槽、默认值、params 惩罚、泛型约束、类型门面和错误分类必须一致。实现可以使用 Emit、invoker_method 或 specialized bridge，不能用“后端不同”解释选中重载不同。

## 9. 示例

```csharp
public static int Sum(params int[] values) { /* ... */ return 0; }
public static bool TryGet(int key, out string value) { value = null; return false; }
```

```javascript
Demo.Sum(1, 2, 3);
Demo.Sum(...[1, 2, 3]);
const [ok, value] = Demo.TryGet(7);
```

## 10. 实现状态

上述重载、params、out、泛型与声明生成已实现，并纳入 Editor/Player 对照测试；具体平台范围见 [对齐状态](./03-ALIGNMENT.md)。
