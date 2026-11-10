---
sidebar_position: 5
title: "TypeScript workflow"
---

# TypeScript workflow

TypeScript provides checking, CLR declarations, and source maps. ZenTS executes emitted JavaScript. Node is used for build tooling; its standard library is not embedded at runtime.

## Layout

```text
TsProject/
  src/                  # handwritten TypeScript
  out/                  # emitted JS and maps
  generated/csharp/     # csharp: declarations
  generated/js-exports.json
  tsconfig.json
  package.json
```

`ZenTS/Init TypeScript Project` prepares the project and dependencies; `ZenTS/Generate Typings` creates declarations; `ZenTS/Compile TypeScript` checks and emits. `Settings.typescriptBindingAssemblies` selects declaration assemblies. Defaults include Assembly-CSharp and the package test assembly; configure your own assemblies as needed.

## Modules and exports

```typescript
import { Demo } from 'csharp:Assembly-CSharp';
export function compute(a: number, b: number): number {
  return Demo.Add(a, b);
}
```

Use canonical names such as `demo/main`, without `.js`. `csharp:` exports CLR types; GetFunction targets ordinary script function exports.

Declarations represent out result tuples and explicit BigInt slots. Default 64-bit integers remain number; declarations cannot recover floating-point precision. Validate optional arguments, generic constraints, and AOT instantiations separately.

## Checking and publishing

`enableTsPlayGate` defaults to true: check before Play and emit stale output. It does not replace AOT configuration or Player testing. Use build processors for platform-specific publishing rather than hardcoded Editor file paths.

HostJs compiles ESM into static factories at build time, without eval. Dynamic import, import.meta, and top-level await are unsupported. Rebuild when adding modules or Reset source variants.

## Debugging

Keep matching src, out, and map files. Default emit generates maps, and Inspector serves TsProject sources. If breakpoints remain unbound, check module URLs, stale emit, and map identity before changing [debugger settings](js-debugger.md).
