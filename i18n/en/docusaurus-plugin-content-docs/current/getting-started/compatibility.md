---
sidebar_position: 3
title: "Compatibility and platforms"
---

# Compatibility and platforms

## Engine versions

ZenTS supports **Unity 2022.3.x LTS and later LTS releases**, and **Tuanjie based on Unity 2022.3.x LTS**. Unity 2021.3 and non-LTS releases are outside the support policy. A patch file does not establish validation for every matching configuration; installation must select a compatible patch and the build must succeed.

## Backends and validation

| Environment | Backend | Integration and validation |
|---|---|---|
| Windows x64 Editor | Mono + V8 | Full regression and Inspector validation |
| macOS arm64 Editor | Mono + V8 | Full regression and Inspector protocol; see the shutdown limitation |
| macOS x64 Editor | Mono + V8 | Plugin compiled; Intel Editor not run |
| Win64 Player | IL2CPP + V8 | Full regression |
| macOS arm64/x64 Player | IL2CPP + V8 | Runtime validated; x64 ran under Rosetta |
| Android arm64/x64 | IL2CPP + V8 | MuMu emulator validated; arm64 uses emulator translation |
| iOS x64 Simulator | IL2CPP + JITless V8 | Simulator validated |
| iOS arm64 device | IL2CPP + JITless V8 | Unsigned compilation only; no device runtime validation |
| WebGL | IL2CPP/WASM + HostJs | Chrome runtime, GC, Reset, and constrained-host validation |
| WeChat Mini Games | IL2CPP/WASM + HostJs | Official SDK conversion and developer-tools runtime; no phone validation |
| Tuanjie | V8 Editor; static V8 native Player; HostJs WebGL/WeChat | Supported; WeChat target recognized as `WeixinMiniGame` |

Native platforms follow the V8 route. Other platforms without a suitable V8 SDK are not automatically supported. HostJs covers explicitly integrated targets; a MiniGame-like name does not imply support for Douyin, HarmonyOS, automotive, or other platforms.

HostJs currently requires `Proxy`, `BigInt`, `WeakRef`, and `FinalizationRegistry`. Missing weak-reference capabilities cause an explicit failure. The bridge uses a single-threaded synchronous configuration; Workers are not arbitrary synchronous CLR calling threads.

See [status](project-status.md) for versions and test scope, and [builds](../guides/build.md) for SDK identity requirements.
