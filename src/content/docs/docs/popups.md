---
title: Popups
description: Floating terminal overlays in Attyx.
sidebar:
  order: 12
---

Popups are floating terminal windows that run a command inside the main Attyx window. Each popup is bound to a hotkey — press it to open, press it again to close. Up to 32 popups can be configured.

## Configuration

Popups use the `[[popup]]` array in your config file:

```toml
[[popup]]
hotkey = "ctrl+shift+g"
command = "lazygit"
width = "80%"
height = "80%"
border = "rounded"
border_color = "#78829a"

[[popup]]
hotkey = "ctrl+shift+t"
command = "htop"
width = "60%"
height = "60%"
border = "heavy"
border_color = "#ff6600"
background_opacity = 0.9
padding = 1
```

## Options

| Option | Default | Description |
|---|---|---|
| `hotkey` | *(required)* | [Key combo](/docs/keybindings/#key-combo-syntax) to toggle the popup |
| `command` | *(required)* | Shell command to run |
| `width` | `"80%"` | Popup width as percentage of terminal |
| `height` | `"80%"` | Popup height as percentage of terminal |
| `border` | `"single"` | Border style: `single`, `double`, `rounded`, `heavy`, or `none` |
| `border_color` | `"#78829a"` | Border foreground color (`#RRGGBB`) |
| `on_return_cmd` | *(none)* | Command to run with the popup's captured stdout when it exits successfully (exit code 0) |
| `inject_alt` | `false` | When true, `on_return_cmd` is injected into the PTY even when an alt screen is active. When false, it runs as a detached process instead. |
| `background_opacity` | *(none)* | Background opacity from `0.0` (transparent) to `1.0` (opaque) |
| `background` | *(theme)* | Background color override (`#RRGGBB`). Empty or omitted = use theme background |
| `padding` | *(none)* | Inner padding on all sides (cells) |
| `padding_x` | *(none)* | Horizontal padding — left and right (cells) |
| `padding_y` | *(none)* | Vertical padding — top and bottom (cells) |
| `padding_top` | *(none)* | Top padding (cells) |
| `padding_bottom` | *(none)* | Bottom padding (cells) |
| `padding_left` | *(none)* | Left padding (cells) |
| `padding_right` | *(none)* | Right padding (cells) |

Padding follows CSS-like specificity: `padding_left` overrides `padding_x`, which overrides `padding`.

## Border styles

| Style | Description |
|---|---|
| `single` | Single-line box drawing characters (default) |
| `double` | Double-line box drawing characters |
| `rounded` | Rounded corners |
| `heavy` | Heavy/thick box drawing characters |
| `none` | No border |

## Examples

Launch lazygit in a large popup:

```toml
[[popup]]
hotkey = "ctrl+shift+g"
command = "lazygit"
width = "80%"
height = "80%"
border = "rounded"
```

Quick system monitor:

```toml
[[popup]]
hotkey = "ctrl+shift+t"
command = "htop"
width = "60%"
height = "60%"
border = "heavy"
border_color = "#ff6600"
```

Session picker with [sesh](https://github.com/joshmedeski/sesh) — the selected session name is passed to `on_return_cmd`:

```toml
[[popup]]
hotkey = "ctrl+shift+s"
command = "sesh list | fzf"
width = "40%"
height = "50%"
border = "rounded"
on_return_cmd = "sesh connect"
```

Styled popup with custom background and padding:

```toml
[[popup]]
hotkey = "ctrl+shift+n"
command = "nvim"
width = "90%"
height = "90%"
border = "rounded"
background = "#1a1a2e"
background_opacity = 0.95
padding_x = 2
padding_y = 1
```
