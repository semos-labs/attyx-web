---
title: Configuration
description: How Attyx is configured.
sidebar:
  order: 2
---

Attyx is configured via a TOML file at `~/.config/attyx/attyx.toml`. Every setting can also be overridden with CLI flags.

## Config file location

The config file is read from `$XDG_CONFIG_HOME/attyx/attyx.toml`. On most systems this resolves to:

| Platform | Path |
|----------|------|
| macOS / Linux | `~/.config/attyx/attyx.toml` |
| Windows | `%APPDATA%\attyx\attyx.toml` |

Override the path with `--config <path>`, or skip the config file entirely with `--no-config`.

## Precedence

Settings are loaded in three layers, each overriding the previous:

```
Defaults → Config file → CLI flags
```

See the [CLI reference](/docs/cli/) for all available flags.

## Quick start

Copy the example config and edit it:

```bash
mkdir -p ~/.config/attyx
cp /path/to/attyx/config/attyx.toml.example ~/.config/attyx/attyx.toml
```

Or start from scratch — only add the settings you want to change. Anything you leave out uses the default.

## Hot reload

Send `SIGUSR1` or press **Ctrl+Shift+R** to reload the config at runtime.

**Reloads immediately:** cursor shape, cursor blink, cursor trail, scrollback lines, font family, font size, cell width, cell height, status bar settings, tab appearance, dim unfocused, theme, keybindings, splits, popups

**Requires restart:** background opacity, background blur, logging level, logging file, program settings, updates

## Logging

```toml
[logging]
level = "info"
file = "/tmp/attyx.log"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | string | `"info"` | `"err"`, `"warn"`, `"info"`, `"debug"`, or `"trace"` |
| `file` | string | — | Append logs to this file |

## Updates

```toml
[updates]
check_updates = true
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `check_updates` | boolean | `true` | Enable automatic update checking |

## All sections

| Section | Page |
|---------|------|
| `[font]` | [Font](/docs/font/) |
| `[cursor]` | [Cursor](/docs/cursor/) |
| `[window]` / `[background]` | [Window](/docs/window/) |
| `[program]` | [Shell](/docs/shell/) |
| `[scrollback]` / `[reflow]` | [Scrollback](/docs/scrollback/) |
| `[theme]` | [Themes](/docs/themes/) |
| `[keybindings]` | [Keybindings](/docs/keybindings/) |
| `[sequences]` | [Custom Sequences](/docs/custom-sequences/) |
| `[tabs]` / `[splits]` | [Tabs & Splits](/docs/tabs-and-splits/) |
| `[[popup]]` | [Popups](/docs/popups/) |
| `[statusbar]` | [Status Bar](/docs/status-bar/) |
| `[sessions]` | [Sessions](/docs/sessions/) |
