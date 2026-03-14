---
title: Window
description: Window decorations, padding, background opacity, and blur.
sidebar:
  order: 5
---

Window settings control the title bar, padding around the terminal grid, and background transparency.

## Window decorations

```toml
[window]
decorations = true
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `decorations` | boolean | `true` | Show the window title bar |

On macOS, hiding decorations removes the title bar but preserves resize handles. On Linux, it removes all window decorations (title bar and borders) — resizing from edges depends on the compositor or window manager.

## Padding

Padding adds space between the window edge and the terminal grid, in logical pixels.

```toml
[window]
padding = 8
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `padding` | integer | `0` | Padding on all sides |
| `padding_x` | integer | `0` | Left + right padding |
| `padding_y` | integer | `0` | Top + bottom padding |
| `padding_left` | integer | `0` | Left padding |
| `padding_right` | integer | `0` | Right padding |
| `padding_top` | integer | `0` | Top padding |
| `padding_bottom` | integer | `0` | Bottom padding |

Padding follows CSS-like specificity — more specific keys override less specific ones. For example, `padding_left` overrides `padding_x`, which overrides `padding`.

```toml
[window]
padding = 4            # all sides: 4px
padding_x = 8          # left + right: 8px (overrides padding for horizontal)
padding_top = 12       # top: 12px (overrides padding for top)
```

## Background

```toml
[background]
opacity = 1.0
blur = 30
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `opacity` | float | `1.0` | Background opacity, `0.0` (transparent) to `1.0` (opaque) |
| `blur` | integer | `30` | Blur radius when opacity is less than 1.0 |

Setting `opacity` below `1.0` enables composited transparency. The `blur` setting activates the system compositor's blur effect behind the window:

- **macOS:** Uses `NSVisualEffectView` for native blur.
- **Linux:** Blur depends on the compositor (e.g. KDE Plasma supports it).

```toml
[background]
opacity = 0.85
blur = 20
```

## CLI flags

| Flag | Description |
|------|-------------|
| `--decorations` / `--no-decorations` | Show/hide window title bar |
| `--padding <int>` | Window padding on all sides |
| `--padding-x <int>` | Left + right padding |
| `--padding-y <int>` | Top + bottom padding |
| `--padding-left <int>` | Left padding |
| `--padding-right <int>` | Right padding |
| `--padding-top <int>` | Top padding |
| `--padding-bottom <int>` | Bottom padding |
| `--background-opacity <float>` | Background opacity |
| `--background-blur <int>` | Blur radius |

## Runtime changes

Background opacity and blur require a restart — they are not [hot-reloadable](/docs/configuration/#hot-reload).
