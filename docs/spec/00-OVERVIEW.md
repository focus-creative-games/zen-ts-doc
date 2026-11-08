---
sidebar_position: 1
title: "总览"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 00 — 总览

ZenTS 是 ZLua 的 JavaScript / TypeScript 移植。CLR 类型、成员绑定、重载、Marshal、生命周期和构建配置默认跟随 ZLua；只有 JavaScript 语言与宿主平台确有差异时才单独适配。

**本文及各分册规定目标契约。当前 P0/P1 实现仍使用过渡 QuickJS 适配器；Native V8、完整 HostJs 与新语义尚待后续阶段交付。** 版本基线、实现状态与差异裁决见 [03-ALIGNMENT.md](./03-ALIGNMENT.md)。

## 1. 产品目标

### 1.1 使用方式

- C#→JS 的正式入口为 `JsAppDomain.GetFunction<T>(module, exportName)`；取得委托后自行缓存并调用。
- JS→C# 经 `CSharp[assembly][typeFullName]` 懒绑定，推荐使用指向同一类型对象的 `csharp:` named import。
- 静态调用 `Type.Method(...)`，实例调用 `obj.Method(...)`，构造 `new Type(...)`。提取的实例方法使用 `.call(receiver, ...)`，不自动捕获实例。
- 不要求业务维护逐类型 Wrap 白名单；类型和成员必须仍有可用的 CLR 元数据、AOT 代码及桥接入口。懒绑定不等于不会裁剪或能运行任意未生成泛型。
- TypeScript 是编辑期工具；运行时执行 emit 后的 JavaScript。

### 1.2 Player 发布优化（Il2Cpp）

CLR 元数据解析、绑定计划、重载与 Marshal 保持 C++ 热路径；同类签名可复用桥。首次绑定建立并缓存成员计划、可选默认值及闭合泛型信息。字段和含引用值类型的写回遵守 CLR GC/write barrier 规则。

Mono 使用反射与 Expression Emit，Il2Cpp 使用元数据和预编译桥；二者的 JS 可见行为必须一致。性能优化不得更改选中重载、声明门面或值类型复制语义。

### 1.3 明确边界

| 项 | 契约 |
|---|---|
| Event | 使用 `add_Event` / `remove_Event`，没有独立 event 子对象 |
| CLR 成员 miss | 抛带 `zents:` 前缀的 JS 错误；语言协议探测见类型系统 |
| 继承 | 普通成员 Bind 期扁平化；全签名键另有受限的 miss 懒解析路径 |
| 短名注册 | Bind 后冻结；不提供正式 `register_method` |
| XML | 仅适用于 AOT 程序集；不支持 XML 热更新、运行时注册或 Reload |
| 引擎 | 最终仅 Native V8 / HostJs；QuickJS 不作为长期后端 |
| JS wrapper | 本规范的 exotic/内部槽是抽象模型，不要求 QuickJS 的 JSClassDef，也不限制为某种 Proxy 实现 |

### 1.4 `undefined` 与 `null`（概要）

`undefined` 表示缺失，`null` 表示显式空引用或 Nullable 无值；CLR null 推送为 JS null，void 返回 undefined。它们不能无差别合并。详细匹配及默认值规则见 [marshal/01-OVERVIEW.md](./marshal/01-OVERVIEW.md)。

## 2. CLR 宿主与引擎是两个维度

```text
JsAppDomain / IJsRuntime / zents / csharp:
                    |
           CLR 绑定计划与互操作规则
             /                 \
       Mono + Emit          Il2Cpp + C++
             \                 /
             ZenTS 自有引擎接口
                /           \
          Native V8       HostJs（JS ↔ WASM）
```

| 目标环境 | CLR 宿主 | 目标引擎 |
|---|---|---|
| Windows / macOS Editor | Mono | Native V8 |
| Win64 / macOS / Android Player | Il2Cpp | Native V8 |
| iOS Player | Il2Cpp | Native V8，JITless |
| WebGL / 小游戏 | Il2Cpp/WASM | 平台已有 JS VM；不再内嵌 V8 |

这是目标支持矩阵，不是已验收平台清单。当前只验收 Windows Editor 与既有 Win64 导出工程上的 P1 过渡后端。V8 无可用实现的 Native 平台不回退 QuickJS；HostJs 平台也不借此承诺所有平台能力相同。

## 3. 文档地图

| 文件 | 职责 |
|---|---|
| [01-HOST-API.md](./01-HOST-API.md) | 初始化、Reset、GetFunction、异常 |
| [02-TYPE-SYSTEM.md](./02-TYPE-SYSTEM.md) | 类型、门面、构造、继承 |
| [03-ALIGNMENT.md](./03-ALIGNMENT.md) | ZLua 基线、JS 差异、实现状态及裁决 |
| [04-METHOD-OVERLOAD.md](./04-METHOD-OVERLOAD.md) | 懒签名、GTAP、params、选优 |
| [05-LIB.md](./05-LIB.md) | zents API、inflate 与类型实参 |
| [marshal](./marshal/index.md) / [成员分派](./metatable/index.md) | 双向值转换及成员模型 |
| [10-LIFETIME.md](./10-LIFETIME.md) | GC、作用域、线程及 Reset |
| [11-MULTI-VERSION.md](./11-MULTI-VERSION.md) | 安装、版本、构建与增量迭代 |
| [12-MIGRATION-ADAPTORS.md](./12-MIGRATION-ADAPTORS.md) | 历史 API 迁移 |
| [13-EXTENSION-METHODS.md](./13-EXTENSION-METHODS.md) | 扩展方法配置与竞争 |
| [14-TYPESCRIPT.md](./14-TYPESCRIPT.md) | emit、声明、模块和打包 |
| [15-SETTINGS.md](./15-SETTINGS.md) / [16-UNITY-OPTIMIZATIONS.md](./16-UNITY-OPTIMIZATIONS.md) | 配置与 Unity API 优化 |
| [V8](./build/02-V8.md) / [引擎边界](./build/07-ENGINE-BOUNDARY.md) / [HostJs](./build/06-HOSTJS.md) | 引擎集成 |

## 4. 初始化流程

1. 按环境创建 CLR 宿主与对应引擎适配器，建立域 generation。
2. 安装模块解析、内置库、类型根对象和必要的 AOT 配置表。
3. 首次访问类型时建立绑定计划及引擎对象；短名冻结，全签名键按需缓存。
4. `GetFunction` 加载就绪模块并生成委托；Promise 不会被同步委托自动等待。
5. 帧泵处理待释放引用；预约的 Reset 在 EndOfFrame 生效，旧委托及句柄失效。

HostJs 必须在同步绑定前完成所需 bundle/分包的预加载；Reset 只重建 ZenTS 管理的脚本世界，不销毁浏览器或小游戏宿主 VM。
