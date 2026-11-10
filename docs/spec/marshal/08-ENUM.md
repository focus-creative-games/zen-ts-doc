---
sidebar_position: 14
title: "枚举 Marshal"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。
# 枚举 Marshal

> **规范性：** C# `enum` 在 JavaScript 与 C# 之间的默认 Marshal 规则。
> **相关：** 类型表常量 → [../02-TYPE-SYSTEM.md](../02-TYPE-SYSTEM.md) §3.5；`zents.box` → [../05-LIB.md](../05-LIB.md)；`ref` enum → [03-BYREF.md](./03-BYREF.md)；`[JsMarshalAs]` → [02-MARSHAL-AS.md](./02-MARSHAL-AS.md)。

**平台原则：** 枚举默认 **不** 推送 exotic，而按 **`number`（整数）** Marshal。enum 默认不接受 bigint；Int64/UInt64 的显式 BigInt 策略不自动适用于 enum（[../00-OVERVIEW.md](../00-OVERVIEW.md) §1.3）。

---

## 1. 设计要点

| 场景 | 形态 |
|------|------|
| **默认传参** | **`number`**（`Number.isInteger`） |
| **boxed 实例** | **ByObj exotic**；**仅** `zents.box` |
| **类型表常量** | **`number`** 属性（**非** exotic） |

枚举类型对象 **无** `[[Construct]]`；**不可** `new EnumType(...)` 构造 ByVal。

---

## 2. 默认规则（C# ↔ JavaScript）

| 方向 | 默认形态 | 说明 |
|------|----------|------|
| **C# → JS** | **`number`（整数）** | 底层整数值；**不** Push exotic |
| **JS → C#** | **`number`（整数）** | `Enum.ToObject` / 等价 |
| **JS → C#**（备选） | **ByObj exotic**（boxed） | 解包 underlying |

**不接受**（除非另行标注）：枚举 **名字 string**、**boolean**、plain object。

**`undefined`**：必选 enum 形参 → **throw**；`Nullable<enum>` 无值 → **`null`/`undefined`**（[01-OVERVIEW.md](./01-OVERVIEW.md) §2）。

---

## 3. 底层类型与范围

读取 enum **underlying type**（`Int32`、`Byte` 等）：

| 底层类型 | Push | Pop |
|----------|------|-----|
| `sbyte` … `ulong` | `number` 整数 | `number` 整数 + 范围校验 |

Pop 越界 → **`throw Error('zents: …')`**。

**禁止 `bigint` Pop** → **`throw Error('zents: bigint is not supported for enum marshal')`**（或等价文案）。

---

## 4. 类型表常量字段

```javascript
const Color = CSharp.AC['MyGame.Color'];
console.assert(Color.Red === 0);    // number，非 exotic
```

```javascript
foo(Color.Red);
foo(1);   // 裸整型，须可转换为该 enum
```

---

## 5. Boxed 形态（`zents.box`）

```javascript
const boxed = zents.box(Color, Color.Green);
const boxed2 = zents.box(Color, 2);
```

| 项 | 说明 |
|----|------|
| 返回值 | **ByObj exotic**（boxed） |
| 拆箱 | `zents.unbox(boxed)` → underlying **`number`** |
| **`ref Color`** | boxed 走临时槽路径（[03-BYREF.md](./03-BYREF.md)） |

---

## 6. ref/in 与 out enum

| JS 实参 | 行为 |
|---------|------|
| **OpaqueValue** | handle 地址 |
| **integer `number`** | 临时槽 |
| **`zents.box` 产物** | 临时槽 |

C#→JS：`ref enum` 默认 **OpaqueValue**。

---

## 7. `[JsMarshalAs]` 扩展

| 标注 | by-val enum |
|------|-------------|
| **`Default`** | §2 |
| **`Object`** | **非法**（by-val）；回退 Default |
| **`OpaqueValue`** | C#→JS 合法 |
| **`Table` / `UnpackedValues`** | **非法** |

---

## 8. 与 struct / class 差异（摘要）

| 项 | enum | struct | class |
|----|------|--------|-------|
| 默认跨边界 | number | ByVal exotic | ByObj exotic |
| `[[Construct]]` | **无** | 有 | 有 |
| boxed | `zents.box` | box / ByVal | 构造 |

---

## 9. Mono / Il2Cpp 一致性

默认 Push/Pop、常量、`zents.box`、范围校验、bigint 拒绝 — **须一致**。

---

## 10. 相关文档

| 文档 | 内容 |
|------|------|
| [01-OVERVIEW.md](./01-OVERVIEW.md) | 默认 number；BigInt 仅限显式标注的 Int64/UInt64 槽 |
| [03-BYREF.md](./03-BYREF.md) | byref |
| [05-STRUCT.md](./05-STRUCT.md) | box 对比 |
| [../02-TYPE-SYSTEM.md](../02-TYPE-SYSTEM.md) | 枚举类型表 |


## 11. 显式 BigInt 的边界

enum 的默认常量、参数、返回值按底层整数转换成 number，即使底层是 Int64/UInt64 也不会自动 bigint。BigInt 标注的合法目标仅为 Int64/UInt64 槽，不能直接标在 enum 上。

JS→CLR out enum 不占输入，以结果元组返回 number；C#→JS 的 out enum 仍为 Opaque。旧正文中 byref 的输入分支仅适用于 ref/in，不能用作 out 占位规则。
