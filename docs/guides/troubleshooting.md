---
sidebar_position: 24
title: "故障排查"
---

# 故障排查

先记录 Unity/团结版本、OS/CPU、脚本后端、SDK 指纹和首次错误，再按实际失败阶段定位。不要把 Install 成功当作运行测试成功。

| 现象 | 优先检查 |
|---|---|
| Editor 找不到原生插件 | 已导入当前 OS/CPU 完整 SDK；Assets 生成目录及 meta；是否需要重启 |
| SDK 源码身份或哈希不匹配 | 重新构建适配层并导入；不要修改 manifest 绕过校验 |
| Git 安装 package 不可写 | 正常；SDK 写 Library、插件写 Assets，不要向 PackageCache 放库 |
| 类型或成员不存在 | 程序集名、CLR 完整名、可见性、声明门面、Alias、裁剪保留 |
| 重载失败/歧义 | 输入槽位、undefined/null、严格数值范围；用全签名键诊断 |
| Editor 成功、Player 失败 | AOT 泛型、桥、Generate 表及链接 SDK；不能依靠 Editor Emit |
| Reset 后委托失败 | 旧域委托按设计失效；重新 GetFunction |
| XML 改后无变化 | 不是热更新；重建 Editor 会话并重新 Generate/构建 Player |
| bigint 不匹配 | 仅显式 BigInt long/ulong 槽位接受；默认仍为 number |
| HostJs 模块源码不匹配 | 所有源码变体须预编译，重新构建，不能用模块名静默兜底 |
| HostJs 缺 WeakRef/FinalizationRegistry | 宿主能力不足，当前没有强引用假弱引用降级 |

## 调试器

确认设置已在域初始化前启用、端口未占用、连接使用 127.0.0.1。断点未绑定先检查 emit/map 和源码 URL。等待附加或断点会暂停 Unity 主线程；这与业务死锁需要区分。macOS Domain Reload 退出超时的已知验收限制见[状态记录](../getting-started/project-status.md)。

## 微信测试日志

localhost 日志收集地址仅用于验收副本。收集器未运行时请求会失败，不是正常发布依赖；重新启动完整验收流程，或使用正常构建产物。不要上传带测试注入的副本。

提交问题时给出最小 C#/JS 复现、目标平台、生成/构建步骤、完整首个异常和脱敏日志。记录显式跳过及原因；不要用跳过本应支持的互操作来消除失败。
