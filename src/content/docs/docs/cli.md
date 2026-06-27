---
title: CLI
description: Attyx command-line flags.
sidebar:
  order: 17
---

All [configuration options](/docs/configuration/) can also be set via CLI flags. Flags override the config file.

```
attyx [command | flags]
```

## Commands

| Command | Description |
|---------|-------------|
| `daemon` | Run the session daemon in the foreground |
| `kill-daemon` | Kill the session daemon and remove its socket |
| `device` | Show device and account info |
| `skill <install\|uninstall>` | Install or remove the Claude Code skill |
| `mcp` | Run the MCP stdio bridge (for MCP clients like Claude) |
| `dashboard [--once]` | Full-screen [agent dashboard](/docs/integration/#agent-dashboard) across all sessions |
| `uninstall` | Remove config, auth tokens, and desktop entry |

Commands are used without `--`. For example: `attyx kill-daemon`.

## Terminal

| Flag | Description |
|------|-------------|
| `--rows <N>` | Terminal rows (default: 24) |
| `--cols <N>` | Terminal columns (default: 80) |
| `-e`, `-c`, `--cmd <command...>` | Override shell command |
| `-d`, `--working-directory <path>` | Set initial working directory |

## Config

| Flag | Description |
|------|-------------|
| `--config <path>` | Load config from a specific file |
| `--no-config` | Skip reading config file from disk |
| `--print-config` | Print merged config and exit |
| `--headless` | Run without a UI, controlled via IPC only |

## Font

| Flag | Description |
|------|-------------|
| `--font-family <string>` | Font family |
| `--font-size <int>` | Font size in points |
| `--cell-width <value>` | Cell width: pixels (e.g. `10`) or percent (e.g. `"110%"`) |
| `--cell-height <value>` | Cell height: pixels (e.g. `20`) or percent (e.g. `"115%"`) |
| `--font-ligatures` / `--no-font-ligatures` | Enable/disable ligatures (default: on) |

## Appearance

| Flag | Description |
|------|-------------|
| `--theme <string>` | Theme name |
| `--background-opacity <float>` | Background opacity 0.0–1.0 |
| `--background-blur <int>` | Blur radius when opacity < 1 |
| `--decorations` / `--no-decorations` | Show/hide window title bar |
| `--scrollbar` / `--no-scrollbar` | Show/hide scrollbar (default: on) |
| `--padding <int>` | Window padding on all sides |
| `--padding-x <int>` | Left + right padding |
| `--padding-y <int>` | Top + bottom padding |
| `--padding-left <int>` | Left padding |
| `--padding-right <int>` | Right padding |
| `--padding-top <int>` | Top padding |
| `--padding-bottom <int>` | Bottom padding |

## Cursor

| Flag | Description |
|------|-------------|
| `--cursor-shape <shape>` | `block`, `beam`, or `underline` |
| `--cursor-blink` / `--no-cursor-blink` | Enable/disable cursor blinking |
| `--cursor-trail` / `--no-cursor-trail` | Enable/disable cursor trail |

## Behavior

| Flag | Description |
|------|-------------|
| `--shell <path>` | Shell program |
| `--scrollback-lines <int>` | Scrollback buffer lines |
| `--reflow` / `--no-reflow` | Enable/disable reflow on resize |
| `--log-level <level>` | `err`, `warn`, `info`, `debug`, `trace` |
| `--log-file <path>` | Append logs to file |

## Help

| Flag | Description |
|------|-------------|
| `--help`, `-h` | Show help |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+Shift+R** | Reload config |
| **Cmd+,** / **Ctrl+,** | Open config file |
| **Cmd+F** / **Ctrl+F** | Open in-terminal search |
| **Cmd+Shift+P** / **Ctrl+Shift+P** | Command palette |
| **Cmd+Shift+A** / **Ctrl+Shift+A** | Agent dashboard overlay |
| **Ctrl+Shift+Space** | Visual mode (copy mode) |
| **Cmd+K** / **Ctrl+Shift+K** | Clear screen and scrollback |
| **Ctrl+Shift+N** | New session |
| **Cmd+Shift+S** / **Ctrl+Shift+S** | Session picker |
| **Cmd+T** / **Ctrl+Shift+T** | New tab |
| **Cmd+W** / **Ctrl+Shift+W** | Close tab |
| **Ctrl+Tab** | Next tab |
| **Ctrl+Shift+Tab** | Previous tab |
| **Cmd+D** / **Ctrl+Shift+D** | Split vertically |
| **Cmd+Shift+D** / **Ctrl+Shift+E** | Split horizontally |
| **Cmd+=** / **Ctrl+=** | Increase font size |
| **Cmd+-** / **Ctrl+-** | Decrease font size |
| **Cmd+0** / **Ctrl+0** | Reset font size |
