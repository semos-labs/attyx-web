---
title: Themes
description: Built-in themes and custom color schemes in Attyx.
sidebar:
  order: 8
---

Attyx ships with 22 built-in themes and supports custom TOML theme files.

## Setting a theme

```toml
[theme]
name = "catppuccin-mocha"
```

You can also override just the background color without switching themes:

```toml
[theme]
name = "dracula"
background = "#1a1a2e"
```

## Built-in themes

- `default`
- `catppuccin-latte`
- `catppuccin-mocha`
- `dracula`
- `everforest-dark`
- `github-dark`
- `gruvbox-dark`
- `gruvbox-light`
- `iceberg`
- `kanagawa`
- `material`
- `monokai`
- `nord`
- `one-dark`
- `palenight`
- `rose-pine`
- `rose-pine-moon`
- `snazzy`
- `solarized-dark`
- `solarized-light`
- `tokyo-night`
- `tokyo-night-storm`

Use the theme picker overlay to preview themes live before committing to one.

## Custom themes

Place `.toml` files in `~/.config/attyx/themes/`. Each file becomes a theme whose name matches the filename (without extension). For example, `~/.config/attyx/themes/my-theme.toml` registers as `my-theme`.

A theme file has two sections: `[colors]` and `[palette]`. All fields are optional — omitted values fall back to the renderer defaults.

### Colors

The `[colors]` section defines the primary terminal colors:

```toml
[colors]
foreground           = "#f8f8f2"
background           = "#282a36"
cursor               = "#f8f8f2"
cursor_text          = "#282a36"
selection_background = "#44475a"
selection_foreground = "#f8f8f2"
statusbar_background = "#44475a"
```

| Field | Description | Default |
|-------|-------------|---------|
| `foreground` | Default text color | renderer default |
| `background` | Default background color | renderer default |
| `cursor` | Cursor color | foreground color |
| `cursor_text` | Text color drawn under the cursor | background color |
| `selection_background` | Selection highlight background | renderer default |
| `selection_foreground` | Selection highlight text color | cell's foreground color |
| `statusbar_background` | Status bar background color | statusbar config default |

### Palette

The `[palette]` section defines the 16-color ANSI palette using numeric keys `0` through `15`:

```toml
[palette]
0  = "#21222c"    # black
1  = "#ff5555"    # red
2  = "#50fa7b"    # green
3  = "#f1fa8c"    # yellow
4  = "#bd93f9"    # blue
5  = "#ff79c6"    # magenta
6  = "#8be9fd"    # cyan
7  = "#f8f8f2"    # white
8  = "#6272a4"    # bright black
9  = "#ff6e6e"    # bright red
10 = "#69ff94"    # bright green
11 = "#ffffa5"    # bright yellow
12 = "#d6acff"    # bright blue
13 = "#ff92df"    # bright magenta
14 = "#a4ffff"    # bright cyan
15 = "#ffffff"    # bright white
```

Individual palette entries are optional — missing entries use the renderer's built-in palette.

### Color format

All colors are 6-digit hex strings, with or without the `#` prefix:

```toml
foreground = "#f8f8f2"    # with prefix
foreground = "f8f8f2"     # also valid
```

### Minimal theme

Only `foreground` and `background` are needed for a working theme. Everything else has sensible defaults:

```toml
[colors]
foreground = "#dcdcdc"
background = "#1e1e24"
```

### Full example

```toml
# Dracula theme

[colors]
foreground           = "#f8f8f2"
background           = "#282a36"
cursor               = "#f8f8f2"
cursor_text          = "#282a36"
selection_background = "#44475a"
selection_foreground = "#f8f8f2"

[palette]
0  = "#21222c"
1  = "#ff5555"
2  = "#50fa7b"
3  = "#f1fa8c"
4  = "#bd93f9"
5  = "#ff79c6"
6  = "#8be9fd"
7  = "#f8f8f2"
8  = "#6272a4"
9  = "#ff6e6e"
10 = "#69ff94"
11 = "#ffffa5"
12 = "#d6acff"
13 = "#ff92df"
14 = "#a4ffff"
15 = "#ffffff"
```

## Switching themes at runtime

Themes are [hot-reloadable](/docs/configuration/#hot-reload). You can also switch themes via:

- **Theme picker** — browse and preview themes live
- **IPC** — `attyx theme dracula` from the command line
- **Config reload** — change `[theme] name` and press Ctrl+Shift+R
