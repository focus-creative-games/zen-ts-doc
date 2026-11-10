---
sidebar_position: 14
title: "TypeScript 工作流"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# 14 — TypeScript 工作流

## 1. 边界

TypeScript 在编辑/构建阶段检查与 emit，运行时只执行 JavaScript。Native V8 与 HostJs 使用相同 CLR 语义；HostJs 额外进行模块打包/预加载。当前已接入 Editor emit 与 HostJs 构建期工厂；两者分别执行和验证。

## 2. 工程布局

TsProject/src 为业务 TS，TsProject/out 为 emit 后 JS，generated 保存 csharp: 声明与模块信息。Library/ZenTS/CoreLibs 暂存包内 types/jslib。产物来源和配置须可追溯，不在只读 UPM 缓存生成业务源码。

## 3. 检查与 emit

进入 Play 和构建前按设置运行 tsc --noEmit，再由工具链 emit。类型错误阻止对应流程；显式跳过检查只能作为维护/CI 选项，不改变运行时契约。运行时不读取 .ts，不把类型检查当作 AOT 方法必然保留的证明。

## 4. `csharp:` 声明与模块

specifier 在第一个 / 拆成程序集与类型命名空间/声明类型路径，nested 使用 CLR + 规则。named export 对应 CSharp 的同一类型对象；默认导出不用于 CLR 类型模块。canonical 业务模块路径不含 .js。

声明与运行时模块从同一类型集合生成；import type 在 TS 中会被擦除，不能当作运行时类型对象使用。泛型声明类型先闭合，再调用方法泛型；公共 typeArg 与 GTAP 的子集规则必须在声明中区分。

## 5. 数值声明

| CLR 槽位 | TypeScript |
|---|---|
| 默认整数（包括 Int64/UInt64）与浮点 | number |
| 显式 JsMarshalType.BigInt 的 Int64/UInt64 | bigint |
| Nullable\<T\> | 对应 T 或 null |
| 默认 64 位 enum | number，不自动变 bigint |

不能全局把 long/ulong 映射成 bigint。参数、返回值、字段、属性及合法 byref 元素的标注要分别消费；无关数组元素或 object 不继承标注。

## 6. 调用声明

- JS→CLR out 参数从输入签名移除，输出为 tuple；有非 void 返回值放在第一项。
- void+out 也返回 tuple，单个 out 不退化成标量。
- ref/in 保留输入，并表达允许的值/合法 Opaque 形态；普通 JS 变量不因 CLR ref 重新绑定而改变。
- params 可用 rest 签名表达展开，并显式支持单个兼容 CLR 数组 wrapper；不把 JS Array 默认为整段 CLR params 数组。
- UnpackedValues 的参数展开和结果成员数组由同一 Members 计划生成；out tuple 中的成员数组嵌套，不拍平。

```typescript
// C#: bool TryGet(int key, out string value)
TryGet(key: number): [result: boolean, value: string | null];
// C#: void Position(out float x, out float y)
Position(): [x: number, y: number];
// C#: [return: JsMarshalAs(BigInt)] long Exact()
Exact(): bigint;
// C#: long Approximate()
Approximate(): number;
```

上例是当前生成器的声明成员片段；tuple/BigInt 按同一槽位计划生成。

## 7. Native V8 发布

loader 提供 canonical 对应 JS 源码；模块编译/链接/求值交给 V8 适配器。GetFunction 只绑定已同步就绪的 named export；不能阻塞等待顶层异步。source URL 与 source map 对应 TS 原文件，缓存键包含源码与引擎版本。

## 8. HostJs 发布

构建器解析 ESM、合成 csharp: 模块并输出平台可加载的包/可重建模块注册表。不能用字符串正则宣称支持完整 ESM，也不依赖运行时 eval/new Function。普通 import/export、循环依赖与 live binding 依实际构建器和用例验证；当前明确拒绝 dynamic import、import.meta，顶层 await 由 CommonJS 构建诊断拒绝。

分包网络加载是异步准备；准备完成后再启动依赖这些模块的同步 CLR 入口。Reset 要重建 ZenTS 模块实例，不能沿用宿主不可重置的原生 import 单例冒充新域。

## 9. 资源与平台

Editor 从 TsProject/out 读取；Android、WebGL/微信的来源可经 Resources/TextAsset 发布。HostJs 实际执行的是静态预编译工厂，文本用于来源身份匹配，不进行运行时 eval；代码包、source map 和分包由发布适配器接线。

wx API 可从宿主脚本直接访问，但它不自动出现在 Editor V8。跨平台业务应经明确应用层 facade 或平台能力检测，而不是为 Editor 引入另一个不一致的 CLR Marshal。

## 10. 配置与验收

XML 只用于 AOT 元数据在初始化/Generate 阶段的配置；生成器不能为热更新程序集输出运行时 XML 注册 bootstrap。热更新程序集从自己的 Attribute/元数据生成声明或模块描述。

检查、emit、声明与 source map、默认 number/显式 bigint、out tuple、params、泛型和 bundle 加载分别验证。声明生成与三个 TS demo 已纳入验收，但不等于所有 TS 语法、AOT 泛型或平台设备均已覆盖。
