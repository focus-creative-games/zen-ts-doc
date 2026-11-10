---
sidebar_position: 13
title: "Functions, delegates, and events"
---

# Functions, delegates, and events

JS functions, CLR delegates, and member closures are distinct. Specify the delegate type and receiver, and manage subscriptions explicitly.

## Convert a function

```javascript
const Action = CSharp['mscorlib']['System.Action'];
const handler = zents.to_delegate(() => console.log('tick'), Action);
```

A concrete delegate parameter can marshal a JS function implicitly. Explicit to_delegate is useful when retaining a stable CLR delegate for event add/remove. Open generic delegate types must first be closed.

## Events

For an object with a Tick event:

```javascript
obj.add_Tick(handler);
// Reuse the same handler when unsubscribing.
obj.remove_Tick(handler);
```

A newly created arrow function is not the original handler. CLR events, delegates, and JS closures can form cross-GC strong-reference cycles; unsubscribe explicitly.

## Member closures

```javascript
const method = obj.Run;
method.call(obj);
```

The receiver is not captured automatically. Struct closures also distinguish ByVal and ByObj domains; mixing them cannot bypass value-copy rules.

## C# entry

GetFunction binds exports using a fixed delegate signature without params expansion. Reset invalidates old-domain delegates. Persistent references do not extend a generation's validity. See the [function specification](../spec/marshal/09-FUNCTION.md).
