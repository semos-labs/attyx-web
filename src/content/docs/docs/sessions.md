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

This sends `SIGTERM` to the daemon process and removes its socket file (`~/.local/state/attyx/sessions.sock`, or `$XDG_STATE_HOME/attyx/sessions.sock` if set). The next time you create a session, a new daemon starts automatically.

### Running the daemon manually

You normally don't need to do this, but for debugging you can start the daemon in the foreground:

```bash
attyx daemon
```

## Managing sessions from the CLI

Sessions can also be created and controlled from the command line, which is how scripts and AI agents drive multi-session workflows. These commands talk to the daemon, so they work whether or not a window is attached.

```bash
attyx session create                       # create and switch to a new session
attyx session create ~/Projects/api        # name derived from the path ("api")
attyx session create ~/Projects/api "dev"  # explicit name
attyx session create ~/Projects/api -b     # create in the background (don't switch)
attyx session list                         # list all sessions
attyx session switch 2                     # switch to session 2 by id
attyx session rename "new name"            # rename the current session
attyx session rename 1 "new name"          # rename session 1
attyx session kill 3                       # kill session 3
```

When you create a background session, the command prints the new session's id, so you can capture it and target the session later:

```bash
sid=$(attyx session create ~/Projects/api -b)
```

Any IPC command can be routed to a specific session with `-s` / `--session <id>`, regardless of which session a window is currently showing:

```bash
attyx -s 2 tab create                      # create a tab in session 2
attyx -s 2 list                            # list session 2's tabs and panes
attyx -s 2 send-keys -p 5 "ls{Enter}"      # send to pane 5 in session 2
```

See [Agent Workflows](/docs/agent-workflows/) for how agents use background sessions and per-session targeting.

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
