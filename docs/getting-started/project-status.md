---
sidebar_position: 4
title: "实现状态与验收边界"
---

# 实现状态与验收边界

本页列出截至 **2026-11-10** 的功能与验证范围。编译、模拟器运行和真机运行分别说明，便于评估目标平台的使用条件。

## 已完成

Unity 与团结引擎支持、原生 V8、Editor Mono 与 Player IL2CPP、HostJs WebGL/微信、ZLua 对齐语义、只读 UPM 安装、项目级静态 SDK、TypeScript 工作流和 Editor Inspector 均已落地。QuickJS 已移除。

| 验收组 | 命名 JS 用例 | 外围 smoke / TS demo |
|---|---|---|
| Windows Editor | 435 通过，0 失败 | 8/8、3/3 |
| Win64 Player | 435 通过，0 失败 | 10/10、3/3 |
| macOS ARM64 Editor | 435 通过，0 失败 | 8/8、3/3 |
| Chrome WebGL | 434 通过、1 明确跳过、0 失败 | 10/10、3/3 |
| 微信开发工具 | 434 通过、1 明确跳过、0 失败 | 10/10、3/3 |

`56/56` 是模块通过数，不能写成 56 个测试。52 个模块含命名 JS 测试，另外 4 个是由 C# 驱动的导出/初始化支持模块。HostJs 唯一跳过项是单线程构建不可执行的托管工作线程用例。测试数不是分支覆盖率。

## 历史平台验收

macOS ARM64/x64 Player、Android ARM64/x64 模拟器、iOS x64 Simulator 已通过较早的完整模块测试、10 个 Smoke 和 3 个 TS 示例，尚未完成最新 435 个命名用例的全部回归。iOS ARM64 仅无签名编译通过。微信使用 Unity 2022.3.62f3、官方转换 SDK `202610200817`、开发工具 `2.01.2510260`、基础库 `3.17.6`；没有真机、上传或正式发布验收。团结引擎已支持，其微信小游戏目标使用 HostJs。

## Inspector 与已知限制

Windows Inspector 协议及 Domain Reload 验证通过。macOS ARM64 的协议和 Inspector 资源清理已验证，但 Unity 2022.3.56f1c1 / macOS 26.0 在 Domain Reload 后存在退出超时问题，尚未解决。Intel Editor 插件仅完成编译验证。

## 在项目中验证

需要新增平台或升级 SDK 时，应重跑该平台适用测试。优先按[安装](/docs/guides/install/)、[构建](/docs/guides/build/)与[测试说明](/docs/community/testing/)验证自己的工程。
