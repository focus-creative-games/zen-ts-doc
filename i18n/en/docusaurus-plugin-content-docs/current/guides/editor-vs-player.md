---
sidebar_position: 21
title: "Editor and Player"
---

# Editor and Player

Editor and Player share observable interop rules but execute CLR calls differently. Compare results, error categories, writeback, and lifetimes rather than engine-specific stack text.

| Environment | CLR execution | JS execution | Preparation |
|---|---|---|---|
| Windows/macOS Editor | Mono reflection and Expression Emit | Native V8 plugin | Editor OS/CPU SDK |
| Native Player | IL2CPP metadata and static bridges | Static V8; JITless on iOS | Target SDK, generation, preservation |
| WebGL/WeChat Player | IL2CPP/WASM static bridges | Platform VM | Static factories and platform conversion |

Editor Emit does not prove an AOT generic instantiation exists. Preserve the required methods, delegate signatures, and metadata before building a Player.

## Configuration and modules

Alias, MarshalAs, and Extension XML apply only to AOT assemblies. The Editor snapshots configuration when initializing a session; Players use baked tables. Reset does not reload XML. Hot-update assemblies use attributes.

Editor/native loaders can read files; Android/WebGL use published resources or precompiled factories. Platform APIs such as wx exist only in their host, not in Editor V8.

## Reset and debugging

Play Mode schedules Reset for EndOfFrame. Edit-mode/batch Editor execution applies it synchronously. Reacquire delegates after the reset.

The Editor uses V8 Inspector, WebGL uses browser tools, and WeChat uses developer tools. Editor debugging adds no Player listener. See [debugging](js-debugger.md).
