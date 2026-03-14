---
title: Keybindings
description: Rebind hotkeys and configure keyboard shortcuts in Attyx.
sidebar:
  order: 9
---

All hotkeys in Attyx can be rebound via the `[keybindings]` table in your config file. Changes apply immediately on [hot reload](/docs/configuration/#hot-reload).

## Configuration

```toml
[keybindings]
search_toggle = "ctrl+f"
search_next = "ctrl+g"
search_prev = "ctrl+shift+g"
scroll_page_up = "shift+page_up"
scroll_page_down = "shift+page_down"
scroll_to_top = "shift+home"
scroll_to_bottom = "shift+end"
config_reload = "ctrl+shift+r"
close_window = "ctrl+shift+w"
split_vertical = "ctrl+shift+d"
pane_focus_up = "ctrl+k"
clear_screen = "ctrl+shift+k"
```

## Disabling a keybinding

Bind an action to `"none"` to disable it:

```toml
[keybindings]
debug_toggle = "none"
```

## Key combo syntax

Format: `modifier+key`

**Modifiers:** `ctrl`, `shift`, `alt` (or `option`), `super` (or `cmd`)

**Keys:** `a`–`z`, `0`–`9`, `f1`–`f12`, `enter`, `tab`, `escape`, `backspace`, `delete`, `insert`, `space`, `page_up`, `page_down`, `home`, `end`, `up`, `down`, `left`, `right`

Combine multiple modifiers with `+`:

```
ctrl+shift+r
super+shift+g
alt+enter
```

## Default keybindings

### General

| Action | macOS | Linux |
|---|---|---|
| `config_reload` | `ctrl+shift+r` | `ctrl+shift+r` |
| `command_palette_toggle` | `super+shift+p` | `ctrl+shift+p` |
| `open_config` | `super+,` | `ctrl+,` |
| `clear_screen` | `super+k` | `ctrl+shift+k` |
| `close_window` | `ctrl+shift+w` | `ctrl+shift+w` |

### Search

| Action | macOS | Linux |
|---|---|---|
| `search_toggle` | `super+f` | `ctrl+f` |
| `search_next` | `super+g` | `ctrl+g` |
| `search_prev` | `super+shift+g` | `ctrl+shift+g` |

### Copy / Paste

| Action | macOS | Linux |
|---|---|---|
| `copy` | *(system menu)* | `ctrl+shift+c` |
| `paste` | *(system menu)* | `ctrl+shift+v` |
| `copy_mode` | `ctrl+shift+space` | `ctrl+shift+space` |

### Scrolling

| Action | macOS | Linux |
|---|---|---|
| `scroll_page_up` | `shift+page_up` | `shift+page_up` |
| `scroll_page_down` | `shift+page_down` | `shift+page_down` |
| `scroll_to_top` | `shift+home` | `shift+home` |
| `scroll_to_bottom` | `shift+end` | `shift+end` |

### Tabs

| Action | macOS | Linux |
|---|---|---|
| `tab_new` | `super+t` | `ctrl+shift+t` |
| `tab_close` | `super+w` | `ctrl+shift+w` |
| `tab_next` | `ctrl+tab` | `ctrl+tab` |
| `tab_prev` | `ctrl+shift+tab` | `ctrl+shift+tab` |
| `tab_select_1`–`tab_select_9` | `super+1`–`super+9` | `alt+1`–`alt+9` |
| `tab_next_arrows` | `super+shift+right` | `ctrl+alt+right` |
| `tab_prev_arrows` | `super+shift+left` | `ctrl+alt+left` |
| `tab_move_left` | `super+ctrl+shift+left` | `ctrl+alt+shift+left` |
| `tab_move_right` | `super+ctrl+shift+right` | `ctrl+alt+shift+right` |

### Splits / Panes

| Action | macOS | Linux |
|---|---|---|
| `split_vertical` | `super+d` | `ctrl+shift+d` |
| `split_horizontal` | `super+shift+d` | `ctrl+shift+e` |
| `pane_close` | `super+shift+w` | `ctrl+shift+q` |
| `pane_focus_up` | `ctrl+k` | `ctrl+k` |
| `pane_focus_down` | `ctrl+j` | `ctrl+j` |
| `pane_focus_left` | `ctrl+h` | `ctrl+h` |
| `pane_focus_right` | `ctrl+l` | `ctrl+l` |
| `pane_resize_up` | `super+ctrl+k` | `ctrl+alt+k` |
| `pane_resize_down` | `super+ctrl+j` | `ctrl+alt+j` |
| `pane_resize_left` | `super+ctrl+h` | `ctrl+alt+h` |
| `pane_resize_right` | `super+ctrl+l` | `ctrl+alt+l` |
| `pane_resize_grow` | `super+ctrl+=` | `ctrl+alt+=` |
| `pane_resize_shrink` | `super+ctrl+-` | `ctrl+alt+-` |
| `pane_rotate` | `ctrl+shift+o` | `ctrl+shift+o` |
| `pane_zoom_toggle` | `super+shift+z` | `ctrl+shift+z` |

### Sessions

| Action | macOS | Linux |
|---|---|---|
| `session_create` | `ctrl+shift+n` | `ctrl+shift+n` |
| `session_switcher_toggle` | `ctrl+shift+s` | `ctrl+shift+s` |
| `session_kill` | `ctrl+d` | `ctrl+d` |

### Font Size

| Action | macOS | Linux |
|---|---|---|
| `font_size_increase` | `super+=` | `ctrl+=` |
| `font_size_decrease` | `super+-` | `ctrl+-` |
| `font_size_reset` | `super+0` | `ctrl+0` |
