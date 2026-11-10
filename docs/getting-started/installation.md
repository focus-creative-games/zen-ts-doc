---
sidebar_position: 1
title: "安装概览"
---

# 安装概览

通过 Package Manager 的 Git URL 安装 ZenTS，或将源码嵌入 `Packages/com.code-philosophy.zen-ts`。

完成以下步骤后再运行脚本：

1. 安装支持政策内的 Unity Editor 与目标平台模块。
2. 从匹配的官方 V8 原始源码构建静态 SDK，编译 ZenTS 适配层并导入项目。Editor 也需要其 OS/CPU 对应的 SDK。
3. SDK 自动保存在 `Library/ZenTS/NativeSDK`；Editor 插件及 `.meta` 自动生成到 `Assets/ZenTSGenerated/Native`。
4. 运行 `ZenTS/Install...`；Player 还需 `ZenTS/Generate Xml Bindings` 、`ZenTS/Generate Typings` 及构建配置。
5. 创建 TypeScript 工程或提供 JS loader，然后调用 `JsAppDomain.Initialize`。

已加载的原生插件更新需要重启 Editor。SDK、DLL/dylib/a/lib 与生成的 `.meta` 由本地流程管理，不写回 PackageCache，也不作为 package 源码提交。

具体构建和导入命令见[安装指南](/docs/guides/install/)，首次调用见[Hello 互操作](/docs/guides/hello-interop/)。
