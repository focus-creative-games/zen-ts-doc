---
sidebar_position: 2
title: "第一次运行脚本"
---

# 第一次运行脚本

本节先在 Editor 完成一次双向调用，再按目标平台发布。需要 Unity 2022.3.x LTS 或更高的 LTS，并准备当前 Editor 平台的 V8 SDK。先完成[安装](../guides/install.md)。

## 准备 TypeScript 工程

执行 `ZenTS/Init TypeScript Project`，在 Unity 工程根目录建立 `TsProject` 并准备依赖；执行 `ZenTS/Generate Typings` 生成 C# 声明，`ZenTS/Compile TypeScript` 执行检查与 emit。Node.js 是构建工具，不是 ZenTS 的脚本运行时。

新建 `TsProject/src/main.ts`：

```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

emit 后应存在 `TsProject/out/main.js`。完整工作流见 [TypeScript](../guides/typescript-workflow.md)。

## 从 C# 调用

将下面组件挂到场景对象。`JsFileModuleLoader` 读取约定的开发输出或已发布脚本；业务模块名不带 `.js` 后缀。

```csharp
using System;
using UnityEngine;
using ZenTS;

public sealed class ScriptEntry : MonoBehaviour
{
    private Func<int, int, int> add;

    private void Start()
    {
        JsAppDomain.Initialize(JsFileModuleLoader.Load);
        add = JsAppDomain.GetFunction<Func<int, int, int>>("main", "add");
        Debug.Log(add(2, 3)); // 5
    }
}
```

同一域只初始化一次；不要让每个业务组件都调用 Initialize。缓存取得的委托，并在 Reset 生效后重新获取。

## 从脚本调用 C#

在 `Assets` 中加入公共类型：

```csharp
public static class Demo
{
    public static int Add(int a, int b) => a + b;
}
```

生成 C# 声明后，脚本可写：

```typescript
import { Demo } from 'csharp:Assembly-CSharp';
export function run(): number {
  return Demo.Add(2, 3);
}
```

`csharp:` 是 ZenTS 合成的类型模块，不是磁盘文件，也不应传给 `GetFunction`。

## 发布前再做两步

运行 `ZenTS/Generate Xml Bindings` 和 `ZenTS/Generate Typings`，保留业务类型元数据、所需 AOT 泛型和桥接入口；构建匹配目标平台的 SDK。WebGL/微信使用平台 VM，需要构建期模块工厂，不链接 Player V8 库。具体步骤见[构建](../guides/build.md)，能力与实际验收见[平台矩阵](compatibility.md)。
