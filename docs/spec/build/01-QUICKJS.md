---
sidebar_position: 1
title: "QuickJS 过渡实现"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 构建 — QuickJS 过渡实现

**本页只说明 P0/P1 的现有实现，不再把 QuickJS 规定为产品长期引擎。** 目标为 [Native V8](./02-V8.md) 与 [HostJs](./06-HOSTJS.md)。QuickJS 将在替代后端验收后移除；不作为 V8 不支持平台的发布回退。

## 1. 当前源码与产物

当前 Player 使用包内 `ZenTS~/quickjs-il2cpp` 源码，Install 拷贝到 Local libil2cpp/quickjs；不是要求每次从不存在的 QuickJsSrcCache 下载。CLI 工具不参与 Player 链接。

Editor 当前产物是 Plugins/quickjs 下的 quickjs DLL/dylib 和 zents_mono_gate；Windows 已加载插件替换后需重启 Editor。macOS/Linux 路径或旧文档列举不代表本轮已经验收。

## 2. P1 隔离边界

| 位置 | 当前职责 |
|---|---|
| `ZenTS~/zents-runtime/engine/EngineApi.h` | 自有类型和值操作，核心层包含此头 |
| `engine/quickjs/QuickJsEngine.cpp` | 当前唯一 QuickJS 执行适配器 |
| `QuickJsCompatible.h` | 仅供过渡适配器包含 SDK，不再作为 CLR 内核公共接口 |
| `Runtime/Mono/Engine` | 自有 managed 引擎、值及回调契约 |
| `Runtime/Mono/Engine/QuickJs` | P/Invoke、引用计数、gate、动态符号查找 |

过渡实现可使用原始 QuickJS API；不能为方便继续让重载/Marshal/绑定计划引用 QuickJS JSValue、JSContext 或 refcount 头布局。

## 3. 当前与目标分开验收

P1 在 Windows Editor 和既有 Win64 导出 Player 通过回归；Install 只代表源码安装成功，不代表任意目标的引擎链接与运行成功。当前 HostJs GetFunction/通用 dispatch 仍未完成，不能宣称 WebGL 已通过全部测试。

## 4. 清理条件

Native V8 的 Editor/Player 双向调用、对象/struct、委托、异常、Reset 和 GC 用例验收后，删除 QuickJS SDK、动态库、mono gate、配置 pin、安装分支和过渡测试假设。文档路径可以保留为迁移说明，不再建议新项目依赖它。
