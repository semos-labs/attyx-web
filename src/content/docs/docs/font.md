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
cell_width = 0
cell_height = 0
fallback = ["Noto Color Emoji", "Noto Sans CJK"]
ligatures = true
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `family` | string | `"JetBrains Mono"` | Font family name |
| `size` | integer | `14` | Font size in points |
| `cell_width` | int or string | `0` (auto) | Grid cell width |
| `cell_height` | int or string | `0` (auto) | Grid cell height |
| `fallback` | string[] | none | Fallback font families, tried in order |
| `ligatures` | boolean | `true` | Enable programming ligatures (OpenType `calt` feature) |

## Cell dimensions

Cell width and height control the size of each character cell in the terminal grid. They accept three formats:

| Format | Example | Description |
|--------|---------|-------------|
| `0` or `"auto"` | `0` | Auto — derive from the font's metrics (default) |
| `N` | `10` | Fixed value in points |
| `"N%"` | `"110%"` | Percentage of the font-derived dimension |

The default is `0` (auto). Increasing `cell_height` adds line spacing. Increasing `cell_width` adds character spacing.

```toml
[font]
cell_width = 0         # auto: derive from font metrics
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
