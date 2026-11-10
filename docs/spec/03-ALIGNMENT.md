---
sidebar_position: 3.5
title: "ZLua 对齐与实现状态"
---

# ZLua 对齐与实现状态

ZenTS 沿用 ZLua 的 CLR 互操作设计，并为 JavaScript 的语言语义和宿主能力作适配。本页说明两者的关系及当前支持范围。

## 1. 设计原则

CLR 类型、成员绑定、重载、Marshal、生命周期和 AOT 配置遵循 ZLua 的设计。JavaScript 特有的 this、undefined、数值、模块和异步行为按下文定义；不机械复制 Lua 的语言机制。具体使用限制以对应规范和平台说明为准。

## 2. 当前能力

| 能力 | 实现 |
|---|---|
| JS 引擎 | 官方原始 V8 13.6.233.17 静态 SDK；WebGL/微信平台 VM；QuickJS 已移除 |
| CLR 内核 | Mono/Emit、IL2CPP 静态桥；共享类型、绑定计划和语义 |
| 重载与泛型 | 全签名懒解析、冻结短名、inflate/GTAP、params/可选参数 |
| Marshal | out 零输入元组、显式 BigInt、Bytes/Uint8Array、声明门面/ActualType |
| 配置 | AOT XML 快照/生成表、Attribute 优先、Unity GetComponent 优化 |
| 分发 | 只读 UPM、Library SDK、Assets 插件及自动稳定 meta |
| HostJs | 静态模块工厂、二进制同步桥、GC/Reset/Unicode、微信转换集成 |
| 调试 | Editor 原生 V8 Inspector；HostJs 使用平台工具 |

## 3. 最新计数和平台边界

截至 2026-11-10，记录中的 Windows Editor、macOS arm64 Editor 和 Win64 均为 **435 个命名用例通过**。Editor Smoke 8/8，Player Smoke 10/10，TS 示例 3/3。Chrome WebGL 和微信开发者工具为 **434 通过、1 个托管工作线程用例显式跳过**，Smoke 10/10、TS 3/3。

测试按独立命名用例计数，模块通过数和 Smoke/TS 示例单独统计；这些数量不代表分支覆盖率或所有设备的兼容性。

macOS arm64/x64 Player、Android x64/arm64 模拟器和 iOS x64 模拟器已有运行验证，但尚未覆盖最新完整用例集。macOS x64 Player 使用 Rosetta；Android arm64 为模拟器转译；iOS arm64 仅无签名编译，不是手机验收。

微信在 Unity 2022.3.62f3、官方转换 SDK 202610200817、开发者工具 2.01.2510260、基础库 3.17.6 下验收。未覆盖手机真机和上传发布。团结引擎已支持，Editor 使用原生 V8，WebGL/微信使用 HostJs。Unity 支持政策为 2022.3.x 及后续 LTS、基于 2022.3 的团结；存在补丁不等于该版本已跑全测试。

## 4. 调试验收限制

Windows Inspector 协议与 Domain Reload 已验证。macOS arm64 的 Inspector 协议和资源清理已验证，但 Unity 2022.3.56f1c1 / macOS 26.0 在 Domain Reload 后存在退出超时问题，尚未解决。macOS x64 Editor 插件仅完成编译验证。

调试功能通过 CDP 协议测试，VS Code 客户端界面未作自动化验证。

## 5. 跟随 ZLua 的规则

短名冻结、全签名受限懒解析、params 竞争、公共 typeArg、声明门面、ByVal/ByObj、Opaque 作用域、扩展配置和 AOT 构建设计保持一致。XML **仅 AOT 有效**，没有热更新、运行时注册或 Reload；热更新程序集依赖 Attribute。

## 6. JS 必要差异

| 项 | 当前裁决 |
|---|---|
| 空值 | null 与 undefined 分开 |
| 实例方法 | JS this；提取后 `.call(receiver, ...)` |
| out | 不占 JS 输入；结果 `[ret, out1, ...]`，void 为 `[out1, ...]` |
| ref | 保留输入；临时重新绑定不改 JS 局部变量、不进入 out 元组 |
| Int64/UInt64 | 默认 number；具体槽显式 BigInt 才是 bigint |
| Bytes | byte[] ↔ 复制 Uint8Array，不是二进制 string |
| 异步 | Promise 不等同 Lua 协程；Opaque 不跨 await |
| 模块 | 原生 V8 模块；HostJs 静态工厂预加载，不运行时 eval |
| GC | 各引擎不同机制，同一根、generation 和 Reset 规则 |

## 7. 平台与测试

支持的平台、已验证环境和已知限制见[项目状态](../getting-started/project-status.md)与[测试说明](../community/testing.md)。开发者应在自己的目标设备、Unity 版本和构建配置下验证适用功能。
