---
sidebar_position: 1
title: "Frequently asked questions"
---

# Frequently asked questions

## Is QuickJS still supported?

No. Native platforms use official static V8; WebGL/WeChat use their platform VM. There is no old-engine fallback.

## Must I embed the package under Packages?

No. Git URL installation and read-only PackageCache are supported. SDKs install in Library; Editor plugins and stable metadata are generated in Assets. See [installation](../guides/install.md).

## Does no Wrap allowlist mean no generation?

No. Lazy binding removes per-type Wrap maintenance, but IL2CPP still needs metadata, closed generics, bridges, and configuration generation.

## Is Node.js embedded?

No. Node builds TypeScript/bundles, and its VS Code debug adapter can attach to Inspector. Neither provides Node standard libraries at runtime.

## Why are long values not bigint by default?

The default is number with possible precision loss. Opt concrete long/ulong slots into BigInt. object does not guess long versus ulong, and arrays do not switch automatically.

## Do out parameters need null placeholders?

No. JS→CLR out consumes no input and returns tuple entries; ref does not join that tuple. C#→JS byref uses call-scoped Opaque instead.

## Can Reset reload XML or execute downloaded source?

Reset does not reload AOT XML. Native loaders can rebuild script contexts within their supported capabilities; HostJs only executes precompiled source variants, without dynamic eval.

## Are WeChat and Tuanjie supported?

Both Unity and Tuanjie support WeChat using the platform VM. Applicable tests run in developer tools; phone execution and upload/release are separate scopes. See [status](../getting-started/project-status.md).

## Is test count platform coverage?

No. Named cases, modules, Smoke, and TS examples are separate counts. 435 named cases do not establish all devices or all ZLua branches are covered.
