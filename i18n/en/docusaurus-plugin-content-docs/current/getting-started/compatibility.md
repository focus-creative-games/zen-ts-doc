---
sidebar_position: 3
title: Compatibility
description: Unity versions, runtimes, and supported platforms.
---

# Compatibility

## Unity / Tuanjie

| Version | Status |
|---------|--------|
| Unity **2021.3.x** | ✅ Supported |
| Unity **2022.3.x** | ✅ Supported |
| Unity **6000.0.x** | ✅ Supported |
| Unity **6000.3.x** | ✅ Supported |
| Unity **6000.5.x** | ✅ Supported |
| **Tuanjie Engine 1.x.y** | ✅ Supported |

libil2cpp patch resolution: see [Multi-version](/docs/spec/11-MULTI-VERSION/).

## Script VM and runtimes

| Category | Status |
|----------|--------|
| **Script VM** | Editor and non-HostJs players: **QuickJS** (pin under package `ZenTS~/`). **WebGL Player: the host JS engine**. No PUC-Rio / LuaJIT switch |
| **Editor** | **Mono** (Expression Emit; **JS-visible semantics match** Il2Cpp) |
| **Player** | **Il2Cpp** (authoritative; `zents-runtime` C++ bridges) |

**Il2Cpp builds:** before shipping, run **`ZenTS/Generate/All`** (C++ stubs, **not** C# Wrap). See [Build](/docs/guides/build/), [Editor vs Player](/docs/guides/editor-vs-player/).

## Target platforms

| Category | Scope |
|----------|-------|
| **Editor (dev)** | **Windows x64**, **macOS** (Apple Silicon / Intel) |
| **Player (Il2Cpp)** | Designed for **all targets Unity / Tuanjie Il2Cpp normally supports**, including but not limited to **Win64**, **Android**, **iOS**, **WebGL**, **WeChat Mini Games**, **HarmonyOS / automotive**, and other desktop / mobile / mini-game / vehicle Il2Cpp build targets |

Non-HostJs targets link QuickJS into the player after Install. The **WebGL Player uses the host JS engine** and does not compile QuickJS into WASM. Details: [QuickJS build](/docs/spec/build/01-QUICKJS/) §5 and [HostJs](/docs/spec/build/06-HOSTJS/).

| Target | Script engine |
|--------|----------------|
| Editor, and non-HostJs players such as Win64 / Android / iOS | QuickJS |
| WebGL Player | Host JS (HostJs) |
| Target name contains `MiniGame` / `Weixin` / `Douyin` / `TikTok` | Same as WebGL: QuickJS is not installed. Mini-game templates are out of scope |

For other platform issues, please [file an Issue](https://github.com/focus-creative-games/zen-ts/issues).

Semantic contracts live under [spec](/docs/category/spec/); project stage: [Project status](/docs/getting-started/project-status/).
