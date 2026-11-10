---
sidebar_position: 90
title: "术语表"
---

# 术语表

| 术语 | 本站含义 |
|---|---|
| V8 | 原生平台静态集成的官方 JS 引擎，不包括 Node.js 运行时 |
| HostJs | 连接 WebGL/微信平台已有 JS VM 的引擎后端 |
| CLR 宿主 | Editor Mono 或 Player IL2CPP 的执行路径 |
| BindingPlan | 不含引擎 SDK 值的 CLR 绑定/调用计划 |
| Wrap 白名单 | 业务维护的逐类型绑定生成列表；ZenTS 不要求这种使用方式 |
| 签名桥 | 将动态调用转为已编译 CLR ABI 的共享桥，不等同逐类型 Wrap |
| AOT | 构建期生成可执行代码；运行时不能凭类型名补出缺失泛型 native 代码 |
| 类型对象 | CSharp/csharp: 返回的 CLR 类型操作入口 |
| System.Type wrapper | CLR 反射 Type 对象；GTAP 的合法前缀 |
| STO / IEO | 静态/实例成员模型所使用的抽象对象层 |
| ByVal / ByObj | 值副本包装 / 具有 CLR 对象身份的包装 |
| 声明门面 | 按声明类型确定可见成员的视图，不改变实际对象身份 |
| GTAP | Generic Type Argument Prefix，以 System.Type 前缀指定方法泛型实参 |
| 全签名键 | 原 CLR 方法名和完整参数类型构成的精确访问键 |
| Opaque | 调用期借用句柄，不是可永久保存的内存地址 |
| generation | 域代次，用于拒绝 Reset 后旧句柄/委托 |
| FramePump | 主线程处理待释放根、任务及预约 Reset 的帧泵 |
| SDK 指纹 | 锁定来源、ABI、适配器与文件内容的不可变 SDK 身份 |
| Inspector / CDP | V8 调试服务 / Chrome DevTools Protocol |
| 命名用例 | 独立命名的测试函数，与模块数和覆盖率百分比不同 |

术语用于解释实现，精确行为以 [spec](../spec/00-OVERVIEW.md) 为准。已移除的引擎或 API 仅在迁移页说明。
