---
sidebar_position: 3
title: "Mono callback and exception boundary"
---

# Mono callback and exception boundary

## 1. Current path

Editor uses native V8. Managed calls reside in Runtime/Mono/Engine/V8 and the native gate in engine/v8/V8Mono.cpp. Values, callbacks, and errors must come from the same backend.

## 2. ABI and references

Callbacks use pointer-output return ABI to avoid compiler/Mono differences for 16-byte values returned by value. Receivers/argv are borrowed during the callback; retain explicitly for longer use and keep function pointers/data rooted.

Private failure markers belong to the plugin ABI, not public Value layouts. Do not reinterpret incompatible function pointers or let CLR business code decode V8 payloads.

## 3. Errors and reentry

Managed callbacks catch failures and register controlled error state. After managed return, the native gate sets a JS exception and returns failure. Neither CLR nor engine exceptions may skip cross-ABI cleanup frames.

Nested calls own separate arguments, Opaque scopes, and errors. Success, failure, debug pause, and disconnect must release temporaries/roots correctly. Setting engine errors is not Lua longjmp or arbitrary cross-boundary C++ throw.

## 4. Validation

Cover callbacks, CLR throw/JS catch, nested CLR→JS→CLR, Unicode errors, expired Opaque, Reset, and Domain Reload. Inspector pauses process protocol only, not gameplay; disconnect resumes while retaining active resources until return.

Compile/runtime each ABI separately; Win64 does not establish ARM64/WASM compatibility. See [debugger](04-JS-DEBUGGER.md) and [lifetime](../10-LIFETIME.md).
