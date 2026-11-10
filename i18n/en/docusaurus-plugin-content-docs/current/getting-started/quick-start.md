---
sidebar_position: 2
title: "Run your first script"
---

# Run your first script

Start with a bidirectional call in the Editor, then publish for your target. Use Unity 2022.3.x LTS or a later LTS release and prepare the V8 SDK for the current Editor. Complete [installation](../guides/install.md) first.

## Prepare TypeScript

Run `ZenTS/Init TypeScript Project` to create `TsProject` at the Unity project root and prepare dependencies. Run `ZenTS/Generate Typings` for C# declarations, and `ZenTS/Compile TypeScript` to check and emit. Node.js is a build tool, not the script runtime.

Create `TsProject/src/main.ts`:

```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

Emit should produce `TsProject/out/main.js`. See the [TypeScript workflow](../guides/typescript-workflow.md).

## Call from C#

Attach this component to a scene object. `JsFileModuleLoader` reads development output or published scripts from the conventional locations. Module names have no `.js` suffix.

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

Initialize once per domain, rather than in every component. Cache delegates and reacquire them after Reset takes effect.

## Call C# from scripts

Add a public type under Assets:

```csharp
public static class Demo
{
    public static int Add(int a, int b) => a + b;
}
```

Generate declarations, then write:

```typescript
import { Demo } from 'csharp:Assembly-CSharp';
export function run(): number { return Demo.Add(2, 3); }
```

`csharp:` is a synthesized type module, not a disk file or a GetFunction target.

## Before publishing

Run `ZenTS/Generate Xml Bindings` and `ZenTS/Generate Typings`. Preserve the required metadata, AOT generic instantiations, and bridge entry points, and prepare a matching target SDK. WebGL/WeChat use platform VMs and build-time factories, without Player V8 libraries. See [builds](../guides/build.md) and [platforms](compatibility.md).
