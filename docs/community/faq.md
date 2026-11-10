---
sidebar_position: 1
title: "常见问题"
---

# 常见问题

## 是否仍然支持 QuickJS？

已彻底移除，不提供旧引擎回退。原生使用官方 V8 静态库，WebGL/微信使用平台 JS VM。V8 不支持的其他原生目标不因此自动获得支持。

## 是否需要下载源码放进 Packages？

不需要。支持 Git URL 安装的只读 PackageCache。SDK 安装到 Library，Editor 插件与稳定 `.meta` 自动生成到 Assets。见[安装](../guides/install.md)。

## 无 Wrap 白名单是否等于不用生成代码？

不是。类型/成员懒绑定免除逐类型 Wrap 清单，IL2CPP 仍需要保留元数据、闭合泛型和签名桥，执行 Generate 并在 Player 验证。

## 是否内置 Node.js？

不内置。Node 用于构建 TypeScript 和打包，VS Code node 适配器可连接 Inspector；两者都不意味着运行时提供 require('fs') 等 Node 标准库。

## long 为什么不是 bigint？

按设计默认 number，允许 IEEE-754 精度损失。需要完整 64 位范围时，对具体 long/ulong 槽位显式标注 BigInt。object 不猜 long/ulong，整个数组也不自动切换策略。

## out 要不要传 null 占位？

不要。JS→CLR 的 out 不占输入，值进入返回元组；ref 不加入该元组。C#→JS byref 使用调用期 Opaque，规则不同。

## Reset 能否刷新 XML 或执行下载的新源码？

Reset 不重载 AOT XML。原生脚本可按加载器能力重建上下文；HostJs 只能使用已预编入产物的模块和源码变体，不是动态 eval 服务。

## 微信是否已经支持？

Unity 和团结引擎均已支持微信小游戏，使用平台 JS VM，并已在微信开发者工具运行适用测试。手机真机与上传发布不在此处的验证范围内。详见[状态](../getting-started/project-status.md)。

## 为什么测试数不是平台覆盖率？

命名用例、模块、Smoke 和 TS 示例是不同计数。435 个命名用例不等于 ZLua 所有测试或所有设备均覆盖，显式跳过和历史平台验证须分别列出。
