---
sidebar_position: 12
title: "迁移与兼容适配"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 12 — 迁移与兼容适配

## 1. 目标

迁移层可以调整业务入口写法，不能更改核心重载、门面、生命周期或 XML 有效范围。旧过渡 API 的存在不等于长期兼容承诺；实现差距见 [03-ALIGNMENT.md](./03-ALIGNMENT.md)。

## 2. 旧接口替换

| 旧设计 | 目标设计 |
|---|---|
| Bind 期预挂重载全签名键 | 所有 public 方法支持受限 miss 懒签名解析和缓存 |
| register_method(name, closure) | Bind 期 Alias/AOT XML；缓存 closure 后 `.call(receiver, ...)` |
| make_generic_method(closure, ...types) | `inflate(closedType, nameOrSignature, ...types)`，或 GTAP |
| typeof 结果不能作为 typeArg | 公共 typeArg 接受 System.Type；GTAP 仍只接受 System.Type wrapper |
| params 仅一个数组槽 | params 尾部展开或已有 CLR 数组 wrapper；JS Array 用 spread |
| JS→CLR out 占位 | out 不占输入，返回 tuple |
| 默认 bigint 或 bigint 全禁 | Int64/UInt64 **默认 number**，显式 `[JsMarshalAs(BigInt)]` opt-in |
| Runtime XML 注册/热更新 | 不支持；XML 只配置 AOT，热更新程序集使用 Attribute |
| 核心直接 QuickJS API | 自有引擎接口；Native V8 / HostJs |

这些是目标迁移，不在 P1 重构中悄悄更换旧测试期望。

## 3. 类型入口

权威路径为 CSharp[assembly][fullName]，推荐 csharp: named import。业务可自行建立普通 JS 别名对象；不在核心增加命名空间链式猜测，也不把命名空间 . 与嵌套类型 + 混同。

## 4. 缓存实例方法

```javascript
const run = obj['Run(System.Int32)'];
run.call(obj, 5);
```

不能为缓存性能重新向 CLR 类型写短名，也不能假定提取方法自动捕获接收者。业务自有 JS facade 可定义 helper，但它不能伪造 CLR 实例身份或修改绑定表。

## 5. 泛型

```javascript
const f = zents.inflate(MyClosedType, "Describe(T)", zents.types.int32);
const text = f.call(instance, 42);
// 或 instance.Describe(zents.typeof(Int32), 42)
```

inflate 给出已闭合声明类型，避免从旧 closure 猜测静态/ByObj/ByVal。ByVal 泛型使用其自身 GTAP；不能把一个 ByObj closure 直接用于 ByVal payload。

## 6. out 与 BigInt

```javascript
const [ok, value] = Store.TryGet(key); // 不再传 out 占位
const approx = Store.GetCounter();   // 未标注 long：number
const exact = Store.GetExactCounter(); // 显式 BigInt 返回值：bigint
```

迁移声明时只把显式 BigInt 槽改为 TS bigint；不能全局把 C# long/ulong 改成 bigint。Default 大整数可能舍入，调用方需要精确值时改 CLR API 标注并同步其声明。

## 7. XML 与热更新

删除任何运行时 RegisterAliasXml/RegisterMarshalAsXml/RegisterExtensionXml/Reload 依赖。AOT DLL 的配置在初始化/Generate 消费；热更新 DLL 的规则放 Attribute。Assembly.Load 或 Reset 不能使新 XML 动态生效。

## 8. 引擎迁移

业务代码不携带 JSContext、JSValue、v8::Local 或依赖 QuickJS refcount。原生扩展单独适配 Native V8 或 HostJs；内嵌 V8 不提供 Node addon 兼容保证。无法支持的平台明确拒绝，不自动回退另一套旧语义。

## 9. 验证

相同 CLR fixture 验证返回、选中候选、门面、写回和失败分类。因平台本身缺能力的跳过项单独记录，不能跳过普通方法/委托/Opaque 等核心互操作来宣称支持。
