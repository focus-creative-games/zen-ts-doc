# ZenTS 文档维护

中文行为规范在 `docs/spec` 直接维护。其余 `docs` 页面是重新编写的使用文档，以规范和实际实现为依据。不要从旧测试工程 Docs 快照恢复内容。

## 本地验证

```bash
npm ci
npm run check:docs
npm run typecheck
npm run build
npm start
```

中文为规范维护源，对应英文位于 `i18n/en/docusaurus-plugin-content-docs/current`。当前 81 篇页面已逐页重写英文，并同步首页及导航。后续仍先校准中文，再按内容翻译英文；发布前执行双语检查和全部 locale 构建。单独构建可用 `npm run build:zh` 或 `npm run build:en`。

## 内容职责

| 内容 | 维护方式 |
|---|---|
| docs/spec | 根据实际 package、ZLua 规则和针对性测试校准，保留精确契约 |
| docs 其他页面 | 面向读者独立编写流程、概念、API 和平台限制 |
| 源码及验收 | 对照 package 的 Runtime、Editor、ZenTS~/v8、migration、debugger |
| 平台状态 | 区分构建接入、编译、模拟器/工具运行、真机和进程退出 |
| 中文 UI | src、docusaurus.config.ts、i18n/zh-CN/code.json |
| 英文 | 中文批准后逐页真实翻译，不能复制中文冒充英文 |

`sync-spec` 仅进行只读检查，不再删除/覆盖 spec。旧 `generate-content` 生成器已停用并报错。`sync-i18n-en` 现仅执行只读双语检查，不复制或覆盖页面，`--force` 也不会写入翻译。Mermaid 暂以 text 围栏展示，保持当前 Docusaurus/React SSG 兼容。

修改时核对 API 和实际菜单名称、模块路径、AOT/裁剪、SDK 位置及平台证据。测试数量、支持政策、运行范围和历史结果分开记载；严禁把缺失实测改写成全平台通过。中文文档有任何新增页面或规则，审阅后同步对应英文再发布完整站点。

源码：[zen-ts](https://github.com/focus-creative-games/zen-ts) · 文档：[zen-ts-doc](https://github.com/focus-creative-games/zen-ts-doc) · 对照：[ZLua](https://doc.zlua.cn)
