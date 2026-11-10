---
sidebar_position: 5
title: "TypeScript 工作流"
---

# TypeScript 工作流

TypeScript 提供静态检查、CLR 声明和 Source Map；ZenTS 运行的是 emit 后的 JavaScript。构建使用 Node 工具链，运行时不包含 Node.js 标准库。

## 工程目录

```text
TsProject/
  src/                  # 手写 TypeScript
  out/                  # emit 的 JS 和 map
  generated/csharp/     # csharp: 声明
  generated/js-exports.json
  tsconfig.json
  package.json
```

`ZenTS/Init TypeScript Project` 初始化工程并准备依赖；`ZenTS/Generate Typings` 生成声明；`ZenTS/Compile TypeScript` 检查并 emit。`Settings.typescriptBindingAssemblies` 决定 CLR 声明覆盖的程序集；默认包含 Assembly-CSharp 和包测试程序集，业务项目应按需配置。

## 类型模块和导出

```typescript
import { Demo } from 'csharp:Assembly-CSharp';
export function compute(a: number, b: number): number {
  return Demo.Add(a, b);
}
```

模块名使用规范化路径，例如 `demo/main`，不带 `.js` 后缀。`csharp:` 合成模块导出类型；`GetFunction` 绑定普通脚本模块的函数导出。

生成声明反映 out 返回元组和显式 BigInt 槽位。64 位整数默认仍是 number；TS 类型声明不能消除浮点精度损失。可选参数、泛型约束和运行时可用的 AOT 实例都应另行验证。

## 检查与发布

`enableTsPlayGate` 默认开启：进入 Play 前检查并在输出过时时 emit。它不能替代 Player Generate 或 AOT 验收。原生和发布资源使用不同复制路径；使用构建处理器，不要手工把某个 Editor 文件路径写死到移动平台。

HostJs 在构建期将 ESM 转成静态模块工厂，运行时不 eval；动态 import/import.meta 与顶层 await 不在当前支持范围。新增模块及 Reset 源码变体需要重新打包。

## 调试源码

保留 emit 的 Source Map 和对应 src/out。默认工具生成 map；Inspector 为 TsProject 提供源码路由。断点未绑定时先检查模块 URL、emit 是否最新、map 是否与 JS 对应，再检查[调试器配置](js-debugger.md)。
