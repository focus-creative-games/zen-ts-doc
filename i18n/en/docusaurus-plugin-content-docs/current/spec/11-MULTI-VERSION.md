---
sidebar_position: 11
title: "Versions, installation, and builds"
---

# Versions, installation, and builds

## 1. Support policy

Unity **2022.3.x LTS and later LTS**, plus Tuanjie based on 2022.3. Unity 2021.3/non-LTS and unintegrated native/Mini Game targets are not implied by compatibility code. Validate engine/platform combinations separately.

CLR toolchain and JS backend versions are separate. Native V8 uses locked SDK identity; HostJs uses the platform VM. No QuickJS or runtime engine-switch fallback remains.

## 2. Source layout

| Location | Responsibility |
|---|---|
| Runtime/Mono/Engine, Engine/V8 | Managed engine contracts and Editor ABI |
| Runtime/Mono/Binding | Mono CLR plans |
| ZenTS~/zents-runtime/engine | EngineApi and V8/HostJs adapters |
| binding, bridge, marshal, mt, jvm | CLR plans/execution |
| Plugins/WebGL/HostEngine.jslib | JS/WASM protocol |
| ZenTS~/v8 | Locks/build/import tools, not binary libraries |
| ZenTS~/patches/libil2cpp | Unity/Tuanjie patches |
| ZenTS~/debugger | Inspector configuration and usage |

The package does not bundle full stock IL2CPP or V8 source trees. Generated files/libraries go into project-local tooling, not read-only packages.

## 3. UPM and SDKs

Git URL installation is supported; resolve package paths via PackageInfo.resolvedPath, not cache hashes.

SDKs reside at `Library/ZenTS/NativeSDK/<fingerprint>/<target>`, indexed by installed.json. Builds use Library/ZenTS/NativeBuild. Editor plugins/stable-GUID meta are generated under Assets/ZenTSGenerated/Native for matching Editor OS/CPU only.

Validate official commit, provenance, ABI, target, adapter source, and hashes. Source identity normalizes CRLF/LF; binaries remain byte-exact. Loaded plugins are not overwritten: restart to activate updates. Deleting Library requires reimport, not trust in leftover Assets binaries.

Do not commit generated native binaries/meta; commit source metadata normally. Teams may distribute complete validated SDKs.

## 4. Install and patches

ZenTS/Install... copies stock IL2CPP, applies matching patches, installs runtime and generated/link inputs into `Library/ZenTS/LocalIl2CppData-<Editor-platform>`.

Within major.minor select the highest patch floor not newer than the Editor; Unity 6 can use the existing major-series fallback. Missing/incompatible patch contexts fail rather than silently applying another version. Patch presence is not runtime validation. Keep changes limited to hooks/shims, with binding logic in ZenTS runtime.

## 5. Linking and selection

Native Players statically link V8/adapters; iOS uses JITless libraries in Xcode exports. Win64 exports include required libraries for incremental native builds. WebGL/WeChat use HostJs glue, factories, and bootstrap, without V8.

Editor selection takes precedence. Players use explicit WebGL/WeixinMiniGame macros/targets or ZENTS_HOST_JS. Do not match every name containing MiniGame. Managed/native/bundle identities must agree before compilation; late define changes cannot retroactively change compiled C#.

## 6. Generation and configuration

Generate Xml Bindings emits MarshalAs/Alias/Extension C++ tables; Generate Typings emits declarations. Shared bridges depend on runtime/AOT code, not arbitrary generic machine-code generation by these menus.

XML is AOT-only: Editor snapshots, Player tables. No runtime registration/hot reload/Reload or Reset reload exists. Hot-update assemblies use attributes; this does not promise arbitrary DLL hot loading.

## 7. Caches and iteration

Fingerprint package/source, engine/toolchain, target/CPU, backend, patches, configuration, and generated inputs. Header macros must match libraries. Invalidate affected caches after changes.

C++-only changes may reuse a Win64 export while preserving its generated output. C# types/InternalCalls/fixtures/generated inputs require regeneration/export; new libraries/options may require project updates.

## 8. Validation

Separate source/build availability, compilation, SDK installation, runtime, and clean exit. Do not claim all IL2CPP platforms based on a subset. See [status](03-ALIGNMENT.md) and [compatibility](../getting-started/compatibility.md).
