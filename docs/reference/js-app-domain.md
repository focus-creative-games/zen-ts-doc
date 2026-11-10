---
sidebar_position: 2
title: "JsAppDomain"
---

# JsAppDomain

`ZenTS.JsAppDomain` 是主线程脚本域的静态门面。具体 CLR 和引擎实现由环境选择，业务不手工注入 backend。

```csharp
public static void Initialize(Func<string, object> moduleLoader);
public static T GetFunction<T>(string jsModule, string jsExportName)
    where T : MulticastDelegate;
public static void Reset(Func<string, object> moduleLoader);
public static void ApplyPendingResetNow();
```

## Initialize

loader 不能为 null。同一活跃域不能重复初始化。调用前准备原生插件或 HostJs 工厂；初始化安装内置库、配置、模块加载与帧泵。加载器按规范模块名返回支持的模块来源，常见为源码 string；`JsFileModuleLoader.Load` 可作为约定路径加载器。

`csharp:` 由门面包装的 loader 拦截并合成，不要求业务读取同名文件。HostJs 只接受构建时编译过的模块/源码变体，不因 loader 返回新字符串就允许 eval。

## GetFunction

初始化后取得模块函数导出的闭合委托。模块和导出名非空；模块名会规范化，不能传 csharp: 类型模块。建议缓存返回值，不保证不同调用委托引用相同。

按委托固定签名 Marshal，不展开 params，不自动 await Promise。JS 错误会转换成托管脚本异常；旧 generation 委托不可继续调用。

## Reset

loader 不能为 null。Play Mode 中预约到 EndOfFrame 执行；Editor 非播放/批处理立即应用。重建脚本上下文、模块缓存与域代次，旧函数、wrapper 和 Opaque 按生命周期失效。HostJs 不销毁平台全局 VM。

Reset 不重载 AOT XML、不补出缺失 AOT 代码，也不是任意 CLR DLL 热加载入口。

## ApplyPendingResetNow

在主线程安全边界显式应用已预约的 Reset；没有预约时无事可做。不要在仍借用旧域值的嵌套回调中强行销毁当前域。

没有公开 Shutdown API。主线程身份由 Unity 初始化捕获，公共入口和已绑定脚本委托拒绝工作线程访问。详见[宿主规范](../spec/01-HOST-API.md)及[生命周期](../spec/10-LIFETIME.md)。
