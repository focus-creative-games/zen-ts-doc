---
sidebar_position: 1
title: "Marshal 总览与默认矩阵"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# Marshal 总览 — 默认规则矩阵

本页定义目标默认策略；显式 `[JsMarshalAs]` 覆盖规则见 [02-MARSHAL-AS.md](./02-MARSHAL-AS.md)。Mono/Il2Cpp 与 Native V8/HostJs 使用相同 JS 可见行为。

## 1. 平台原则

CLR 绑定计划不引用引擎 SDK 类型。wrapper 的 ByVal/ByObj、声明门面、Opaque 作用域属于互操作语义，不以 QuickJS JSValue 布局定义。不同引擎可采用模板、内部字段、Proxy 或句柄表实现。

**Int64/UInt64 默认序列化为 number。** 新增 `JsMarshalType.BigInt` 是显式 opt-in，不是更换默认数值通道。

## 2. `undefined` 与 `null`

| 输入/输出 | 契约 |
|---|---|
| CLR 引用 null / Nullable 无值 → JS | null |
| CLR void → JS | undefined |
| JS null → 引用/Nullable | null / 无值 |
| JS undefined → 必选普通引用或非 Nullable 值类型 | argument missing / mismatch |
| JS undefined → Nullable | 无值 |
| JS 省略或 undefined → 合法 optional 槽 | Bind 期物化的 CLR 默认值 |
| JS 省略 params 尾部 | 空数组 |
| JS→CLR out | 不存在输入槽，不接受占位参数 |

显式 undefined 保留所在位置，不会移走后续实参。JS 普通对象缺属性返回 undefined；CLR 绑定 miss 抛错。Table 的可选键规则以是否存在 own property 判定，不能把存在但值为 undefined 一律当缺键。

## 3. 数值与 BigInt

### 3.1 默认 number

| CLR 类型 | 默认 JS 形态 |
|---|---|
| bool | boolean |
| char、8/16/32 位整数 | 整数 number |
| Int64 / UInt64 | 整数 number；可能有 IEEE-754 精度损失 |
| Single / Double | number |
| IntPtr / UIntPtr / nint / nuint | 指针宽度整数的 number；与原生 Pointer token 不同 |
| enum | 底层整数的默认 number，即使底层为 Int64/UInt64 |

默认整数 Pop 要求 number、有限、无小数且在 CLR 目标范围内，不接受数值字符串或 bigint。对 Int64 的 Number 边界应检查 `[-2^63, 2^63)`，UInt64 检查 `[0, 2^64)`，不能用已舍入的 double 最大值把越界值放行。

Default 推送超出安全整数范围的 64 位值会发生数值舍入；本规范不声称其无损，也不自动改成 bigint。接收一个已舍入的 number 无法恢复原来的 CLR 整数。需要完整精度的 API 必须显式标注 BigInt。

### 3.2 显式 `JsMarshalType.BigInt`

- 仅定义 Int64/UInt64 成员槽位及其 byref 元素的策略；不自动扩展到 enum、IntPtr、数组或 object。
- CLR→JS 精确输出 bigint；JS→CLR 只接受 bigint，并按有符号/无符号完整范围检查。
- 不隐式将 number 变成 BigInt 槽，也不将 bigint 降为 Default number 槽。
- 参数、返回值、字段、属性可显式选择；类型级不允许改变全局 Int64/UInt64 默认。
- 同类型有效 Opaque 仍可直接绑定地址；实际按值 get/set 或 out 输出时才应用槽位的 BigInt 策略。

```csharp
[return: JsMarshalAs(JsMarshalType.BigInt)]
public static long GetExactCounter() => long.MaxValue;

public static void SetExactCounter([JsMarshalAs(JsMarshalType.BigInt)] long value) { }
```

```javascript
const exact = Counter.GetExactCounter(); // bigint
Counter.SetExactCounter(9223372036854775807n);
```

## 4. 默认类型矩阵

| CLR 类型 | CLR→JS | JS→CLR |
|---|---|---|
| string | string / null | string、兼容 CLR string wrapper、null |
| class/interface/object | ByObj，门面为声明类型 / null | 兼容 wrapper / null；object 额外接受受支持的基元装箱 |
| enum | number | 范围合法的 number；兼容 boxed wrapper |
| struct | ByVal 或同步链内 Opaque | 兼容 ByVal / boxed / 有效 Opaque，按 struct 规则复制 |
| Nullable\<T\> | null 或按 T 策略 | null/undefined 或可转换的 T |
| T[] | ByObj / null | 兼容 CLR 数组、连续 JS Array 或 null |
| 多维数组 | ByObj / null | 仅兼容 CLR 数组或 null |
| delegate | 原 JS 函数或 callable wrapper / null | callable、兼容 delegate wrapper 或 null |
| T* / 函数指针 | 不可伪造的 Pointer token / null | 兼容 token / null |
| TypedReference | OpaqueValue | 只接受合法兼容 Opaque |
| decimal / ref struct | 不承诺普通 by-val 默认支持 | 必须按明确支持策略；不能静默伪造转换 |

object 不凭 bigint 猜测应装箱为 long 还是 ulong。需要精确 64 位通道时定义具体 Int64/UInt64 槽并标注 BigInt。

## 5. 数组形态

普通 SZArray 的 JS Array 输入必须连续零基、无 holes，逐元素按相应策略校验并复制；数组 wrapper 传递引用。TypedArray 不是所有数组类型的通用替代；Bytes 策略只为 byte[] 定义 Uint8Array 转换。

## 6. 返回值与 out

没有 out 时保持普通返回值；有 out 时返回 JS Array：非 void 为 `[returnValue, out1, ...]`，void 为 `[out1, ...]`。out 按声明顺序，不占输入。

一个 CLR 返回槽或 out 槽即一个逻辑结果。若其 UnpackedValues 策略产生成员数组，该数组保留为一个嵌套元素，不自动拍平。详见 [03-BYREF.md](./03-BYREF.md)。

## 7. 配置来源

Attribute 优先于 AOT XML，类型级规则仅限合法非泛型类型，之后回落本页 Default。XML 不能配置热更新程序集，不能在运行时注册或重载。Reset 不重新解析 Player XML。
