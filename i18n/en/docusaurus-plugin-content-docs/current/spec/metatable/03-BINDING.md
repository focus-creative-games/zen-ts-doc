---
sidebar_position: 4
title: "Binding and inheritance"
---

# Binding and inheritance

## 1. Scope

Bind public members only. Separate static, ByVal, and ByObj domains. Constructors belong to the current type and never merge with base constructors/method tables. Abstract/interface/static types remain unconstructible.

## 2. Candidates and accessors

Resolve final name by attribute, valid AOT XML, CLR name; one candidate is direct, multiple dispatch. Alias replaces default names. Different-method alias collisions are allowed; duplicate XML slots fail.

Extensions compete with real instance methods without an instance-first rule. Materialize optional defaults and retain params/out/expanded-slot information. CLR parameter count is not JS arity.

Build legal field/property getters/setters. Readonly has no setter; write-only reads fail. Indexed accessors are methods, not nonindexed property entries. Enum literals are readonly number, not automatic bigint.

## 3. Inheritance and structs

Flatten public members at binding under hiding/override rules. Virtual calls target actual CLR instances; declared views control visibility. Ordinary misses do not promote base members. Lazy exact signatures are the explicit exception and do not change short groups; constructors/cctors/accessors are excluded.

Build separate struct ByVal/ByObj execution entries with correct copy/boxed receivers. ByVal generics close through that side's GTAP, not copied ByObj closures.

## 4. Generics and configuration

GTAP can close open generic direct/dispatch candidates. inflate receives a closed owner/key rather than guessing from a closure. Intern by closedMethod/isStatic/isByVal. Short names freeze, without register_method; internal cache insertion is not registration.

XML is AOT session/build configuration. Players do not parse/register/hot-reload it. Hot-update assemblies use attributes; later assembly loading does not modify frozen bindings.

## 5. Validation

Test hiding/overrides, static separation, struct receiver domains, alias collisions, single-candidate exact signatures, generic signatures, and duplicate configuration on each backend. Old behavior passes do not establish current-platform validation.
