---
sidebar_position: 1
title: "Capabilities and tradeoffs"
---

# Capabilities and tradeoffs

This page evaluates ZenTS, not other projects' current version-specific feature lists.

## CLR interop

Lazy binding and shared bridges reduce Wrap maintenance. Attributes/AOT XML define policies explicitly. Frozen names plus lazy signatures provide stable access; declared views avoid accidental runtime-type member exposure.

The cost is defining and testing numeric, generic, byref, boxing, struct, and overload behavior across backends. No Wrap allowlist does not eliminate generation, stripping configuration, or AOT limitations.

## Engines and platforms

Official static V8 sits behind an owned engine API; WebGL/WeChat use the platform VM and shared CLR core. This avoids another embedded interpreter in Mini Games and confines module/GC/WASM differences to adapters.

SDK builds/distribution, iOS JITless, and HostJs capabilities remain costs. Validate actual converter output rather than assuming browser success covers every Mini Game platform.

## Workflow

Read-only UPM, Library SDKs, generated plugin metadata, TypeScript emit/declarations, and Inspector support the development workflow. Editor debugging is not a Player remote-debugging service.

## Compare fairly

Evaluate rule coverage, maintenance for new types, AOT/stripping reliability, GC/Reset leaks, debugging, and SDK distribution. Measure performance, size, and memory in the same application; correctness results are not rankings. See [status](../getting-started/project-status.md) before testing your own targets.
