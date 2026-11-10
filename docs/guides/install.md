---
sidebar_position: 1
title: "安装与原生 SDK"
---

# 安装与原生 SDK

ZenTS 支持 Git URL 安装和嵌入式 package。Unity 将 Git 包放入只读 `Library/PackageCache` 是正常情况；安装和构建不会要求修改该目录。

## 安装步骤

1. 通过 Package Manager 安装 `com.code-philosophy.zen-ts`，或将源码放入 `Packages/com.code-philosophy.zen-ts`。
2. 为当前 Editor 的 OS/CPU 构建或导入完整 V8 SDK。
3. 等待 Editor 插件和 `.meta` 自动生成；若旧插件已加载，重启 Editor 激活新版本。
4. 执行 `ZenTS/Install...`，安装项目本地的 IL2CPP 运行时和补丁。
5. 初始化 TypeScript 工程，配置绑定程序集，执行 `ZenTS/Generate Xml Bindings` 和 `ZenTS/Generate Typings`。

包路径通过 Unity `PackageInfo.resolvedPath` 解析。下面的 `<工具目录>` 指该路径下的 `ZenTS~/v8`，不要在脚本里硬编码 PackageCache 的哈希目录。

## Windows SDK

V8 固定为官方原始源码 **13.6.233.17**，提交 `b0a55a7dad7f536cce1f9aaddba89894c8533946`。准备官方源码及 depot_tools 后：

```text
python <工具目录>/build_official.py --source <V8源码> --depot-tools <depot_tools> --out <GN输出> --export <原始SDK> --jobs 4
python <工具目录>/build_win64.py --project <Unity项目> --sdk <原始SDK>
python <工具目录>/import_platform.py --project <Unity项目> --sdk <Unity项目>/Library/ZenTS/NativeBuild/windows-x64/sdk
```

第一步构建官方静态 V8，第二步构建 ZenTS 适配层及 Editor DLL，第三步安装完整 SDK。已有缓存后，`build_win64.py --project <Unity项目>` 可只重建适配层。也可使用 `ZenTS/Native SDK/Import SDK...` 导入完整 SDK。

## Apple 和 Android SDK

```text
python <工具目录>/build_platform.py --package <解析后的包目录> --source <V8源码> --out <GN输出> --export <完整SDK> --target <macos|ios|ios-simulator|android> --cpu <arm64|x64>
python <工具目录>/import_platform.py --project <Unity项目> --sdk <完整SDK>
```

Apple 构建需要 macOS/Xcode；Android 在 Linux 构建并提供 `--ndk <NDK路径>`。iOS 使用 JITless。SDK 必须匹配 OS、CPU、来源版本、编译选项和适配层源码；不能把模拟器库用于设备。

## 文件归属

| 目录 | 内容与维护方式 |
|---|---|
| package | 版本锁、源码、工具和源码 `.meta`；可只读 |
| `Library/ZenTS/NativeSDK/<指纹>/<target>` | 校验后安装的不可变 SDK |
| `Library/ZenTS/NativeBuild` | 本机构建工作目录 |
| `Assets/ZenTSGenerated/Native/<target>` | Editor 插件和自动生成的稳定 GUID `.meta` |
| `Library/ZenTS/LocalIl2CppData-<Editor平台>` | 项目本地 IL2CPP、补丁及生成代码 |

生成的原生二进制和 Native 元数据不提交 Git；源码文件的 `.meta` 正常提交。删除 Library 后需要重新导入 SDK，Assets 中残留的插件不能代替 SDK 校验。可用 `ZenTS/Native SDK/Repair Editor Plugins` 修复缺失插件。团队可在 CI 构建、分发完整 SDK，每个项目独立导入。

[安装概览](../getting-started/installation.md) · [平台支持](../getting-started/compatibility.md) · [构建](build.md)
