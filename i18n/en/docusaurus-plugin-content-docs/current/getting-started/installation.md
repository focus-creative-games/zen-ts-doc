---
sidebar_position: 1
title: "Installation overview"
---

# Installation overview

Install ZenTS using a Git URL in Package Manager, or embed its source at `Packages/com.code-philosophy.zen-ts`.

Before running scripts:

1. Install a supported Unity Editor and the required platform modules.
2. Build the static SDK from the matching official V8 sources, build the ZenTS adapters, and import it into the project. The Editor also requires an SDK for its OS/CPU.
3. SDKs are stored under `Library/ZenTS/NativeSDK`. Editor plugins and their `.meta` files are generated under `Assets/ZenTSGenerated/Native`.
4. Run `ZenTS/Install...`. Prepare Player configuration using `ZenTS/Generate Xml Bindings`, `ZenTS/Generate Typings`, and the target build settings.
5. Create a TypeScript project or provide a JS loader, then call `JsAppDomain.Initialize`.

Restart the Editor after updating a loaded native plugin. SDKs, DLL/dylib/a/lib files, and generated native metadata are managed locally; they are not written into PackageCache or committed as package source.

See [SDK installation](../guides/install.md) for build/import commands and [bidirectional calls](../guides/hello-interop.md) for the first interop example.
