---
sidebar_position: 2
title: "宿主 API"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 01 — 宿主 API

## 1. `JsAppDomain`

### 1.1 职责

`JsAppDomain` 是唯一推荐宿主门面。`ZenTS.Common` 不引用 Mono/Il2Cpp 后端程序集，按环境反射创建实现 `IJsRuntime` 的宿主。

```csharp
public interface IJsRuntime
{
    void Initialize(Func<string, object> moduleLoader);
    void Reset(Func<string, object> moduleLoader);
    void ProcessPendingRefReleases();
    Delegate GetFunction(Type delegateType, string jsModule, string jsExportName);
}

public static class JsAppDomain
{
    public static void Initialize(Func<string, object> moduleLoader);
    public static void Reset(Func<string, object> moduleLoader);
    public static T GetFunction<T>(string jsModule, string jsExportName)
        where T : MulticastDelegate;
}
```

Editor 使用 Mono 宿主；Native Player 使用 Il2Cpp；WebGL/小游戏由 Il2Cpp 连接 HostJs。引擎目标是 Native V8 / HostJs；当前 P1 的实际后端见 [实现状态](./03-ALIGNMENT.md)。不公开 `Shutdown` 或让业务手工注入内部 backend。

### 1.2 整域重置（`Reset`）

| 调用 | 行为 |
|---|---|
| Initialize | 创建唯一脚本域并安装 loader；重复初始化抛异常 |
| Reset | 只预约；本帧 EndOfFrame 才执行清理与重建，同帧多次预约最后一次生效 |

清理顺序为：处理待释放引用、失效旧 generation、拆模块/绑定/持久 JS 引用、关闭域资源，再建立新域。进程级桥接注册和 AOT 配置表不因 Reset 接受新的 XML。旧 GetFunction 委托及旧 wrapper 在 Reset 生效后必须失效。

HostJs 不能销毁宿主 VM；应重建 ZenTS 的模块实例、句柄表和受管理的副作用。由业务直接注册且未纳入域管理的 wx 事件或定时器需要业务主动注销。

### 1.3 模块加载器

`moduleLoader(canonical)` 返回 JS 源码（通常 string）；兼容的 byte[] 返回必须明确为源码字节。canonical 不含 `.js`，不读取 TS。失败抛可诊断异常。`csharp:` 为保留前缀，不交给业务 loader。

Native V8 使用引擎模块接口；HostJs 将模块解析与执行适配到预构建模块包。所需 bundle/分包须先异步准备完成，不能在同步 loader 内阻塞等待网络，也不能用 `eval` 作为必须前提。详见 [14-TYPESCRIPT.md](./14-TYPESCRIPT.md)。

### 1.4 帧泵

LateUpdate 处理待释放引用；EndOfFrame 应用预约 Reset。JS 微任务应由引擎适配器按 [生命周期](./10-LIFETIME.md) 的时序推进，不自行创建另一套 Promise 语义。

### 1.5 XML 与 AOT 程序集

XML 的唯一用途是为 AOT 程序集补充 Alias、MarshalAs 和 Extension 配置。Editor 初始化或 Il2Cpp Generate 消费它们；Player 使用烘焙结果。热更新程序集只使用 Attribute。

**不提供 `InteropMetadata.RegisterAliasXml` / `RegisterMarshalAsXml` / `RegisterExtensionXml`、Reload 或任何运行时 XML 注册入口。** Reset、Assembly.Load 与热更新加载都不能使 XML 在运行时生效。见 [Settings](./15-SETTINGS.md)。

## 2. `GetFunction` — C# 调用 JS

按模块和 named export 取得可调用函数，按具体委托签名绑定并返回。须在 Initialize 后调用，不能依赖同类型静态字段初始化顺序。API 不保证多次返回同一个 delegate；热路径由调用方保存。

```csharp
var add = JsAppDomain.GetFunction<Func<int, int, int>>("app", "add");
int sum = add(10, 20);
```

```javascript
export function add(a, b) { return a + b; }
```

未初始化、模块未就绪、导出缺失/非 callable、签名无可用桥时必须失败，不能返回空委托或静默使用不兼容桥。Il2Cpp 需要实际存在的 AOT 泛型及签名桥；无法动态补出任意机器码。

C#→JS 的 ref/in/out 默认传 OpaqueValue；JS 回调通过 get/set 读写，调用返回前必须完成。普通同步 delegate 不自动等待 Promise；需要异步能力时显式定义应用层契约。delegate/GetFunction 的 params 展开不在支持范围内。

## 3. `[JsMarshalAs]`

参数、返回值、字段、属性及合法的类型级可配置 Marshal。类型级只允许非泛型类型；开放泛型成员的槽位规则在闭合后校验。非法 Attribute 在 Editor 记录错误并回退 Default；XML/Generate 配置错误硬失败。

Default 与 Object/Bytes/OpaqueValue/Table/UnpackedValues/ActualTypeUserData/**BigInt** 的合法集合见 [marshal/02-MARSHAL-AS.md](./marshal/02-MARSHAL-AS.md)。Int64/UInt64 默认 number；BigInt 必须显式标注，不得默认为 bigint。

## 4. `[JsAlias]`

Alias 替换默认名字，不双挂；不同方法可撞同一最终短名并进入重载组。Attribute 优先于 AOT XML。Bind 后不能用脚本重新挂短名；精确访问使用懒全签名键。

## 5. JS→C# 回调

业务无需逐成员 callback Attribute。Editor 的引擎入口和反向回调必须经过自有适配接口，不能绕过边界调用引擎 DLL。Mono 的托管异常不能穿过 unmanaged callback 返回；适配器在 native 安全边界转成 JS 错误。

## 6. 异常边界

| 方向 | 行为 |
|---|---|
| C#→JS | JS 失败转为 JsScriptException 或等价 C# 异常，保留诊断信息 |
| JS→C# | C# 失败转为可由 JS try/catch 捕获的错误 |
| 嵌套调用 | 维护独立错误/参数帧；不得用全局槽覆盖外层状态 |
| Opaque 过期 | 读、写或传回均失败，不能继续解引用旧地址 |

只要求失败分类和 `zents:` 前缀稳定，不要求 V8、HostJs 或不同 CLR 宿主生成相同的完整堆栈文本。

## 7. Codegen 约束

默认值在绑定时物化，热调用不解析 metadata blob。JS→CLR 的 out 不占输入，调用后按元组返回；params 与 UnpackedValues 的槽数必须同时用于匹配和调用。Mono 与 Il2Cpp 不得一端采用旧 arity、一端采用新规则。
