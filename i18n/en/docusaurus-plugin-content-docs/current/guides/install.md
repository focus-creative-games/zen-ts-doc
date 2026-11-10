---
sidebar_position: 1
title: "Installation and native SDKs"
---

# Installation and native SDKs

ZenTS supports both Git URL and embedded packages. Build and installation outputs live in the project; PackageCache does not need write access.

## Steps

1. Install `com.code-philosophy.zen-ts` through Package Manager, or embed the sources under Packages.
2. Build or import a complete V8 SDK matching the Editor OS/CPU.
3. Allow Editor plugins and `.meta` files to be generated. Restart if an older plugin is loaded.
4. Run `ZenTS/Install...` to install the project-local IL2CPP runtime and patches.
5. Initialize TypeScript, configure binding assemblies, and run `ZenTS/Generate Xml Bindings` and `ZenTS/Generate Typings`.

Resolve the package using Unity's `PackageInfo.resolvedPath`. In the commands below, `<tools>` is its `ZenTS~/v8` directory; do not hardcode a PackageCache hash path.

## Windows SDK

The pinned official V8 version is **13.6.233.17**, commit `b0a55a7dad7f536cce1f9aaddba89894c8533946`. Prepare official sources and depot_tools, then run:

```text
python <tools>/build_official.py --source <v8-source> --depot-tools <depot_tools> --out <gn-output> --export <original-sdk> --jobs 4
python <tools>/build_win64.py --project <unity-project> --sdk <original-sdk>
python <tools>/import_platform.py --project <unity-project> --sdk <unity-project>/Library/ZenTS/NativeBuild/windows-x64/sdk
```

These steps build official static V8, build ZenTS adapters and the Editor DLL, and install the complete SDK. With a cached SDK, `build_win64.py --project <unity-project>` rebuilds adapters only. `ZenTS/Native SDK/Import SDK...` also imports a complete SDK.

## Apple and Android SDKs

```text
python <tools>/build_platform.py --package <resolved-package> --source <v8-source> --out <gn-output> --export <complete-sdk> --target <macos|ios|ios-simulator|android> --cpu <arm64|x64>
python <tools>/import_platform.py --project <unity-project> --sdk <complete-sdk>
```

Apple builds require macOS/Xcode. Android builds run on Linux with `--ndk <ndk-path>`. iOS uses JITless V8. Match OS, CPU, source version, build options, and adapter sources; device and simulator libraries are different targets.

## File ownership

| Location | Contents |
|---|---|
| Package | Locks, source, tools, and source `.meta`; may be read-only |
| `Library/ZenTS/NativeSDK/<fingerprint>/<target>` | Validated immutable SDK |
| `Library/ZenTS/NativeBuild` | Local build workspaces |
| `Assets/ZenTSGenerated/Native/<target>` | Editor plugins and generated stable-GUID metadata |
| `Library/ZenTS/LocalIl2CppData-<Editor-platform>` | Project-local IL2CPP, patches, and generated code |

Do not commit generated native binaries or Native metadata; commit source `.meta` files normally. After deleting Library, reimport the SDK: leftover Assets plugins do not bypass validation. Use `ZenTS/Native SDK/Repair Editor Plugins` to repair missing files. Teams can distribute complete CI-built SDKs and import them independently into each project.

[Overview](../getting-started/installation.md) · [Platforms](../getting-started/compatibility.md) · [Builds](build.md)
