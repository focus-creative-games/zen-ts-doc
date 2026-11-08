---
sidebar_position: 3.5
title: "ZLua 对齐与实现状态"
---

# 03 — ZLua 对齐与实现状态

## 1. 规范与实现的边界

本目录规定已经接受的目标设计；“必须”描述交付后的行为，不代表当前包已实现。实现状态只按源码和运行证据登记，不按旧文档中的“已支持”推定。

本次中文规范直接维护在 `zen-ts-doc/docs/spec`。历史 `sync-spec` 指向 `ZenTSTest/Docs/spec`，当前该来源不可用；恢复同步前须先确定并更新唯一来源，不能用旧快照覆盖本文。本站其他指南或参考页与本目录冲突时，以本目录及本页状态表为准。本轮不更新英文翻译。

## 2. ZLua 基线

| 项目 | 基线 revision |
|---|---|
| ZLua 代码 | `b029c9d7176b08e9b7aecf484df2960adf10f53b` |
| ZLua 中文规范 | `6bb39ce5fdb8cfc7d3849ba78292d914ec9f50e0` |
| ZenTS 规范修改前版本 | `b8a053cd947cd1270cb9de07481e4e565103d943` |

P0 的文件 SHA256、规则与章节台账位于嵌入包 `ZenTS~/migration`。后续 ZLua 规则变化须更新来源、差异原因及对照测试。ZLua 文档内部有冲突时，应结合源码和针对性测试确认，不能任选一篇旧摘要覆盖新规则。

## 3. 当前实现状态

| 能力 | 当前事实 | 后续阶段 |
|---|---|---|
| CLR 计划 / 引擎边界 | P1 已拆分；原执行路径通过自有 API | 后端接入继续使用该边界 |
| QuickJS | 仍为当前过渡实现，未移除 | V8 验收后清理，最终不提供回退 |
| Win64 / Windows Editor V8 | 尚未实现和运行验收 | P2 |
| V8 构建脚本 | 5 组 dry-run 通过；未构建 V8 库，未选定发行 revision | P2 |
| 新重载 / params / out / BigInt 标注 / ActualType | 目标契约已确认，当前仍有旧规则 | P3 |
| HostJs | 现有 GetFunction、通用 dispatch 等仍为原型/桩 | P4 |
| macOS / Android / iOS V8 | 未验收；iOS 目标使用 JITless | P5 |
| 微信小游戏发布 | 未验收；不能以 WebGL 概念兼容替代真机验证 | P6 |

P1 实际回归：Windows Editor Mono smoke 8/8、JS 套件 55/55；既有 Win64 导出 Player smoke 10/10、JS 套件 55/55、TS demo 3/3。当前源码中的 Player 子集 runner 列表为 12 项，不能把旧导出的 55 套结果当作该新列表已重新导出验收。没有修改测试期望或通过跳过互操作用例制造通过。

## 4. 对齐规则

- 全签名键按需懒解析，含单候选、继承及被 Alias 换名的方法；不是预挂所有签名。
- 短名 Bind 后冻结，取消正式 `register_method`。方法泛型使用 `inflate(type, nameOrSignature, ...typeArgs)` 或 GTAP，不继续以 `make_generic_method(closure, ...)` 作为目标 API。
- params 支持尾部展开，并按 ZLua 的默认参数与 params 惩罚规则竞争。
- 公共 typeArg 接受类型对象、完整 CLR 类型名和 `System.Type`；GTAP 前缀只接受 `System.Type` wrapper。
- 保持声明门面与实际对象身份分离；`ActualTypeUserData` 仅作为返回值策略。
- XML 仅对 AOT 程序集有效，禁止热更新、运行时注册及 Reload；热更新程序集使用 Attribute。

## 5. JavaScript 差异的明确裁决

| 项 | 目标契约 |
|---|---|
| null / undefined | 显式空值与缺失分开 |
| 实例方法 | 使用 JS this；提取后通过 `.call(receiver, ...)` |
| out | JS→CLR 不占输入；返回 `[returnValue, out1, ...]`，void 时为 `[out1, ...]` |
| Int64 / UInt64 | **默认 number**；允许 IEEE-754 精度损失，不能假装完整 64 位无损 |
| 显式 BigInt | 新增 `JsMarshalType.BigInt`，仅显式标注的 Int64/UInt64 槽位使用 bigint |
| table / bytes | JS 对象、Array、Uint8Array 分别定义规则；不把原始字节当 UTF-8 字符串 |
| 协程 / Promise | 不作机械等价；Opaque 借用不能跨异步边界 |
| ESM / 宿主 | Native 用模块适配器；HostJs 构建打包并预加载 |
| GC / Reset | V8 与宿主 GC 接口不同，CLR 可见生命周期契约相同 |

以上两条用户裁决覆盖先前方案或 P0 台账中“默认 BigInt”和“运行时 XML 注册”的提议。不能据旧台账恢复相反设计。

## 6. 测试与文档维护

每条规则应有 CLR fixture、语言表达与归一化期望。选中重载、异常分类、值/引用写回及门面行为必须跨 Mono/Il2Cpp 和 V8/HostJs 比较；引擎错误栈全文不要求一致。平台缺失能力单独列出，不能跳过应支持的 CLR 互操作。

历史文档中 QuickJS 专属类型只允许出现在过渡适配器说明，不能成为目标 CLR 内核契约。目标支持矩阵、构建脚本存在、源码编译成功和真实平台运行通过须分别登记。
