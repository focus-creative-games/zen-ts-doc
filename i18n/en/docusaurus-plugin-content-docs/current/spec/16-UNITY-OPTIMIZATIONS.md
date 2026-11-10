---
sidebar_position: 16
title: "Unity API optimizations"
---

# Unity API optimizations

Settings.enableUnityOptimizations defaults to true. The implemented optimization follows ZLua and is covered by interop tests.

## Scope

Only three GetComponent overloads declared by GameObject and Component in UnityEngine.CoreModule are included. GetComponentInChildren, GetComponentInParent, and AddComponent are outside this scope.

With the switch off, do not load bundled optimization XML; ordinary names, GTAP/overload competition, and declared return views remain.

## Enabled rules

Load bundled Alias/MarshalAs XML before user paths:

| CLR overload | JS short name |
|---|---|
| GetComponent&lt;T&gt;() | GetComponentT |
| GetComponent(string) | GetComponentN |
| GetComponent(System.Type) | GetComponent |

All three use ActualTypeUserData returns: runtime CLR views preserving identity, null remains null. GetComponentT uses GTAP with System.Type wrappers only.

```javascript
const component = go.GetComponentT(zents.typeof(MyComponent));
```

Full signatures retain CLR method names, not aliases.

## Configuration and validation

Rules apply only to AOT UnityEngine.CoreModule. User XML duplicating the same slot fails; disabling bundled rules does not alter general attribute/XML rules. Reinitialize sessions and regenerate/rebuild Players; no runtime XML reload exists.

Test both switch states, all three forms, actual derived/interface views, null, duplicate aliases, and Mono/IL2CPP consistency. Do not infer optimizations for other Unity APIs.
