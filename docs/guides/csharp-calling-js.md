---
sidebar_position: 4
title: "C# 调用 JavaScript"
---

# C# 调用 JavaScript

用 `JsAppDomain.GetFunction<T>` 将模块导出绑定为闭合 C# 委托。调用和生命周期由主线程脚本域统一管理。

```javascript
// TsProject/src/calc.ts 也可写同样的函数并 emit
export function multiply(a, b) { return a * b; }
```

```csharp
JsAppDomain.Initialize(JsFileModuleLoader.Load);
var multiply = JsAppDomain.GetFunction<System.Func<int, int, int>>("calc", "multiply");
int result = multiply(6, 7);
```

模块规范名不含扩展名，允许 `game/calc` 这样的路径。`csharp:` 类型模块不能用于 GetFunction。绑定前模块必须可加载，导出必须能作为函数调用。

## 委托生命周期

缓存取得的委托；不保证重复 GetFunction 返回同一委托实例。长期委托保持其 JS 函数可达；丢弃引用或 Reset 时按域生命周期清理。Reset 生效后，旧委托调用会失败，必须重新获取。

委托不能从工作线程调用。JS 返回 Promise 不会让同步 C# 委托自动等待；异步业务需要显式定义自己的完成通知或任务适配，并遵守主线程规则。

## 参数和错误

按委托签名执行 Marshal，不做普通方法的 params 尾部展开。C#→JS 的 ref/out/in 使用调用期 Opaque 句柄；in 只读，函数返回后句柄过期，不能保存在异步任务中。详见 [ref/out/in](ref-out-in.md)。

JS 抛错转换为可诊断的托管脚本异常；CLR 回调错误可被 JS try/catch 捕获。不要要求不同引擎的错误栈逐字一致，也不要让异常直接穿越 native callback ABI。
