---
sidebar_position: 1
title: "API 导航"
---

# API 导航

公开 API 分为宿主入口、脚本门面与特性配置。运行时内部 hook、native ABI 和安装器不属于稳定业务调用面。

| 需要做什么 | 页面 |
|---|---|
| 初始化、Reset、获取函数委托 | [JsAppDomain](js-app-domain.md) |
| 获取 CLR 类型、数组、泛型、Opaque、委托 | [JS API](js-surface.md) |
| 配置 Alias、MarshalAs、Extension | [特性](attributes.md) |
| 设置 SDK、TS、调试和 AOT XML | [Settings 规范](../spec/15-SETTINGS.md) |
| 精确确认类型、重载和复制规则 | [规范总览](../spec/00-OVERVIEW.md) |

示例默认已经初始化域，并具备相应 CLR 元数据和 AOT 实例。API 参考不替代平台构建和运行验收。
