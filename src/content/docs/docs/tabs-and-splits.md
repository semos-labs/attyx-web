---
title: Tabs & Splits
description: Multiple tabs and split panes in Attyx.
sidebar:
  order: 11
---

Attyx supports multiple tabs and split panes within each tab, letting you work in several terminals side by side without leaving the window.

## Tabs

### Configuration

```toml
[tabs]
appearance = "builtin"
always_show = false
side = "none"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `appearance` | string | `"builtin"` | Tab bar style |
| `always_show` | boolean | `false` | Show the tab bar even with a single tab |
| `side` | string | `"none"` | Tab bar placement: `"none"` (top), `"left"`, or `"right"` |

### Tab bar styles

| Style | Description |
|-------|-------------|
| `"builtin"` | Overlay tab bar rendered by Attyx, with clickable titles and drag-to-reorder |
| `"native"` | macOS native window tabs (macOS only) |

### Vertical tab bar

By default the tab bar runs horizontally along the top. Set `side = "left"` or `side = "right"` to render it vertically along that edge instead. When a vertical side is set, the tab bar is always visible (independent of the status bar) and reserves up to 10% of the window width.

### Tab keybindings

| Action | macOS | Linux |
|--------|-------|-------|
| New tab | `Cmd+T` | `Ctrl+Shift+T` |
| Close tab | `Cmd+W` | `Ctrl+Shift+W` |
| Next tab | `Ctrl+Tab` | `Ctrl+Tab` |
| Previous tab | `Ctrl+Shift+Tab` | `Ctrl+Shift+Tab` |
| Select tab 1–9 | `Cmd+1`–`Cmd+9` | `Alt+1`–`Alt+9` |
| Move tab left | `Cmd+Ctrl+Shift+Left` | `Ctrl+Alt+Shift+Left` |
| Move tab right | `Cmd+Ctrl+Shift+Right` | `Ctrl+Alt+Shift+Right` |

Up to 16 tabs can be open at once.

## Split panes

Split the current tab into multiple panes, arranged horizontally or vertically.

### Configuration

```toml
[splits]
resize_step = 4

[tabs]
dim_unfocused = true
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `resize_step` | integer | `4` | Number of cells to resize panes by (1–50) |

#### Dim inactive panes

When `dim_unfocused` is enabled, inactive panes are slightly dimmed so it's always clear which pane has focus. This is configured under `[tabs]`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dim_unfocused` | boolean | `false` | Dim inactive split panes to visually distinguish the focused pane |

### Split keybindings

| Action | macOS | Linux |
|--------|-------|-------|
| Split vertically | `Cmd+D` | `Ctrl+Shift+D` |
| Split horizontally | `Cmd+Shift+D` | `Ctrl+Shift+E` |
| Close pane | `Cmd+Shift+W` | `Ctrl+Shift+Q` |
| Focus up | `Ctrl+K` | `Ctrl+K` |
| Focus down | `Ctrl+J` | `Ctrl+J` |
| Focus left | `Ctrl+H` | `Ctrl+H` |
| Focus right | `Ctrl+L` | `Ctrl+L` |
| Resize up | `Cmd+Ctrl+K` | `Ctrl+Alt+K` |
| Resize down | `Cmd+Ctrl+J` | `Ctrl+Alt+J` |
| Resize left | `Cmd+Ctrl+H` | `Ctrl+Alt+H` |
| Resize right | `Cmd+Ctrl+L` | `Ctrl+Alt+L` |
| Grow pane | `Cmd+Ctrl+=` | `Ctrl+Alt+=` |
| Shrink pane | `Cmd+Ctrl+-` | `Ctrl+Alt+-` |
| Rotate layout | `Ctrl+Shift+O` | `Ctrl+Shift+O` |
| Zoom toggle | `Cmd+Shift+Z` | `Ctrl+Shift+Z` |

Up to 8 panes can be open in a single tab. Panes are arranged in a binary tree layout that supports horizontal and vertical splits. You can also resize pane borders by dragging them with the mouse.

### Zoom

Zooming temporarily maximizes the active pane to fill the entire tab. Press the zoom shortcut again to restore the previous layout.

All keybindings can be rebound in the `[keybindings]` table. See the [Keybindings docs](/docs/keybindings/) for details.

## Runtime changes

Tab appearance and split resize step are [hot-reloadable](/docs/configuration/#hot-reload).
