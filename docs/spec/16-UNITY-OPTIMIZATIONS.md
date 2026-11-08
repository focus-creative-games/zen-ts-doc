---
sidebar_position: 16
title: "Unity 优化"
---

> 本页为目标契约；交付状态与迁移基线见 [对齐说明](/docs/spec/03-ALIGNMENT/)。

# 16 — Unity 优化

本页对应 ZLua 的 Unity 优化语义。目标总开关为 Settings.enableUnityOptimizations，默认开启；当前 ZenTS P1 尚未移植此能力。

## 1. 当前目标范围

仅 UnityEngine.CoreModule 的 GameObject 与 Component 声明上的 GetComponent 系列三个重载。GetComponentInChildren、GetComponentInParent、AddComponent 不在本批范围内。

## 2. 开关关闭

不加载包内 Unity 优化 XML；GetComponent 的默认名字、GTAP/普通重载竞争及声明返回门面保持一般规则。

## 3. 开关开启

在用户 Alias/MarshalAs XML 前加入包内 AOT 配置，目标语义：

| CLR 重载 | JS 短名 |
|---|---|
| GetComponent\<T\>() | GetComponentT |
| GetComponent(string) | GetComponentN |
| GetComponent(System.Type) | GetComponent |

三个返回值均使用 ActualTypeUserData：ByObj wrapper 的门面为运行时实际类型，null 仍为 null。GetComponentT 的方法泛型通过 GTAP，前缀只接受 System.Type wrapper。

```javascript
const component = go.GetComponentT(zents.typeof(MyComponent));
```

全签名键继续使用 CLR 名和 CLR 参数签名，不使用优化后的 Alias。

## 4. 配置与构建

优化 XML 仅作用于 AOT 的 UnityEngine.CoreModule。用户再次声明同一方法槽的 XML 会失败，不静默覆盖。关闭开关后不加载包内文件，但不会改变普通 Attribute/XML 的一般规则。

Editor 在新会话初始化消费开关和配置；Player 在 Generate 烘焙。修改后重新 Generate/构建，不提供运行时重载优化 XML 或给热更新程序集套用这些 XML 的入口。

## 5. 验收

分别验证开关开/关、GetComponentT/N/Type 的选择、实际派生类型与接口门面、null、Alias 重复失败和 Mono/Il2Cpp 一致性。先完成 GTAP 与 ActualTypeUserData 后才能宣称 Unity 优化可用。
