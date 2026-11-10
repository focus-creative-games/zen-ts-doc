---
sidebar_position: 11
title: "版本、安装与构建"
---

# 版本、安装与构建

## 1. 支持政策

Unity **2022.3.x LTS 及之后的 LTS**，以及基于 2022.3 的团结引擎。普通非 LTS、Unity 2021.3、其他原生平台和其他小游戏 SDK 不因存在兼容代码而自动获得支持。具体 Editor/平台组合需独立验证。

Unity/CLR 工具链版本与 JS 引擎版本是两条轴：原生 V8 由锁定 SDK 决定，HostJs 来自平台 VM。QuickJS 已移除，无引擎切换/回退设置。

## 2. 源码与产物布局

| 路径 | 职责 |
|---|---|
| Runtime/Mono/Engine、Engine/V8 | managed 引擎契约及 Editor V8 ABI |
| Runtime/Mono/Binding | Mono CLR 绑定计划 |
| ZenTS~/zents-runtime/engine | 自有接口、V8/HostJs 适配器 |
| ZenTS~/zents-runtime/binding、bridge、marshal、mt、jvm | CLR 计划与执行 |
| Plugins/WebGL/HostEngine.jslib | 平台 JS/WASM 同步协议 |
| ZenTS~/v8 | 来源锁、SDK 构建和导入工具，不含二进制库 |
| ZenTS~/patches/libil2cpp | Unity/团结兼容补丁 |
| ZenTS~/debugger | Inspector 连接配置与使用说明 |

包不携带完整 stock libil2cpp 或 V8 源码树。生成代码及库安装到项目本地工具链，不写只读 package。

## 3. 只读 UPM 与 SDK

Git URL 安装是正常受支持方式，不强制嵌入 Packages。通过 PackageInfo.resolvedPath 定位包，不硬编码缓存哈希路径。

SDK 位于 `Library/ZenTS/NativeSDK/<指纹>/<target>`，索引为 installed.json；构建目录位于 Library/ZenTS/NativeBuild。Editor 插件及稳定 GUID meta 自动生成到 `Assets/ZenTSGenerated/Native/<target>`，仅匹配 OS/CPU 的 Editor 使用。

SDK 校验固定官方提交、来源、ABI、目标、适配器源码身份和文件哈希。源码身份允许 CRLF/LF 差异，二进制逐字节校验。已加载 DLL/dylib 不原地覆盖；导入更新后重启 Editor 激活。删除 Library 后重新导入，不以 Assets 残留插件绕过校验。

生成的原生库和 Native meta 不提交源码 Git，源码 `.meta` 正常提交。CI 可分发完整 SDK；每个项目本地校验导入。

## 4. Install 与补丁

ZenTS/Install 复制 stock IL2CPP、应用版本匹配补丁、安装 ZenTS runtime 和生成/链接配置，输出到 `Library/ZenTS/LocalIl2CppData-<Editor平台>`。

同 major.minor 内选择不大于 Editor 版本的最高 floor patch；Unity 6 可按既有规则回退 major 系列。上下文失配、无补丁或团结差异无法确认必须失败。补丁存在不证明对应版本已经完整运行。

核心绑定逻辑留在 ZenTS runtime，IL2CPP 修改限定于必要 hook 和 Compatible shim，不默认分发整棵私改引擎。

## 5. 链接与目标选择

原生 Player 静态链接 V8/适配库；iOS 使用 JITless、导出库到 Xcode。Win64 VS 导出携带所需静态库，可脱离原工程做 native 增量构建。WebGL/微信不链接 V8，接入 HostJs glue、模块工厂与平台 bootstrap。

托管选择 Editor 优先，其余按 WebGL、明确的 WeixinMiniGame 宏/target 或显式 ZENTS_HOST_JS。不能仅因名字包含 MiniGame 就判定已支持。C# 分支、native 编译与 bundle/manifest 必须一致，不依赖构建已开始后才修改 define 来改变本次编译。

## 6. Generate 和配置

`ZenTS/Generate Xml Bindings` 生成 MarshalAs、Alias、Extension 的 C++ 配置表；`ZenTS/Generate Typings` 生成声明。共享调用桥由运行时及 AOT 代码支持，不能把这两个菜单描述成任意泛型/签名机器码生成器。XML 仅用于 AOT 程序集，Editor 初始化快照、Player 烘焙；没有运行时 XML 注册/热更新/Reload，Reset 不重新加载。热更新程序集采用 Attribute，不由本文承诺任意 DLL 热加载能力。

## 7. 缓存与增量

缓存身份包括包/源码、Unity/团结、目标/CPU、backend/版本、补丁、配置与生成输入。头文件宏必须匹配链接库。改变影响输入必须失效相关缓存，不能仅比较库文件名。

仅 C++ runtime 改动可同步到 Win64 导出工程并增量编译，保留该导出的 generated。C# 类型、InternalCall、fixture 或生成输入变化时重新 Generate/导出；新增库/编译选项也需更新工程。

## 8. 验收登记

分别登记脚本存在、源码编译、SDK 安装、真实运行和干净退出。macOS/Android/iOS/WebGL/微信结果有各自范围，不能用“全部 IL2CPP 平台”代替。详见[对齐状态](03-ALIGNMENT.md)与[平台矩阵](../getting-started/compatibility.md)。
