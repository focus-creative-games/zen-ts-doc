---
sidebar_position: 23
title: "Debug V8 in the Editor"
---

# Debug V8 in the Editor

Windows/macOS Editors include V8 Inspector for JS and source-mapped TypeScript debugging over Chrome DevTools Protocol. It is disabled by default and absent from Player builds.

## Enable and attach

Enable Settings.enableJsDebugger and leave debuggerHostTypeName empty for the built-in host. The default port is 9230; waiting for attachment is off. Settings apply at the next domain initialization, not merely when toggled.

After initialization, open `chrome://inspect/#devices`, configure `127.0.0.1:9230`, and inspect the ZenTS Editor target. Discovery supports `/json`, `/json/list`, and `/json/version`. It listens only on IPv4 loopback, with one client per target.

VS Code configuration:

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

The node debug adapter speaks Inspector; ZenTS does not embed Node.js. The package includes `ZenTS~/debugger/launch.example.json`. Validation uses real CDP, not automated VS Code GUI interaction.

## Pausing and sources

Supports breakpoints, stepping, locals, watches, exception pauses, and pauses inside nested CLR callbacks. Default emit produces maps. The source service exposes JS/TS/map within TsProject and encodes spaces/Unicode in URLs. Custom-loader scripts remain readable through Inspector. Extra search paths serve custom hosts; they do not grant arbitrary filesystem access through the built-in service.

`debuggerWaitForAttach=true` blocks Unity's main thread until the client continues execution. Paused loops process debug protocol, not gameplay or Editor Update. Disconnect resumes; Reset creates a new target and invalidates old delegates.

## Validation scope

Windows protocol and Domain Reload pass with clean exit. macOS arm64 protocol and 435 named cases pass; Domain Reload cleanup/port-reuse assertions pass, but Unity later times out during shutdown. This is not a clean full-run pass. The macOS x64 plugin has compilation validation only. See [status](../getting-started/project-status.md).

WebGL uses browser tools and WeChat uses developer tools, without the Editor service. See the [debugger specification](../spec/build/04-JS-DEBUGGER.md).
