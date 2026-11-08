---
sidebar_position: 15
title: "Settings"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 15 — Settings

本页规定目标配置和当前过渡字段的边界。配置资源为 ProjectSettings/ZenTS.asset；Project Settings 的编辑项应在保存时持久化。本文序号保留现有 14-TYPESCRIPT 路由，语义对应 ZLua 的 Settings 分册。

## 1. 目标字段

| 字段/类别 | 目标默认与含义 |
|---|---|
| enable | true，启用 ZenTS 安装/构建接线 |
| marshalAsXmlPaths | 空数组，AOT MarshalAs XML 文件或目录 |
| jsAliasXmlPaths | 空数组，AOT Alias XML 文件或目录 |
| jsExtensionXmlPaths | 空数组，AOT Extension XML 文件或目录 |
| enableUnityOptimizations | true，Unity API 优化总开关；当前实现尚未加入 |
| TypeScript 检查/声明程序集 | 使用现有 TS 设置，检查与 emit 不替代运行时/AOT 验证 |
| 调试器 | 默认关闭；Native V8 Inspector 或 HostJs 平台工具，见调试器分册 |

当前包的 XML 路径初值可能是示例文件；目标配置与实际迁移状态见 [03-ALIGNMENT.md](./03-ALIGNMENT.md)。不能只改文档就认为字段默认已更换。

## 2. XML 有效范围

三类 XML **只对 AOT 程序集有效**，热更新程序集使用 Attribute。Editor 新会话初始化读取 AOT 配置快照；Player Generate 将配置烘焙成表。运行期间没有注册、热更新、Reload，也不通过 Reset 重新加载 XML。

修改路径、XML 或 Unity 优化开关后，应重新初始化编辑会话；Player 重新 Generate/构建。不能把编辑期修改配置的流程命名为“运行时热更新”。

## 3. 加载顺序与重复

Unity 优化开关打开时，包内 Alias/MarshalAs XML 在用户路径之前加载。同一目标配置槽在两份 XML 中重复必须失败；先加载不等于允许后者静默覆盖。不同方法最终 Alias 名相同可以形成重载组，不能与“同一槽重复配置”混淆。

Attribute 优先于相应合法 XML。MarshalAs 的非法 Attribute 回退/非法 XML 硬失败遵循其分册，不能利用来源优先级跳过 XML 校验。

## 4. 引擎版本与过渡字段

Native V8 的版本由匹配的二进制 manifest/revision 决定，HostJs 由平台 VM 决定。诊断显示实际 backend 和产物版本，不允许在活跃域任意切换。

quickjsVersionId、QuickJS 插件/Define 和现有 debuggerHostTypeName 等是当前过渡实现字段；后续替换时显式迁移并清理，不作为长期多引擎回退设置。完整 V8 shipping revision 尚待 P2 选定并验证。
