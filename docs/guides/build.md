---
sidebar_position: 22
title: "构建与发布"
---

# 构建与发布

先选 CLR 宿主和 JS 后端，再准备对应产物。支持的 Unity 系列为 2022.3.x LTS 及后续 LTS，另含基于 2022.3 的团结引擎；具体运行证据见[平台矩阵](../getting-started/compatibility.md)。

## 所有 Player 的共同步骤

配置绑定程序集和 AOT XML；执行 TypeScript 检查、emit 及 `ZenTS/Generate Xml Bindings` 和 `ZenTS/Generate Typings`；确认裁剪规则、泛型实例和签名桥齐全。Generate Xml Bindings 生成三类 AOT XML 配置表，Generate Typings 生成 C# 声明。共享 invoker/签名桥由运行时及 AOT 工具链提供；这些菜单不会补出任意泛型机器码，也不生成业务逐类型 Wrap。

使用 `ZenTS/Install...` 安装项目本地 IL2CPP 源码和所需补丁。构建通过不等于所有运行用例通过，尤其要在目标平台检查委托、值类型写回、异常、GC 和 Reset。

## 原生 Player

| 目标 | 构建产物与链接 |
|---|---|
| Win64 | 静态 V8 和 ZenTS 适配库链接到 Player；VS 导出包含所需库 |
| macOS | 匹配 arm64/x64 的静态库；Editor 插件另行安装 |
| Android | Linux/NDK 构建目标 ABI 的静态库，再由 Unity 构建链接 |
| iOS | JITless V8 静态库复制到 Xcode 工程；设备与模拟器分别构建 |

SDK 位于 Library，package 不需要写权限。见[SDK 安装](install.md)。只修改 C++ 时可增量编译既有 Win64 VS 导出；修改 C# fixture、类型或生成表输入时，重新 Generate 并导出 IL2CPP 工程。

## WebGL

WebGL 使用浏览器 VM，WASM 内不链接 V8。构建处理器将 ESM 打包为预编译模块工厂，并合成 `csharp:`；启动前预加载所需脚本。不是运行时读取源码再 eval。

宿主必须提供 Proxy、BigInt、WeakRef 和 FinalizationRegistry；当前使用单线程构建。动态 import、import.meta 明确拒绝，顶层 await 由构建器诊断。源码中的 Reset 变体也必须预编入产物。详见 [HostJs 规范](../spec/build/06-HOSTJS.md)。

## 微信小游戏

先安装[官方 Unity/团结小游戏转换 SDK](https://github.com/wechat-miniprogram/minigame-tuanjie-transform-sdk)，再使用 `ZenTS/Build WeChat Mini Game`，或批处理入口 `ZenTS.Editor.WeChatBuild.RunBatch`。ZenTS 通过反射调用转换 SDK，不要求普通原生项目依赖它。

可用环境变量：

| 名称 | 用途 |
|---|---|
| `ZENTS_WECHAT_APPID` | 本次项目的小游戏 AppID |
| `ZENTS_WECHAT_OUTPUT` | 转换输出目录 |
| `ZENTS_NODE` | 指定构建使用的 Node 可执行文件 |
| `ZENTS_WECHAT_ACCEPTANCE=1` | 仅验收：自包含开发包及测试配置 |

正常构建保留 SDK 的分包、CDN 和开发配置，临时调整的模板、图形及代码生成设置会恢复。输出项目通常位于输出根目录的 `minigame`。

已验收微信开发者工具中的实际运行，不代表手机真机、上传或商店发布验收。测试日志收集器属于验收副本，不进入正常游戏；出现本机日志端口拒绝连接时，先确认运行的是测试副本及配套收集器，不能把网络失败当作游戏测试成功。

## 发布检查

检查构建目标、SDK 身份和 ABI；清除旧缓存影响；运行适用测试并记录显式跳过。Editor Inspector 只在 Editor 启用，Player 不带该监听服务。完整证据和剩余限制见[项目状态](../getting-started/project-status.md)。
