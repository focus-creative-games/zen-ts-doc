---
sidebar_position: 24
title: "Troubleshooting"
---

# Troubleshooting

Record Unity/Tuanjie version, OS/CPU, backend, SDK fingerprint, and the first failure. Installation succeeding does not prove runtime tests passed.

| Symptom | Check first |
|---|---|
| Missing Editor plugin | Complete matching SDK, generated Assets files/meta, pending restart |
| SDK hash/source mismatch | Rebuild/import adapters; do not alter manifests to bypass validation |
| Read-only Git package | Expected: SDKs go to Library, plugins to Assets |
| Missing type/member | Assembly/full name, visibility, declared view, alias, stripping |
| Overload failure/ambiguity | Slots, undefined/null, strict numeric range; diagnose with full signature |
| Editor works, Player fails | AOT instantiations, bridges, generated tables, linked SDK |
| Delegate fails after Reset | Old-domain delegates expire; reacquire with GetFunction |
| XML edits have no effect | Reinitialize session and regenerate/rebuild; no hot reload |
| bigint mismatch | Only explicit concrete long/ulong BigInt slots accept it |
| HostJs source mismatch | Precompile all source variants and rebuild; no name-only fallback |
| Missing weak-reference APIs | Unsupported host capability; no fake strong-reference fallback |

## Debugger

Enable before domain initialization, check the port, and connect to 127.0.0.1. For unbound breakpoints check emit/maps and source URLs. Waiting for attach or pausing stops the main thread. See the known macOS Domain Reload shutdown limitation in [status](../getting-started/project-status.md).

## WeChat test logging

Localhost logging belongs to validation copies. A missing collector causes requests to fail; it is not a production dependency. Run the complete validation flow or use normal build output. Do not upload test-injected copies.

Report minimal C#/JS repros, target, generation/build steps, the first complete exception, and sanitized logs. Record skips and reasons; do not skip supported interop to hide failures.
