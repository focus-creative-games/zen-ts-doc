---
sidebar_position: 6
title: "CLR wrapper 与成员模型"
---

# CLR wrapper 与成员模型

规范中的 exotic、内部槽、STO 和 IEO 是可观察行为模型，不是某个引擎的对象内存布局。V8 可以用模板/内部字段，HostJs 可以用 Proxy 和句柄表实现同一规则。

## 类型与实例

类型对象负责静态成员和构造；实例 wrapper 通过其门面暴露实例成员。ByVal 保存 struct 值副本，ByObj 保留 CLR 对象身份；错误 receiver 和跨域 closure 使用会失败。

绑定期按规则扁平化继承成员，静态与实例成员分开。普通短名冻结；全 CLR 签名键按需懒解析，这个内部缓存不等于开放运行时注册。

## 身份与门面

同一 CLR 对象可以有不同声明门面，门面影响成员可见性，不改变对象身份。`cast` 只建立兼容门面；ActualTypeUserData 在合法返回槽位显式请求实际类型门面。

不能通过伪造 `__zents_id` 等属性获取 CLR 身份。Host token 与 generation、注册表共同验证；V8 identity 不能依赖移动 GC 后失效的裸地址。

## JavaScript 协议

普通 CLR 成员 miss 抛错；确实缺失的 then/Symbol 协议探测有受限例外。实例方法遵守 JS this，提取闭包后 `.call(receiver, ...)`，不隐式绑定。数组通过 get/set 和 length 暴露 CLR 下标。

完整查找顺序、隐藏/override 和特殊类型规则见[成员模型规范](../spec/metatable/index.md)。
