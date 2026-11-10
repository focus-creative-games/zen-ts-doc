---
sidebar_position: 23
title: "Editor V8 调试"
---

# Editor V8 调试

Windows/macOS Editor 可使用内置 V8 Inspector，通过 Chrome DevTools Protocol 调试 JavaScript 和 Source Map 对应的 TypeScript。默认关闭，Player 不带该服务。

## 开启与连接

在 ZenTS 设置中启用 `enableJsDebugger`，保持 `debuggerHostTypeName` 为空以使用内置实现。默认端口 9230，默认不等待附加。设置在下一次脚本域初始化生效，单纯切换开关不会启动监听。

初始化域后，在 Chrome 打开 `chrome://inspect/#devices`，Configure 添加 `127.0.0.1:9230`，连接 ZenTS Editor target。服务仅监听 IPv4 loopback，支持 `/json`、`/json/list`、`/json/version`，同一 target 仅一个客户端。

VS Code 可使用：

```json
{
  "version": "0.2.0",
  "configurations": [{
    "name": "ZenTS Editor",
    "type": "node",
    "request": "attach",
    "address": "127.0.0.1",
    "port": 9230,
    "sourceMaps": true,
    "outFiles": ["${workspaceFolder}/TsProject/out/**/*.js"],
    "sourceMapPathOverrides": {
      "http://127.0.0.1:9230/source/*": "${workspaceFolder}/TsProject/*"
    },
    "restart": true
  }]
}
```

这里的 node 调试适配器使用 Inspector 协议，不代表 ZenTS 嵌入 Node.js。配置示例存在于包的 `ZenTS~/debugger/launch.example.json`；验收使用真实 CDP，未自动化操作 VS Code GUI。

## 暂停和源码

支持断点、单步、局部变量、watch、异常暂停和嵌套 CLR 回调中的暂停。默认 TypeScript emit 生成 map；内置源码服务仅提供 TsProject 中的 JS/TS/map，源码 URL 正确编码空格与 Unicode。自定义加载器源码可通过 Inspector 读取；额外搜索路径面向自定义调试宿主，不会任意开放文件系统。

`debuggerWaitForAttach=true` 会阻塞 Unity 主线程，直到客户端发送运行继续命令。暂停期间处理调试协议，不运行游戏帧或 Editor Update。断开连接会解除暂停；Reset 创建新 target，需重新连接，旧委托仍然失效。

## 验收边界

Windows 实际协议和 Domain Reload 清理均通过且进程正常退出。macOS arm64 协议及 435 个命名用例通过；真实 Domain Reload 的 Inspector 清理与端口复用断言通过，但 Unity 随后退出超时，不能记为完整干净通过。macOS x64 插件仅编译验证。详见[当前状态](../getting-started/project-status.md)。

WebGL 用浏览器调试器，微信用开发者工具，不运行 Editor Inspector 服务。接口与资源规则见[调试规范](../spec/build/04-JS-DEBUGGER.md)。
