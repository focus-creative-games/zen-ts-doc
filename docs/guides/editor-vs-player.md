---
sidebar_position: 21
title: "Editor 与 Player"
---

# Editor 与 Player

Editor 和 Player 共享脚本可见规则，但执行 CLR 调用的方式不同。测试应比较结果、异常分类、写回和生命周期，不能仅比较某个引擎的错误栈文本。

| 环境 | CLR 执行 | JS 执行 | 需要的准备 |
|---|---|---|---|
| Windows/macOS Editor | Mono 反射与 Expression Emit | 原生 V8 插件 | 当前 Editor 平台 SDK |
| 原生 Player | IL2CPP 元数据与静态桥 | 静态 V8；iOS JITless | 目标 SDK、Generate、裁剪保留 |
| WebGL/微信 Player | IL2CPP/WASM 静态桥 | 平台内嵌 VM | 预编译模块工厂及平台转换 |

Editor 的 Emit 能力不能证明 AOT 泛型一定可运行。Player 需要的闭合泛型、委托签名和成员元数据必须在构建时具备。

## 配置和模块

Alias、MarshalAs、Extension XML 仅针对 AOT 程序集；Editor 会话建立配置快照，Player 烘焙生成表。Reset 不重载 XML。热更新程序集依靠 Attribute，不能把配置热更新与脚本 Reset 混为一谈。

Editor/原生可使用文件模块加载器；Android/WebGL 等通过发布资源或预编译工厂加载，不能依赖任意本地文件路径。wx 等平台 API 只存在于对应宿主，Editor V8 不模拟它们。

## Reset 和调试

Play Mode 的 Reset 默认预约到 EndOfFrame；Editor 非播放/批处理没有帧泵时同步执行。重建后旧委托失效，业务需要重新取得。

Editor 使用内置 V8 Inspector；WebGL 使用浏览器工具，微信使用开发者工具。开启 Editor 调试不会给 Player 增加远程调试监听。详见[调试](js-debugger.md)。
