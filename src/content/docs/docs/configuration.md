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

**Reloads immediately (`[live]`):** font family, font size, cell width, cell height, font fallback, ligatures, theme, theme background, scrollback lines, reflow, agent status, MCP settings, cursor shape, cursor blink, cursor trail, background opacity, background blur, window decorations, scrollbar, padding, option-as-alt, tab always-show, tab side, split resize step, keybindings, sequences, popups, status bar

**Requires restart (`[restart]`):** tab appearance, dim unfocused, sessions, logging, updates, xyron

## Logging

```toml
[logging]
level = "warn"
file = "/tmp/attyx.log"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | string | `"warn"` | `"err"`, `"warn"`, `"info"`, `"debug"`, or `"trace"` |
| `file` | string | — | Append logs to this file (defaults to stderr) |

## Updates

```toml
[updates]
check_updates = true
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `check_updates` | boolean | `true` | Enable automatic update checking |

## Keyboard

```toml
[keyboard]
option_as_alt = true
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `option_as_alt` | boolean or string | `true` | macOS only. How the Option (⌥) key behaves: `true` sends Alt/Meta (ESC-prefixed) sequences, `false` composes accented characters using your keyboard layout, `"left"` / `"right"` makes only that one Option key act as Alt while the other composes |

Arrow-key word navigation (Option+←/→) works regardless of this setting.

## Agent status

```toml
[agent]
status = true
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `status` | boolean | `true` | Detect AI coding agents (Claude Code, Codex, opencode, pi.dev) and show a colored status dot on the tab — green = idle, orange = working, purple = needs input. Set to `false` to disable detection entirely |

See [Agent Workflows](/docs/agent-workflows/) for how status detection works.

## MCP server

While the UI is open, Attyx serves an HTTP [MCP](https://modelcontextprotocol.io) endpoint so MCP clients (e.g. Claude) can drive the terminal — list and create panes and tabs, send keys, read pane output, manage sessions, and check agent status.

```toml
[mcp]
enabled = true
host = "127.0.0.1"
port = 7333
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Serve the HTTP MCP endpoint at `http://<host>:<port>/mcp` while the UI is open |
| `host` | string | `"127.0.0.1"` | Bind address. Keep this on loopback — the tools run arbitrary commands in your terminal, so never expose them to the network |
| `port` | integer | `7333` | HTTP listen port. Set to `0` to disable the HTTP listener while keeping the stdio bridge available |

The `attyx mcp` stdio bridge works regardless of this setting. See [MCP Server](/docs/mcp/) for transports, client setup, and the full tool list.

## Xyron

Xyron shell integration. When enabled and xyron is detected, Attyx replaces the default shell with xyron and renders a block-based UI with bordered command output.

```toml
[xyron]
enabled = false
path = "/usr/local/bin/xyron"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable xyron integration |
| `path` | string | — | Explicit path to the xyron binary. If unset, Attyx searches `PATH` |

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
| `[keyboard]` | [Keyboard](#keyboard) |
| `[agent]` | [Agent status](#agent-status) |
| `[mcp]` | [MCP server](#mcp-server) |
| `[xyron]` | [Xyron](#xyron) |
