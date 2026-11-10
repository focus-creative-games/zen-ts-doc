---
sidebar_position: 2
title: "Bidirectional calls"
---

# Bidirectional calls

Manage the script domain in one application entry point. Use module exports for C#→JS and CLR type objects for JS→C#. The example needs no per-type Wrap.

## CLR type

```csharp
public sealed class Counter
{
    public int Value { get; set; }
    public Counter(int initial) { Value = initial; }
    public int Add(int delta) => Value += delta;
}
```

## Script module

```javascript
const Counter = CSharp['Assembly-CSharp']['Counter'];
export function run() {
  const counter = new Counter(10);
  counter.Value = 12;
  return counter.Add(3);
}
```

After generating declarations, `import { Counter } from 'csharp:Assembly-CSharp'` selects the same binding.

## Call the export

```csharp
JsAppDomain.Initialize(JsFileModuleLoader.Load);
var run = JsAppDomain.GetFunction<System.Func<int>>("main", "run");
UnityEngine.Debug.Log(run()); // 15
```

Initialize once; ordinary components use the existing domain. GetFunction requires initialization, a closed delegate, and nonempty module/export names.

## Extracted methods

```javascript
const counter = new Counter(1);
const add = counter.Add;
add.call(counter, 2);
```

Closures do not capture the receiver automatically. Invalid receivers fail. Reference returns use the declared type's view by default; a derived runtime type does not silently expose additional members.

Players still require stripping preservation, AOT instantiations, and calling bridges. See [types](../concepts/type-system-overview.md) and [builds](build.md).
