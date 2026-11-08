---
sidebar_position: 6
title: "HostJs 与小游戏"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 构建 — HostJs

## 1. 目标与当前状态

WebGL 与微信等小游戏直接使用平台已有 JS VM，WASM 内不再放 QuickJS 或 V8。使用相同 CLR 类型、绑定计划、重载和 Marshal 规则，新增的是 JS↔WASM 值传输及模块/平台适配。

**当前 P1 只完成公共引擎边界。** 嵌入包的 HostJs GetFunction 与通用 dispatch 等仍为原型/桩；旧文档关于 quickjs.h 垫片、完整模块运行时和 P4 已验收的描述不能作为实现事实。HostJs 完整实现与 WebGL 回归在 P4，微信真机发布在 P6。

## 2. 目标选择

由明确的 BuildTarget/SDK 适配与产物 manifest 选择 HostJs，同步托管分支、native 编译和 JS bundle。不能仅凭目标名包含 MiniGame 判定全部小游戏，也不能只在已经开始构建的 preprocess 阶段修改 define 后假定本次 C# 已用新分支编译。

Unity 2022.3.x WebGL 与团结小游戏均为目标；需要分别验收实际 SDK 接口和 glue。当前 ZENTS_HOST_JS 只是过渡选择标记，不表示支持矩阵已经完成。

## 3. 同步调用帧

JS 与 Unity/WASM 逻辑默认在同一线程/可同步调用环境。JS wrapper 批量编组参数后进入 WASM，内核根据绑定 ID 与计划完成匹配/调用，再编组返回或错误。正式通用路径采用 tagged slot/二进制帧，不能依赖 JSON 表达所有值。

| 值 | 传输要求 |
|---|---|
| number/boolean/null/undefined | 各有独立 tag，不合并空值 |
| 默认 Int64/UInt64 | 按 number 契约，允许约定的精度损失 |
| 显式 BigInt Int64/UInt64 | 完整整数负载，可用 64 位位模式或拆分槽；不能先经 double |
| 字符串 | UTF-8 指针及长度，保留内嵌零 |
| CLR/JS 对象与 callable | 句柄、所有者及 generation |
| bytes | 明确长度和复制/借用所有权，默认复制 |
| out/UnpackedValues 结果 | 按统一逻辑结果槽编码，区分元组与其嵌套成员数组 |

每次重入需要独立参数/结果帧；不能用单一全局 scratch buffer。WASM 内存增长后重新取得 TypedArray view，不能长期缓存失效 heap view。目标是减少跨界次数，但用户 getter、代理和 callback 仍可能导致额外调用，不承诺所有场景只跨一次。

## 4. 引用与 GC

句柄带 generation，释放和 Reset 后拒绝旧 wrapper；复用槽不能让旧 token 指向新对象。JS wrapper 保活 CLR GC root，CLR delegate 保活 JS 函数引用。

宿主有 WeakRef/FinalizationRegistry 时可用于辅助回收；不能要求 GC 立即执行，也不能在缺少它们的平台假装具备等价自动回收。能力不足时采用显式释放/受控作用域并在支持矩阵声明。事件与双向强引用环需要注销或 Dispose/Reset。

## 5. 模块加载

使用构建工具解析 ESM 并产生 bundle/可重建模块注册表，构建期生成 csharp: 模块。所需模块预加载完成后开放同步 GetFunction；不能在同步 CLR callback 中等待网络。

不以 eval/new Function 或运行时正则改写完整 ESM 为依赖。支持的 import/export、循环依赖和 live binding 范围由实际构建器与测试确定；动态 import/顶层 await 未验收时须明确拒绝或在构建期诊断，不能伪造已 fulfilled 的 Promise。

Reset 须重建 ZenTS 模块实例，不能只清空 C# 缓存却继续复用宿主原生 ESM 的旧单例。不能销毁 wx/浏览器全局 VM；域外副作用须明确管理。

## 6. Promise、线程与平台能力

使用宿主 Promise/微任务系统；WASM 调用结束后的 job 时序与 Native checkpoint 规则按可观测行为对齐，不要求相同内部队列。旧 generation 的 callback 不得重新进入新域，Opaque 不能跨 await 使用。

Worker 是异步扩展能力，不能默认为支持同步 GetFunction/CLR 任意重入。平台 wx API 可以由宿主脚本直接调用，不要求全部先绕 C# SDK。

## 7. 发布适配

适配器负责 Unity/团结产物接线、导出保留、JS bootstrap、bundle/分包就绪、source map 和错误上报。AOT XML 在 Generate 烘焙，不在小游戏下载或重载 XML。最终包中没有内嵌引擎副本。

## 8. 验收

先通过真实浏览器 WebGL 的双向互操作矩阵，再验证微信开发者工具与真机。至少包括返回/异常、重入、out/BigInt、struct/写屏障、数组、委托身份、Opaque 失效、Reset、资源就绪和内存增长。编译成功、函数能 ping 或旧 Win64 通过均不能替代这些验收。
