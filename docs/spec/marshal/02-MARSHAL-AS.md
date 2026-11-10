---
sidebar_position: 2
title: "JsMarshalAs 与策略合法集合"
---

> 本页定义当前互操作契约；平台验收范围与已知限制见[对齐状态](/docs/spec/03-ALIGNMENT/)。

# `[JsMarshalAs]` 与 `JsMarshalType`

## 1. 标注范围与枚举

参数、返回值、字段、属性以及合法的非泛型 class/struct 类型级可标注。方法本身不可直接标注。类型级规则不能作用于开放泛型定义；成员规则可以挂开放声明，在闭合后根据实际 CLR 槽位校验。

以下为当前枚举，数值属于配置兼容契约：

```csharp
public enum JsMarshalType
{
    Default = 0,
    Object = 1,
    Bytes = 2,
    OpaqueValue = 3,
    UnpackedValues = 4,
    Table = 5,
    ActualTypeUserData = 6,
    BigInt = 7,
}
```

Object 对应 ZLua 的 UserData 策略，表示 CLR wrapper 形态，不等于 JS 普通 object，也不把默认 ByVal struct 一律变成 ByObj。ActualTypeUserData 沿用 ZLua 策略名，JS 中实际承载为 ByObj wrapper。

```csharp
[AttributeUsage(AttributeTargets.Parameter | AttributeTargets.ReturnValue |
    AttributeTargets.Field | AttributeTargets.Property |
    AttributeTargets.Class | AttributeTargets.Struct)]
public sealed class JsMarshalAsAttribute : Attribute
{
    public JsMarshalType JsMarshalType { get; }
    public string[] Members { get; set; }
    public JsMarshalAsAttribute(JsMarshalType jsMarshalType = JsMarshalType.Default);
}
```

### 1.1 泛型规则

类型级标注只允许非泛型定义；不把开放泛型定义的类型级规则自动继承给闭合实例。字段、属性、形参和返回值可在开放定义上声明规则，按定义身份匹配，inflate/GTAP 后再用闭合 CLR 类型作合法性校验。未闭合槽不能提前被当成任意合法类型。

## 2. 各策略

| 策略 | 语义 |
|---|---|
| Default | 默认矩阵；Int64/UInt64 仍为 number |
| Object | 强制 wrapper 形态；例如 string 改为 System.String ByObj。默认已是 wrapper 的类型通常等价 Default |
| Bytes | byte[] ↔ 复制的 Uint8Array；不采用 UTF-8 文本或 binary string |
| OpaqueValue | CLR→JS 调用期借用；ref/in/out 默认已为此形态 |
| UnpackedValues | struct 的 Members 对应多个输入参数；JS 单值返回时为成员数组 |
| Table | struct 或 Nullable\<struct\> ↔ 一个 JS 普通对象，Members 必填 |
| ActualTypeUserData | **仅返回值**，ByObj 门面改为实际 CLR 类型 |
| BigInt | **显式** Int64/UInt64 ↔ bigint；不改变任何 Default 策略 |

## 3. 合法集合

下表列出 Default 以外的合法策略，且要叠加位置/方向限制。

| CLR 分类 | 允许策略 |
|---|---|
| bool/char/8、16、32 位整数/浮点 | 无，只有 Default |
| Int64/UInt64 成员槽位 | BigInt |
| IntPtr/UIntPtr | 无，只有 Default；不会自动采用 BigInt |
| string | Object、OpaqueValue；不定义 string 的 Bytes 对偶 |
| byte[] | Object、Bytes、OpaqueValue、返回值 ActualTypeUserData |
| 其他数组/class/interface/object | Object、OpaqueValue、返回值 ActualTypeUserData |
| struct | Object、OpaqueValue、Table、UnpackedValues |
| Nullable\<struct\> | Object、OpaqueValue、Table；不支持 UnpackedValues |
| enum | OpaqueValue；默认底层 number，不能只因底层 64 位就标 BigInt |
| delegate | Object、OpaqueValue；Object 不取消 callable 语义 |
| 原生指针/函数指针 | OpaqueValue；Default 使用 Pointer token |
| TypedReference | 默认 OpaqueValue，显式 OpaqueValue 等价 |
| decimal/ref struct | 只按明确支持的 Opaque 路径，不承诺普通默认传值 |

OpaqueValue 只控制 CLR→JS，不是 JS→CLR 任意形参的宽松输入标记。ActualTypeUserData 只允许默认 ByObj 的引用类型返回槽；参数、字段、属性、类型级和声明 string/struct 返回值均非法。

BigInt 只允许 Int64/UInt64 的参数、返回、字段、属性或其 byref 元素策略；不可类型级、不可标整个 long[]/ulong[]。ref/in/out 外层借用形态不因此取消；有效 Opaque 地址绑定优先，实际值转换按该元素策略进行。

## 4. 错误策略

Editor Mono 的非法 Attribute 记录成员、CLR 类型与原因并回退 Default；XML 或 Generate 的非法规则必须阻止加载/构建。不能把非法 BigInt 默认为“全局改用 bigint”，也不能静默把实际类型返回策略放到不合法位置。

## 5. Table 与 UnpackedValues

Members 是有序 CLR 字段/属性名列表；可混合 public 可访问成员。转换所需 getter/setter 必须存在，嵌套类型按其自身有效规则处理，不递归猜测字段布局。

- Table 输入/输出为单个普通 JS 对象，按名字转换；Nullable null 不进入成员转换。
- UnpackedValues 普通形参按 Members 顺序消耗 N 个 JS 槽；缺槽为 arity 错误。
- 返回值和 out 每个 CLR 槽的 UnpackedValues 输出为成员数组；与 out 元组组合时不拍平。
- C#→JS by-val 参数的显式展开应与声明生成器使用同一槽位计划；byref 的借用/写回规则不能被展开逻辑绕过。
- 含托管引用字段的 struct 使用 GC 可追踪的存储，写入堆槽执行 write barrier。

## 6. Table 可选成员

`Members = new[] { "X", "Y", "Tag?" }` 中 ? 只对 Table 的 JS→CLR 缺键生效：按 own property 存在性判断，缺键保持 default；存在但为 undefined 则继续按槽位规则校验。必选键缺失失败。UnpackedValues 不支持 ?。

## 7. params

普通方法/构造的 params 使用 [重载规则](../04-METHOD-OVERLOAD.md)：省略为空数组、0～N 个元素展开，或单个匹配 CLR 数组 wrapper 整段传入。JS Array 需 `...array` 才展开；不能按普通 SZArray 规则把它默认为整个 params 数组。null 只作为可能的元素参与匹配。

没有专用 params MarshalType，不能把 BigInt 标在整个 params long[] 上来隐式改变所有元素。delegate/GetFunction bridge 的 params 展开不支持。

## 8. 优先级

成员槽位 Attribute → 对应 AOT XML → 合法类型级 Attribute/XML → Default。继承、泛型定义匹配与闭合校验必须一致；不在调用热路径临时读 XML。

## 9. XML（仅 AOT）

路径为 Settings.marshalAsXmlPaths，根元素 ZenTSMarshalAs；Alias/Extension 分开配置。这里只配置 AOT 程序集，**不配置热更新程序集**；没有运行时注册、热更新或 Reload。Editor 仅在初始化阶段读取 AOT 配置，Player 使用 Generate 的结果。

```xml
<ZenTSMarshalAs version="1">
  <Assembly name="Assembly-CSharp">
    <Type fullName="Counter">
      <Method name="GetExact" signature="()">
        <Return><MarshalAs type="BigInt" /></Return>
      </Method>
      <Method name="SetExact" signature="(System.Int64)">
        <Param index="0"><MarshalAs type="BigInt" /></Param>
      </Method>
    </Type>
  </Assembly>
</ZenTSMarshalAs>
```

Param 使用 CLR 声明参数的零基 index，不按 JS 展开槽重新编号；扩展方法的 CLR this 仍是其真实参数 0。全签名 JS 键会去掉 this，与 XML 的 CLR 定位不能混淆。方法级不能直接放 MarshalAs；Return/Param/Field/Property 定位需明确。

同一配置槽重复失败，Attribute 优先于合法 XML。开放泛型成员按定义定位并在闭合后校验，不以闭合实例名称作为 XML Type 容器。实现可以烘焙 ID/token/表，不能把“只存名字”固定为公共语义。

## 10. 实现状态

ActualTypeUserData 和 BigInt 已在枚举、XML parser、Mono/IL2CPP writer、重载判定及 TS 声明中接入；支持位置仍严格限制，平台范围见对齐状态。
