---
sidebar_position: 6
title: "HostJs"
---

# Build — HostJs

> Script engine for the WebGL Player. The Editor and other Il2Cpp players stay on QuickJS. See [01-QUICKJS.md](./01-QUICKJS.md).
> This page records only the accepted contract. Shim fixes that made WebGL match QuickJS are not listed as differences.

---

## 1. Switch

`QuickJsCompatible.h` selects the header with the compiler predefined `__EMSCRIPTEN__`. Emscripten includes `hostjs/quickjs.h`. Other targets include `../quickjs/quickjs.h`.

Install follows the active Build Target. WebGL, and targets whose names contain `MiniGame`, `Weixin`, `Douyin`, or `TikTok`, do not copy `ZenTS~/quickjs-il2cpp` into `libil2cpp/quickjs`. Other players still copy it. Switching target requires Install again. `ZenTS/Dev/MarkedAsInstalled` only refreshes the install stamp.

`JSValue` in the shim is 16 bytes (NaN-boxing off). The C++ MethodBridge is not rewritten for the engine switch.

The first promised Unity version is **2022.3.62f3** WebGL. Mini-game templates, subpackages, and a prebuilt `game.js` are out of scope.

---

## 2. Call frame

One JS-to-C# method call crosses JS↔WASM once. The wrapper writes arguments into `ZentsXferSlot`, then calls `zents_host_enter_cfunc(funcId, argc)`.

| Value | What the frame stores |
|-------|------------------------|
| number, boolean | tag and immediate |
| string | UTF-8 and length written in that same wrapper, before entering C |
| object | handle |

`JS_Is*`, `JS_ToInt32`, and `JS_ToFloat64` read the local tag and do not cross again. Slot capacity is 64. Beyond that, JS throws `zents: too many arguments` and does not enter C.

---

## 3. Module subset

Module loading stays synchronous. The synthetic promise is already fulfilled when `JS_LoadModule` returns.

**Form A (WebGL publish).** Preprocess wraps ESM as `zents.define(name, deps, factory)`. The Editor still reads unwrapped ESM from `TsProject/out`. A wrap failure fails the WebGL build. A source that contains `zents-define: skip` is copied unchanged so the runtime can still reject `import()`.

**Form B (runtime subset).** Named import/export, side-effect import, `export function` / `const` / `class`, `export { a as b }`, and `export { x as y } from` are accepted. `import()`, `import *`, default import, `export default`, and top-level `await` throw `zents: unsupported module syntax` and include the file name.

`csharp:` is not passed to the business loader. The specifier splits at the first `/` into an assembly name and a type path.

---

## 4. Must match

Observable results of the existing interop cases must match the QuickJS Editor backend: `GetFunction`, unregistered members, `null` / `undefined`, primitive and bigint rejection, struct / Table / Nullable, arrays, byref / Opaque expiry outside the call, `csharp:`, `Reset`, and `zents.*` generics and array factories.

---

## 5. Allowed differences

Only the items in design §13.2. P4 did not skip any case.

| Item | Contract |
|------|----------|
| Language engine | The Editor baseline remains QuickJS `2026-06-04`. The browser may run syntax QuickJS rejects. That script failing in the Editor matches the baseline |
| RegExp, Date, sort, locale | Interop tests do not depend on them. The P4 suite had no such cases |
| Error stack text | The message stays diagnosable and keeps the `zents:` prefix. Stack format may differ |
| Microtasks | The shim queue is drained at end of frame. Async modules are not in v1 |
