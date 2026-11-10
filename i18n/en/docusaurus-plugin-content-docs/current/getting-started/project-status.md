---
sidebar_position: 4
title: "Implementation status and validation"
---

# Implementation status and validation

This page describes functionality and validation as of **2026-11-10**. Compilation, emulator execution, and physical-device execution are listed separately.

## Implemented

Unity and Tuanjie support, native V8, Editor Mono and Player IL2CPP, WebGL/WeChat HostJs, ZLua-aligned interop, read-only UPM installation, project-local static SDKs, the TypeScript workflow, and Editor Inspector are integrated. QuickJS has been removed.

| Environment | Named JS cases | Smoke / TS examples |
|---|---|---|
| Windows Editor | 435 passed, 0 failed | 8/8, 3/3 |
| Win64 Player | 435 passed, 0 failed | 10/10, 3/3 |
| macOS arm64 Editor | 435 passed, 0 failed | 8/8, 3/3 |
| Chrome WebGL | 434 passed, 1 explicitly skipped, 0 failed | 10/10, 3/3 |
| WeChat developer tools | 434 passed, 1 explicitly skipped, 0 failed | 10/10, 3/3 |

`56/56` counts modules: 52 contain named JS suites, and four support C#-driven export/initialization tests. The single HostJs skip is a managed-worker test unavailable in the single-threaded build. Test counts are not branch coverage.

## Other platform validation

macOS arm64/x64 Players, Android arm64/x64 emulators, and the iOS x64 Simulator passed an earlier full module matrix, ten smoke tests, and three TS examples. They have not all rerun the latest 435 named cases. iOS arm64 has unsigned compilation validation only.

WeChat was validated with Unity 2022.3.62f3, converter SDK `202610200817`, developer tools `2.01.2510260`, and base library `3.17.6`. This does not cover phones, upload, or production release. Tuanjie is supported; its WeChat target uses HostJs.

## Inspector limitation

Windows Inspector protocol and Domain Reload were validated. macOS arm64 protocol and Inspector resource cleanup were validated, but Unity 2022.3.56f1c1 on macOS 26.0 has an unresolved shutdown timeout after Domain Reload. The Intel Editor plugin has compilation validation only.

## Validate your project

Rerun applicable tests when adding a platform or upgrading an SDK. Follow [installation](../guides/install.md), [builds](../guides/build.md), and [testing](../community/testing.md) for your target environment.
