---
sidebar_position: 11
title: "版本、安装与构建"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 11 — 版本、安装与构建

## 1. 两条版本轴

Unity/团结的 CLR 工具链版本，与 JS backend 的版本分开管理。目标 backend 为 Native V8 或 HostJs；QuickJS 仅为过渡实现。不得继续把 quickjsVersionId 定义成长期产品的唯一引擎选择。

目标 Unity 起点为 Unity 2022.3.x 与团结对应目标；其他版本存在 patch 不等于该组合已通过 V8/HostJs 验收。

## 2. 包内布局

```text
Runtime/Mono/Engine/             # managed 引擎和值/回调契约
Runtime/Mono/Engine/QuickJs/     # 当前过渡 P/Invoke 与 gate
Runtime/Mono/Binding/            # CLR 元数据计划
ZenTS~/zents-runtime/
  engine/EngineApi.h             # 自有 C++ API
  engine/quickjs/                # 当前适配器
  binding/BindingPlan.h          # 无 SDK 依赖的 CLR 计划
  bridge/ marshal/ mt/ jvm/      # 使用自有 API 的互操作执行层
  hostjs/                       # 当前仍有原型，待 P4
  generated/                    # 安装/Generate 输出
ZenTS~/v8/build.py               # P1 构建配方
ZenTS~/patches/libil2cpp/         # Unity 版本差异
ZenTS~/migration/                # P0/P1 基线与验证凭据
```

目标 Native V8 产物及适配器在 P2 加入，HostJs glue/bundle 在 P4/P6 加入。包不携带完整 stock libil2cpp 树。QuickJS vendored 源及插件当前仍存在，替代后删除。

## 3. 安装流水线

目标流水线先确定 BuildTarget、CLR 宿主、backend、OS/CPU 和 manifest；复制 stock Il2Cpp，应用匹配补丁，安装自有 runtime，再纳入对应 backend 依赖和生成表，验证并写指纹。

- Native V8 只安装匹配 headers/defines/库，不把 V8 C++ ABI 暴露给 Mono。
- HostJs 不安装额外 VM，接入 WASM import/export、平台启动脚本与 JS 包。
- 当前 P1 的 Install 仍安装 QuickJS 过渡依赖，不能因文档写了目标流程就省去实际需要的库。
- Define/目标切换须在实际编译前完成；不允许 manifest、C# 分支与 native 分支选择不一致。

## 4. libil2cpp patch

在对应 major.minor 系列内选择不大于 Editor 版本的最高 floor patch；Unity 6 可按现有规则回退 major 系列。无可用 patch、上下文不匹配或团结差异无法确认均失败，不静默套另一版本。后缀版本与团结 API 差异分别记录。

引擎修改尽量限定 hook 与 Compatible shim；业务类型绑定逻辑留在 ZenTS runtime，不分发整棵修改版 libil2cpp 作为默认维护方式。

## 5. V8 revision 与产物

完整 revision、编译器/SDK、GN 参数、CPU/OS、JITless、snapshot、ICU 和二进制哈希组成产物身份。不能把 API 兼容推定为二进制兼容。构建配方存在不代表库已构建或该平台已运行，见 [V8](./build/02-V8.md)。

## 6. HostJs 能力版本

宿主 VM 不能由包统一 pin；记录平台/SDK/Unity、模板版本、启动方式和能力要求。number、bigint、Promise、Proxy 以及弱引用能力分开检测；BigInt 只有显式策略使用，缺所需能力时明确失败，不能静默降为 number。

## 7. Define 与后端选择

当前 ZENTS_QUICKJS、ZENTS_HOST_JS 等属于过渡构建接线。目标选择由平台适配和构建产物共同决定，不能公开一个允许在活跃域任意切换引擎的 Settings 开关。业务 Marshal 行为不按宏分裂。

## 8. AOT 元数据与 XML

Alias、MarshalAs、Extension XML 仅配置 AOT 程序集；Editor 初始化消费配置快照，Il2Cpp Generate 烘焙。修改配置需要重新初始化编辑会话/Generate/构建，不支持 Player 解析、运行时注册、热更或 Reload。热更新程序集使用 Attribute，不能把其 XML 偷放进安装配置。

## 9. 指纹与诊断

至少记录包版本、Unity/团结标识、目标/CPU、backend/版本、补丁选择、配置与生成输入哈希，以及引擎产物哈希。切换 backend、更新头文件/库或影响生成表的配置后，必须使相关缓存失效。加载中的 Editor 原生插件不能当成可可靠热替换资源。

## 10. 验收矩阵

Windows Editor 与既有 Win64 导出的 P1 过渡实现已有记录。V8、macOS、Android、iOS、WebGL 和微信必须逐项构建与运行，不使用“所有 Il2Cpp 平台”作为完成声明。

## 11. Win64 增量迭代

测试工程嵌入包为工作副本。仅 C++ runtime 改动时，同步到 Build-Win64 的 libil2cpp/zents（保留 generated）并增量编译；不必每轮重新 Generate/导出。新增库、项目结构或编译选项时更新工程。

影响 Player 的 C#、InternalCall、程序集、生成表或测试 fixture 改动时重新编译并按需 Generate/导出。仅 Editor Mono 内部源码变化不要求重导 Player，但必须单独跑 Editor。导出产物与当前 C# 源码各有自己的测试基线，不能混记。

## 12. 配置头与 SDK 边界

ZenTSConf.inc 提供 Unity/团结及构建身份；Il2CppCompatible 处理 CLR API 差异。ZenTSCommon 包含自有 EngineApi 与 CLR shim；核心不再通过 QuickJsCompatible 暴露 SDK。生成头不能定义与实际链接库不匹配的 V8 特性宏。
