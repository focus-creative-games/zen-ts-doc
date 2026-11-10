---
sidebar_position: 6
title: "HostJs、WebGL 与微信小游戏"
---

# HostJs、WebGL 与微信小游戏

## 1. 后端与目标

WebGL/微信直接使用平台 JS VM，WASM 内没有 V8/QuickJS。复用同一 EngineApi、CLR 类型、绑定计划、重载和 Marshal 内核；变化集中在传输、模块和平台启动。

目标明确匹配 WebGL 或 WeixinMiniGame，不使用“名字包含 MiniGame”的泛匹配。C# 分支包含 UNITY_WEBGL、明确微信宏和 ZENTS_HOST_JS；Editor 始终选择原生 V8。已支持团结引擎，微信小游戏目标使用同一 HostJs 内核和对应构建流程。

## 2. 同步调用协议

JS/WASM 默认同线程同步往返，使用自有 16 字节值及 HostOperation 二进制协议，不用 JSON/ccall 原型。参数、receiver、结果与错误均有独立调用帧，支持嵌套重入。

| 值 | 规则 |
|---|---|
| number、boolean、null、undefined | 独立 tag，不合并空值 |
| 默认 long/ulong | number，允许约定精度损失 |
| 显式 BigInt long/ulong | 完整整数负载，不先经 double |
| 字符串 | UTF-8 指针和长度，保留内嵌零与非 BMP 字符 |
| CLR/JS 对象与函数 | 所有者、句柄与 generation |
| Bytes | 明确长度与复制所有权 |
| out/UnpackedValues | 保留元组及嵌套数组层次 |

WASM 内存增长后刷新 TypedArray view；UTF-8 适配覆盖无 TextDecoder 宿主、BOM、非法序列替换和内嵌零。不能长期复用失效 heap view 或共享单一 scratch frame。

## 3. GC 与 Reset

需要 Proxy、BigInt、WeakRef、FinalizationRegistry。缺少弱引用能力时明确失败，没有使用永久强引用表伪装弱引用的降级路径。

wrapper 保活 CLR 根，CLR delegate 保活 JS 函数。FinalizationRegistry 只排队，Unity 帧泵执行根释放；不得要求 GC 立即回收。句柄和 generation 防止槽复用后旧 token 指向新对象。

Reset 重建 ZenTS 模块实例、缓存和句柄代次，不销毁平台全局 VM。业务直接注册的 wx 事件/定时器需要主动解除，跨 GC 强引用环也需要取消订阅。

## 4. 静态模块工厂

构建器用 esbuild 解析 ESM、合成 csharp: 并输出 CommonJS 工厂注册表；内置门面和业务模块都不依赖运行时 eval/new Function/with。启动同步 CLR 入口前必须预加载所需 bundle/分包。

明确拒绝 dynamic import、import.meta，顶层 await 由当前 CommonJS 构建诊断拒绝。不能以伪造 fulfilled Promise 声称支持。支持的 import/export 与循环/live binding 依构建结果和测试确定。

loader/Reset 的源码变体须预编入产物，不能任意下载新源码执行。源码键使用 UTF-16 hex 编码保持转换前后身份，避免微信转换器对日志字符串重写破坏匹配；源码不匹配时硬失败，不能仅按模块名兜底。

## 5. Promise 和线程

使用平台 Promise/微任务，按可观察行为与 native checkpoint 对齐；不建立竞争队列或让同步 GetFunction 自动 await。旧 generation callback 不进入新域，Opaque 不跨 await。

当前为单线程构建；worker 不具备默认同步 CLR 重入能力。wx API 可直接在平台脚本使用，不因此在 Editor V8 出现。

## 6. 微信构建集成

使用官方转换 SDK，可选依赖，不影响普通项目编译。`ZenTS/Build WeChat Mini Game` 或 `ZenTS.Editor.WeChatBuild.RunBatch` 通过反射调用 `WXConvertCore.DoExport(true)`。

正常构建保留开发者的分包/CDN/开发设置，并恢复临时修改的模板、图形、异常、线程及 codegen 配置。HostJs 要求单线程和完整异常；支持 OptimizeSize 下的 fully shared generic delegate ABI。GTAP 检查 invoker 的可用性，不能只检查 methodPointer。

ZENTS_WECHAT_APPID、ZENTS_WECHAT_OUTPUT、ZENTS_NODE 可配置构建；ZENTS_WECHAT_ACCEPTANCE=1 仅用于验收自包含开发包。验收器复制产物到 Library 后注入带 run ID 的临时日志收集，不进入正常发布包；连接失败不能记为测试成功。

## 7. 验收范围

Chrome WebGL 和微信开发者工具当前为 434 个命名用例通过、1 个托管工作线程用例显式跳过，Smoke 10/10、TS 3/3。另有实际 GC/Reset、Unicode、内嵌零、throw undefined 与共享泛型桥测试。详见[对齐状态](../03-ALIGNMENT.md)。

微信验收采用 Unity 2022.3.62f3、SDK 202610200817、开发者工具 2.01.2510260、基础库 3.17.6；官方 SDK 提交 `915d4bf4f60ef0cd1c29316a8d67257185d609a7`。团结引擎微信小游戏目标同样受支持。上述微信验证范围不包含手机真机和上传发布，也不扩大到其他小游戏平台。
