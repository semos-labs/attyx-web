---
title: Architecture
description: Attyx's layered architecture — data flow, layer separation, and design principles.
sidebar:
  order: 8
---

## Data Flow

```
Raw bytes → Parser → Action → State.apply() → Grid
```

The **Parser** converts raw bytes into typed **Actions**. The **TerminalState** applies actions to the **Grid**. The **Engine** glues them together with a single `feed(bytes)` API.

The parser never modifies state directly. The renderer never influences parsing.

## Layers

| Layer | Description |
|-------|-------------|
| **Terminal engine** (`src/term/`) | Pure, deterministic core — parser, state, grid |
| **Config** (`src/config/`) | TOML config loading and CLI parsing |
| **App** (`src/app/`) | PTY bridge and OS integration |
| **Renderer** (`src/render/`) | GPU + font rendering (Metal / OpenGL) |
| **Headless** (`src/headless/`) | Test harness and golden snapshot tests |

## Determinism

The terminal engine is fully deterministic — given the same byte stream, it always produces the same grid state. `src/term/` has no dependencies on PTY, windowing, rendering, clipboard, or platform APIs.

This means the entire engine is testable without a GPU or a window. Feed it bytes, check the grid.

## Threading

Two-thread architecture with no locks:

- **PTY thread** (Zig) — polls the PTY fd, reads bytes, feeds them through the engine, fills a shared cell buffer.
- **Main thread** (platform) — event loop, keyboard/mouse input, draws frames at vsync.

The cell buffer uses a seqlock for synchronization. Cursor position, mode flags, and viewport offset are volatile globals. No mutexes.

## Platform Renderers

| Platform | Window | GPU | Fonts | IME |
|----------|--------|-----|-------|-----|
| macOS | Cocoa + MTKView | Metal | Core Text | NSTextInputClient |
| Linux | GLFW | OpenGL 3.3 | FreeType + Fontconfig | GLFW char callback |

Both platforms share the same Zig core and C bridge (`bridge.h`). The bridge defines the `AttyxCell` layout and functions for communication between Zig and the platform layer.

## C Bridge

The bridge (`src/app/bridge.h`) is the interface between Zig and the platform renderers. Key pieces:

- **`AttyxCell`** — per-cell struct with character, colors, flags, and hyperlink ID
- **Seqlock** — `attyx_begin_cell_update()` / `attyx_end_cell_update()` for torn-read detection
- **Dirty bitset** — 256-bit row-level damage tracking (`attyx_set_dirty`)
- **Volatile globals** — cursor position, mode flags, viewport offset, IME state, selection bounds

## Damage Tracking

256-bit dirty bitset (4 × `u64`). The state machine marks rows dirty as it processes actions. The renderer only redraws dirty rows, then clears the bitset.
