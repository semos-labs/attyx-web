---
title: Building from Source
description: Build, run, and test Attyx.
sidebar:
  order: 10
---

## Build

```bash
zig build              # Build
zig build run          # Launch terminal
zig build test         # Run all tests
```

## Launch with Options

```bash
zig build run -- --rows 30 --cols 100
zig build run -- --cmd /bin/zsh
zig build run -- --cell-width 110%
zig build run -- --font-size 16
```

## Test Summary

```bash
zig build test --summary all
```
