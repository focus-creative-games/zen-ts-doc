---
sidebar_position: 15
title: "Settings"
---

# Settings

ZenTS.Settings persists in `ProjectSettings/ZenTS.asset`. The table lists source defaults; existing serialized user values may differ and are not all reset by migration.

| Field | Default / meaning |
|---|---|
| enable | true; install/build integration |
| enableUnityOptimizations | true; bundled Unity Alias/MarshalAs |
| enableTsPlayGate | true; TS check/stale emit before Play |
| typescriptBindingAssemblies | Assembly-CSharp, ZenTS.Tests; configure business assemblies |
| enableJsDebugger | false |
| debuggerHostTypeName | Empty selects built-in V8 Inspector; otherwise custom host |
| debuggerPort | 9230 |
| debuggerWaitForAttach | false; true blocks main thread until protocol continuation |
| debuggerSourcePaths | Empty; additional search paths for custom hosts |
| marshalAsXmlPaths | Assets/CustomJsMarshalAsRules.xml |
| jsAliasXmlPaths | Assets/CustomJsAliasRules.xml |
| jsExtensionXmlPaths | Assets/CustomJsExtensionRules.xml |

XML fields accept files/directories. Default example paths do not guarantee those files exist. The built-in source server stays within TsProject; search paths do not expose arbitrary files.

## Timing and precedence

XML is AOT-only: Editor snapshots, Player generated tables. Hot-update assemblies use attributes; Reset does not reload XML. No runtime registration/hot reload/Reload exists.

With Unity optimizations enabled, bundled rules precede user paths. Duplicate slots fail rather than last-writer-wins; different methods may share alias groups. Attributes precede valid XML without bypassing legality checks.

Reinitialize Editor sessions after config changes; regenerate/rebuild Players. Debugger settings apply on next domain initialization, not toggle alone.

## SDK selection

No QuickJS settings/plugins/fallback remain. Native V8 version follows locks/manifests/fingerprint; HostJs version follows platform VM. Active domains cannot switch engines. Match Library SDK, Assets plugin, and native link identity; restart after loaded-plugin updates. See [build/version](11-MULTI-VERSION.md).
