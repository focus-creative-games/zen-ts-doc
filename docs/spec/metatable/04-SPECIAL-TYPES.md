---
sidebar_position: 5
title: "特殊类型分派"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 04 — 特殊类型分派

## 1. enum

类型对象输出 readonly number 常量；没有构造、_default 或 _ctor。显式 box 得到 ByObj enum，默认跨边界仍为底层 number。Int64/UInt64 的 BigInt 策略不自动扩展到 enum。

## 2. Nullable\<T\>

无值为 null，有值采用底层 T 的表示，不创建独立 Nullable 实例 IEO。值工厂用 `N(value)`，**目标不提供 `new N(...)` 返回 primitive** 的契约；JS new 的返回值必须是对象。

对合法底层值类型进行构造/转换；enum 无普通构造，其 Nullable 值可按 Marshal 输入而不要求 enum 工厂。默认 Nullable\<long/ulong\> 有值仍是 number，本轮不把 BigInt 标注扩大到整个 Nullable 槽。

## 3. struct

`new T(...)` 走 public 构造，返回 ByVal；`T._default()` 为 default(T) 副本。仅合法 struct 提供 _default，禁止 _ctor。ByVal 与 boxed ByObj 分别选择本侧入口，缓存实例方法时用 `.call` 显式提供接收者。

## 4. 数组

数组由 zents.new_szarray/new_mdarray 系列工厂创建，按各工厂的完整 API 名使用；没有通用 CLR 数组类型 new 入口。实例只走 ByObj。

- length 为元素总数，mdarray 是各维长度之积。
- get 输入 rank 个 CLR 各维下标，set 输入 rank 个下标加 value。
- 下标是合法 number 整数，含 lowerBound 校验；bigint 下标拒绝。
- 不承诺 wrapper 的 arr[i] 原生 JS 索引；普通 JS Array 的语义与此不同。
- get/set 的元素转换使用默认/合法槽位规则；默认 64 位元素是 number。

## 5. delegate

普通 CLR delegate wrapper 可直接 callable，等价其 Invoke；已由 JS 函数建立的 bridge 回传时保留正确身份。callable 本身不要求再提供一个实例 this。

JS 调 CLR delegate 的 Invoke 是 JS→CLR，使用 out 零输入/结果元组。C# 调 JS bridge 则 ref/in/out 为 Opaque；两种方向不能混用。

## 6. class / interface / abstract / static

class 默认 ByObj；接口按接口门面；抽象类/接口/静态类不可构造。门面决定成员可见性，虚派发仍使用实际实例。ActualTypeUserData 仅对合法引用类型返回值改为实际门面，不是全局默认。

## 7. 后端要求

上述模型与 V8 internal field、Proxy 和 HostJs 句柄的物理布局无关。受限平台缺少特性时应明确诊断并登记支持状态，不能静默改变 CLR 值表示或接收者语义。
