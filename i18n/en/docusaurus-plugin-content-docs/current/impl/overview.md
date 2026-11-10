---
sidebar_position: 0
title: "Implementation guide"
---

# Implementation guide

These pages describe code ownership and change points. The [specification](../spec/00-OVERVIEW.md) defines public behavior; source presence or compilation does not prove platform validation.

| Layer | Location |
|---|---|
| Public C# facade | Runtime/Common |
| Editor Mono | Runtime/Mono |
| Player facades | Runtime/Il2Cpp, Runtime/HostJs |
| Native CLR core | ZenTS~/zents-runtime: binding, bridge, marshal, mt, jvm |
| Engine interfaces/adapters | engine/EngineApi.h, engine/v8, engine/host |
| HostJs imports | Plugins/WebGL/HostEngine.jslib |
| Script facade | ZenTS~/jslib |
| SDK/install/generation | ZenTS~/v8 and Editor tools/build processors |

[Mono](MONO.md) covers reflection/Emit and callbacks; [IL2CPP](IL2CPP.md) covers static execution, linking, and HostJs. Update declarations and cross-host tests when changing rules.
