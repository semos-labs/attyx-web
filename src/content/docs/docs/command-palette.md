---
title: Command Palette
description: Searchable list of all available actions.
sidebar:
  order: 16
---

The command palette is a searchable overlay that lists every available action in Attyx.

## Opening the palette

| Platform | Shortcut |
|----------|----------|
| macOS | `Cmd+Shift+P` |
| Linux | `Ctrl+Shift+P` |

## Usage

Start typing to filter commands by name or description. Each entry shows its keyboard shortcut, so you can learn the bindings as you go.

| Key | Action |
|-----|--------|
| Type | Filter commands |
| `Up` / `Down` | Navigate the list |
| `Enter` | Execute the selected command |
| `Escape` | Dismiss the palette |

The palette includes every action that can be triggered by a keybinding — tab management, session controls, search, config reload, and more.

## Keybindings

The shortcut to open the command palette can be rebound:

```toml
[keybindings]
command_palette = "ctrl+shift+p"
```
