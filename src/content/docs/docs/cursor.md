---
title: Cursor
description: Cursor shape, blinking, and trail effect.
sidebar:
  order: 4
---

The cursor section controls the appearance and behavior of the terminal cursor.

## Configuration

```toml
[cursor]
shape = "block"
blink = true
trail = false
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shape` | string | `"block"` | Cursor shape |
| `blink` | boolean | `true` | Enable cursor blinking |
| `trail` | boolean | `false` | Enable cursor trail effect |

## Cursor shapes

| Shape | Description |
|-------|-------------|
| `"block"` | Filled rectangle covering the entire cell |
| `"beam"` | Thin vertical line at the left edge of the cell |
| `"underline"` | Thin horizontal line at the bottom of the cell |

```toml
[cursor]
shape = "beam"
```

## Cursor trail

The cursor trail adds a smooth animation effect when the cursor moves. When enabled, the previous cursor position fades out as the cursor reaches its new position.

```toml
[cursor]
trail = true
```

## CLI flags

| Flag | Description |
|------|-------------|
| `--cursor-shape <shape>` | `block`, `beam`, or `underline` |
| `--cursor-blink` / `--no-cursor-blink` | Enable/disable blinking |
| `--cursor-trail` / `--no-cursor-trail` | Enable/disable trail |

## Runtime changes

All cursor settings are [hot-reloadable](/docs/configuration/#hot-reload).

Programs running inside the terminal can also change the cursor shape using the DECSCUSR escape sequence. When the program exits or resets, the cursor reverts to your configured shape.
