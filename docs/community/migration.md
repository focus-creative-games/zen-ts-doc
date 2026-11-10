---
sidebar_position: 3
title: "迁移到当前 ZenTS"
---

# 迁移到当前 ZenTS

迁移时以当前 spec 和测试结果为准，不再保留旧接口作为第二套长期语义。先在 Editor 验证，再重新 Generate 和导出目标 Player。

| 旧用法/假设 | 当前做法 |
|---|---|
| QuickJS 插件、版本开关和脚本 | 移除，导入官方 V8 SDK；HostJs 不内嵌引擎 |
| 原生库放 package 或提交 Git | SDK 安装 Library，Editor 插件与 meta 自动生成 Assets |
| 动态 register_method | Attribute/AOT Alias XML 定义短名；短名绑定后冻结 |
| make_generic_method(closure, ...) | inflate(已闭合声明类型, 方法键, ...类型实参) 或 GTAP |
| out 输入占位 | 删除占位，解构返回元组 |
| ref 新值作为返回元组元素 | 不再假设如此；按输入存储和原地修改规则处理 |
| long/ulong 自动 bigint | 默认 number，需要时显式 BigInt |
| Bytes 二进制 string | byte[] 与复制 Uint8Array |
| XML 运行时注册/重载 | 仅 AOT 会话/构建配置；重新生成，不热更新 |
| HostJs 任意源码字符串执行 | 构建静态工厂，所有模块变体预先打包 |

## 从 ZLua 迁移

保留 CLR 绑定、候选、门面、配置和 AOT 设计，按 JS 语义改写业务表达：实例方法遵守 this；null/undefined 分开；out 使用数组元组；显式 BigInt；Table/Array/Uint8Array 各有规则；Promise 不等同 Lua 协程。

不能把 Lua 的整数能力、二进制 string、longjmp 或 __gc 实现细节当作 JS 引擎接口。Opaque 借用不跨 await，事件需主动解除订阅。

## 回归清单

先清理已移除 API 使用和旧测试期望；确认 SDK 身份；校验 Alias/XML 冲突、声明生成、重载和数值边界；在目标 Player 验证 GC、异常、Reset 与泛型。详细兼容决策见[规范迁移页](../spec/12-MIGRATION-ADAPTORS.md)。
