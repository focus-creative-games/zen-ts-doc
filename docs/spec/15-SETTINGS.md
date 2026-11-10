---
sidebar_position: 15
title: "Settings"
---

# Settings

配置保存于 `ProjectSettings/ZenTS.asset`，对应 `ZenTS.Settings`。本页列出源码初值；已有项目资源的持久值可能不同，迁移逻辑不会把所有用户设置重置。

## 1. 当前字段

| 字段 | 新配置默认值与含义 |
|---|---|
| enable | true；启用安装/构建接线 |
| enableUnityOptimizations | true；包内 Unity Alias/MarshalAs 规则 |
| enableTsPlayGate | true；进入 Play 前 TS 检查与过期 emit |
| typescriptBindingAssemblies | Assembly-CSharp、ZenTS.Tests；业务按需配置绑定程序集 |
| enableJsDebugger | false；Editor 调试 |
| debuggerHostTypeName | 空；选择内置 V8 Inspector，非空指定自定义宿主 |
| debuggerPort | 9230 |
| debuggerWaitForAttach | false；开启后阻塞主线程等待协议继续 |
| debuggerSourcePaths | 空数组；自定义调试宿主额外搜索路径 |
| marshalAsXmlPaths | Assets/CustomJsMarshalAsRules.xml |
| jsAliasXmlPaths | Assets/CustomJsAliasRules.xml |
| jsExtensionXmlPaths | Assets/CustomJsExtensionRules.xml |

XML 字段可配置文件或目录；示例路径默认存在于设置不等于项目必定存在对应文件。内置源码服务限定 TsProject，不因 sourcePaths 任意开放文件。

## 2. 生效时机

XML 仅 AOT 程序集有效：Editor 初始化建立快照，Player Generate 烘焙表。热更新程序集使用 Attribute，不支持 XML 运行时注册、热更新、Reload，Reset 不重新读 XML。

Unity 优化开关开启时，包内 Alias/MarshalAs XML 排在用户路径前。重复同槽配置失败，不允许后加载静默覆盖；不同方法同 Alias 可以形成重载组。Attribute 优先于合法 XML，非法规则仍须校验。

修改配置后重新建立 Editor 会话；影响 Player 的内容重新 Generate/构建。调试器设置在下一次域初始化生效，启用设置本身不启动服务。

## 3. 后端与 SDK

无 QuickJS 字段、插件或回退路径。原生 V8 版本由锁定源码、SDK manifest 和指纹决定；HostJs 版本来自平台 VM。当前域不允许任意切换引擎。

SDK 和安装器的状态独立于脚本设置：Library 缓存、Assets 插件和原生链接必须匹配实际平台。已加载插件更新需重启 Editor。见[版本与构建](11-MULTI-VERSION.md)。
