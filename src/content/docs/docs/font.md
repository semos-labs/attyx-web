---
title: Font
description: Font family, size, cell dimensions, fallbacks, and ligatures.
sidebar:
  order: 3
---

Attyx uses a monospace font for rendering the terminal grid. Font settings control the typeface, size, cell dimensions, fallback chains, and ligature support.

## Configuration

```toml
[font]
family = "JetBrains Mono"
size = 14
cell_width = "100%"
cell_height = "100%"
fallback = ["Symbols Nerd Font Mono", "Noto Color Emoji"]
ligatures = true
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `family` | string | `"JetBrains Mono"` | Font family name |
| `size` | integer | `14` | Font size in points |
| `cell_width` | string or int | `"100%"` | Grid cell width |
| `cell_height` | string or int | `"100%"` | Grid cell height |
| `fallback` | string[] | `[]` | Fallback font families, tried in order |
| `ligatures` | boolean | `true` | Enable programming ligatures (OpenType `calt` feature) |

## Cell dimensions

Cell width and height control the size of each character cell in the terminal grid. They accept three formats:

| Format | Example | Description |
|--------|---------|-------------|
| `"N%"` | `"110%"` | Percentage of the font-derived default |
| `N` | `10` | Fixed pixel value |
| `0` | `0` | Auto — use the font-derived default |

The default is `"100%"` (equivalent to auto). Increasing `cell_height` adds line spacing. Increasing `cell_width` adds character spacing.

```toml
[font]
cell_width = "100%"    # default character spacing
cell_height = "120%"   # 20% extra line spacing
```

## Fallback fonts

When a character isn't found in the primary font, Attyx tries each fallback family in order. This is useful for Nerd Font icons, emoji, and CJK characters.

```toml
[font]
family = "JetBrains Mono"
fallback = ["Symbols Nerd Font Mono", "Noto Color Emoji"]
```

## Ligatures

Programming ligatures combine sequences like `=>`, `->`, `!=`, and `<=` into single glyphs. Attyx enables ligatures by default via the OpenType `calt` (contextual alternates) feature.

To disable ligatures:

```toml
[font]
ligatures = false
```

## CLI flags

Font settings can also be set via CLI flags:

| Flag | Description |
|------|-------------|
| `--font-family <string>` | Font family |
| `--font-size <int>` | Font size in points |
| `--cell-width <value>` | Cell width: pixels or percent |
| `--cell-height <value>` | Cell height: pixels or percent |

## Runtime changes

Font family, size, cell dimensions, and ligature settings are [hot-reloadable](/docs/configuration/#hot-reload). Font size can also be adjusted on the fly with keyboard shortcuts:

| Action | macOS | Linux |
|--------|-------|-------|
| Increase font size | `Cmd+=` | `Ctrl+=` |
| Decrease font size | `Cmd+-` | `Ctrl+-` |
| Reset font size | `Cmd+0` | `Ctrl+0` |
