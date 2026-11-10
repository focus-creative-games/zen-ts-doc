---
sidebar_position: 22
title: "Build and publish"
---

# Build and publish

Choose the CLR host and JS backend, then prepare matching artifacts. ZenTS supports Unity 2022.3.x and later LTS releases, plus Tuanjie based on 2022.3. See the [platform matrix](../getting-started/compatibility.md).

## Common Player preparation

Configure binding assemblies and AOT XML. Check and emit TypeScript; run `ZenTS/Generate Xml Bindings` and `ZenTS/Generate Typings`. Preserve metadata, generic instantiations, and required bridges.

Generate Xml Bindings emits the three AOT XML configuration tables; Generate Typings emits C# declarations. Runtime invokers and AOT code provide shared calling bridges. These menus do not create arbitrary missing generic machine code or per-type business Wraps.

`ZenTS/Install...` prepares the project-local IL2CPP runtime and patches. Test delegates, struct writeback, exceptions, GC, and Reset on the actual target.

## Native Players

| Target | Integration |
|---|---|
| Win64 | Static V8 and adapter libraries linked into the Player; VS export includes required libraries |
| macOS | Matching arm64/x64 static libraries; Editor plugins installed separately |
| Android | Target-ABI libraries built with Linux/NDK, then linked by Unity |
| iOS | JITless libraries copied into Xcode export; device and simulator builds are separate |

SDKs live in Library; packages need no write access. See [installation](install.md). Reuse an exported Win64 VS project for C++-only iteration. Changes to C# types, fixtures, or generated inputs require regeneration and IL2CPP export; library/build-option changes may require project updates.

## WebGL

WebGL uses the browser VM, without V8 in WASM. Build processors compile ESM into factories and synthesize `csharp:`. Preload scripts before synchronous CLR entry; this is not runtime source evaluation.

Proxy, BigInt, WeakRef, and FinalizationRegistry are required. Current builds are single-threaded. Dynamic import and import.meta are rejected; top-level await fails the current CommonJS build. Include Reset source variants at build time. See [HostJs](../spec/build/06-HOSTJS.md).

## WeChat Mini Games

Install the [official Unity/Tuanjie converter SDK](https://github.com/wechat-miniprogram/minigame-tuanjie-transform-sdk), then use `ZenTS/Build WeChat Mini Game` or batch entry `ZenTS.Editor.WeChatBuild.RunBatch`. Reflection-based integration keeps the SDK optional for native projects.

| Variable | Purpose |
|---|---|
| `ZENTS_WECHAT_APPID` | Mini Game AppID |
| `ZENTS_WECHAT_OUTPUT` | Conversion output root |
| `ZENTS_NODE` | Node executable for the build |
| `ZENTS_WECHAT_ACCEPTANCE=1` | Validation only: self-contained development package/test configuration |

Normal builds preserve converter subpackage/CDN/development settings and restore temporary template, graphics, and codegen changes. Output usually resides in `minigame` under the output root.

Developer-tools execution is validated; phone execution, upload, and production release are separate scopes. The temporary log collector belongs to validation copies, not shipped games. A failed localhost logging connection is not a successful test: run the matching collector or use a normal build.

## Release checks

Verify target, SDK identity, and ABI, then run applicable tests with explicit skips recorded. Editor Inspector does not add a Player listener. See [status](../getting-started/project-status.md) for validation limits.
