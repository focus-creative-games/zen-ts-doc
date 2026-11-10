---
sidebar_position: 14
title: "TypeScript workflow"
---

# TypeScript workflow

## 1. Scope and layout

TypeScript checks/emits at edit/build time; engines execute JS. Editor emit and HostJs factories are integrated and validated separately.

TsProject/src contains business TS, out contains JS/maps, generated contains csharp: declarations/export metadata. Library/ZenTS/CoreLibs stages package types/jslib. Do not generate business sources in read-only UPM caches.

## 2. Checks and modules

Run tsc --noEmit and emit according to settings before Play/build. Type errors block the relevant flow. Skipping checks as a maintenance option does not change runtime/AOT contracts.

csharp: splits assembly/path at the first slash; namespaces use dots, nested types plus. Named exports share CSharp identity; no default export exists. Ordinary canonical module names omit .js. import type is erased, not a runtime type object.

## 3. Declarations

| CLR/policy | TypeScript |
|---|---|
| Default integers, including long/ulong, and floats | number |
| Concrete long/ulong BigInt slots | bigint |
| Default 64-bit enums | number |

Consume annotations per parameter/return/field/property/byref element; do not globally map long/ulong to bigint or propagate annotations to object/array elements.

out is removed from JS inputs and returned as tuples, including a single void out. ref/in remain inputs with legal value/Opaque forms. params declares rest expansion and matching CLR-array forms, without automatic whole-JS-Array semantics. UnpackedValues slot counts use Members; nested result arrays are not flattened.

```typescript
// CLR: bool TryGet(int key, out string value)
TryGet(key: number): [result: boolean, value: string | null];
// CLR: void Position(out float x, out float y)
Position(): [x: number, y: number];
```

These are generated member fragments, not standalone declarations.

## 4. Native modules

Load canonical JS sources through V8 compile/link/evaluate. GetFunction binds synchronously ready named exports and does not block on top-level async. Source URLs/maps identify corresponding TS; cache identity includes source/engine.

## 5. HostJs publishing

esbuild parses ESM, synthesizes csharp:, and emits rebuildable static factories. No runtime eval/new Function or regex-based full ESM emulation. Dynamic import/import.meta are rejected; top-level await fails CommonJS compilation. Import/export/cycles/live binding follow actual builder support and tests.

Preload network bundles/subpackages before synchronous CLR entry. Reset reconstructs module instances rather than retaining platform import singletons. Include all source variants at build time.

Editor reads TsProject/out; Android/WebGL/WeChat publish sources via Resources/TextAsset as applicable. HostJs executes factories and uses source text for identity matching, not eval. Platform adapters manage code/maps/subpackages. wx exists only in its platform; use application facades/capability checks for Editor portability.

## 6. Configuration and validation

AOT XML is consumed at initialization/generation, never a runtime bootstrap for hot-update assemblies. Check emit/declarations/maps, number/BigInt, out/params/generics, and bundles separately. Three passing TS examples do not establish every TS syntax/AOT/platform combination.
