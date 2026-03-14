---
title: Sessions
description: tmux-style workspace management with a background daemon.
sidebar:
  order: 14
---

Sessions bring tmux-style workspace management to Attyx. Each session is a self-contained workspace with its own tabs, panes, and layout — managed by a lightweight background daemon.

## Quick start

1. **Create a session** — press `Ctrl+Shift+N`. The session name defaults to your current directory.
2. **Switch sessions** — press `Ctrl+Shift+S` to open the session picker.
3. Work in multiple sessions, each with its own tabs and layout.
4. Switch back and forth — your layouts are preserved.

## Session picker

The session picker is a fuzzy-filterable overlay that lists all your sessions — both active and recently closed ones. Active sessions show with `●`, while dead/recently closed sessions appear with `○` so you can tell at a glance which are live and which are available to restore.

Sessions are sorted with the current session first, then other active sessions, then recently closed ones at the bottom.

| Key | Action |
|-----|--------|
| Type | Filter sessions by name |
| `Up` / `Down` | Navigate the list |
| `Enter` | Switch to the selected session (or restore a recent one) |
| `Ctrl+R` | Rename the selected session |
| `Ctrl+X` | Kill the selected session (with confirmation) |
| `Ctrl+D` | Switch to default session |
| `Ctrl+U` | Clear filter |
| `Ctrl+W` | Delete word backward |
| `Ctrl+A` | Jump to start of filter |
| `Ctrl+E` | Jump to end of filter |
| `Ctrl+K` | Kill to end of line |
| `Escape` | Close the picker |

## Configuration

```toml
[sessions]
enabled = true
```

You can also customize the icons used in the session picker:

```toml
[sessions]
enabled = true
icon_filter = ">"
icon_session = ""
icon_new = "+"
icon_active = "●"
icon_recent = "○"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable session support |
| `icon_filter` | string | `">"` | Prompt icon in the filter input |
| `icon_session` | string | `""` | Icon next to session names |
| `icon_new` | string | `"+"` | Icon for the "new session" entry |
| `icon_active` | string | `"●"` | Icon for the currently active session |
| `icon_recent` | string | `"○"` | Icon for inactive sessions |

## The session daemon

Sessions are managed by a lightweight background daemon that Attyx starts automatically when you create your first session. The daemon holds your session state so that tabs and layouts survive window closes.

### Killing the daemon

If you need to stop the daemon manually — for example to reset all sessions — use the CLI:

```bash
attyx kill-daemon
```

This sends `SIGTERM` to the daemon process and removes its socket file (`~/.config/attyx/sessions.sock`). The next time you create a session, a new daemon starts automatically.

### Running the daemon manually

You normally don't need to do this, but for debugging you can start the daemon in the foreground:

```bash
attyx daemon
```

## Keybindings

| Action | macOS | Linux |
|--------|-------|-------|
| New session | `Cmd+Shift+N` | `Ctrl+Shift+N` |
| Session picker | `Cmd+Shift+S` | `Ctrl+Shift+S` |

These can be rebound in the `[keybindings]` table:

```toml
[keybindings]
session_new = "ctrl+shift+n"
session_picker = "ctrl+shift+s"
```
