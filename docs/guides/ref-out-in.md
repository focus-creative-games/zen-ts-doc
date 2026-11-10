---
sidebar_position: 11
title: "ref、out 与 in"
---

# ref、out 与 in

双向调用采用不同形态。最容易出错的是把 C# out 占位参数机械搬到 JavaScript 调用中。

## JavaScript → C#

```csharp
public static int Split(int value, out int twice)
{
    twice = value * 2;
    return value;
}
```

```javascript
const Demo = CSharp['Assembly-CSharp']['Demo'];
const [result, twice] = Demo.Split(5); // [5, 10]
```

out **不占输入**。有普通返回值时结果为 `[returnValue, out1, ...]`，void 时为 `[out1, ...]`，没有 out 时保留普通返回形态。不要多传一个 null 作为占位。嵌套的 UnpackedValues 仍是独立数组，不自动展平。

ref/in 占输入。兼容的 Opaque 或精确 ByVal struct 可直接作为输入存储，否则使用临时存储。ref 的临时重赋值不会重新绑定 JS 变量，**也不追加到 out 返回元组**。对象或数组的原地修改仍可见。

## C# → JavaScript

ref/out/in 参数使用调用期 Opaque：

```javascript
export function fill(output) {
  zents.set_opaquevalue(output, 42);
}
```

读取使用 `zents.get_opaquevalue`，写入使用 `set_opaquevalue`。in 为只读；句柄只能在该次 C#→JS 调用返回前使用，不可保存后在 Promise/await 中继续访问。过期访问必须失败。

显式 Marshal 策略作用于合法的 byref 元素槽位，例如 long/ulong 的 BigInt；句柄本身不是整数。完整地址、临时值与回写规则见[byref 规范](../spec/marshal/03-BYREF.md)。
