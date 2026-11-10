---
sidebar_position: 4
title: "JavaScript debugger"
---

# JavaScript debugger

## 1. Implementation

Native V8 Editor includes official Inspector with loopback HTTP/WebSocket discovery, breakpoints, stepping, expressions, exception pauses, and TS maps. Empty debugger host override selects it; IZentsJsDebuggerHost remains an extension interface. HostJs uses platform tools/maps. See [debugging](../../guides/js-debugger.md).

Debugging does not alter overloads, marshaling, threads, or lifetime. No QuickJS-specific API or Lua debugger protocol is required.

## 2. Native V8

Disabled by default, port 9230, IPv4 loopback only. Background threads perform I/O; Inspector dispatch/pause loops execute on the isolate owner. RequestInterrupt requests protocol processing safely, including CPU-bound script pauses, without gameplay/Unity Update execution on background threads.

Canonical modules map to `/source/out/<module>.js`. The service exposes JS/TS/maps within TsProject. Wait-for-attach gates first execution until Runtime.runIfWaitingForDebugger; normal sessions may attach later.

Paused callbacks preserve nested frames/errors. Disconnect from business or Inspector-evaluation pauses resumes execution. Active dispatch retains its connection until return; stale responses do not reach new clients.

Disconnect releases session/remote references but leaves discovery available for reattach. Play end, Reload, Reset, and exit stop transport/listeners and release Inspector/context resources. Each generation gets a new target ID; ports may be reused. Reconnect and restore breakpoints for the new target.

## 3. HostJs

Platform tools observe the existing VM. Preserve TS-to-bundle maps and diagnostic module names, including subpackages. Platform pause/performance-tool features are not uniform ZenTS guarantees. Do not embed a second Inspector or competing Promise VM.

## 4. Settings and SDKs

See [Settings](../15-SETTINGS.md) for timing and defaults. Example configurations and usage are in ZenTS~/debugger/README.md. Rebuild/import adapters after SDK changes; restart loaded Editor plugins. Artifacts remain in Library/Assets, not PackageCache. Platform limitations remain listed in [status](../03-ALIGNMENT.md).
