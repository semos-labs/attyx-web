---
title: Status Bar
description: Configurable status bar with built-in and custom widgets.
sidebar:
  order: 13
---

The status bar sits at the top or bottom of your terminal window, showing useful context at a glance — your working directory, git branch, the time — without leaving the terminal.

It also doubles as a tab strip, displaying all open tabs with clickable titles for quick switching.

## Enabling the status bar

```toml
[statusbar]
enabled = true
position = "bottom"   # "top" or "bottom"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Show the status bar |
| `position` | string | `"bottom"` | `"top"` or `"bottom"` |
| `background` | string | — | Background color (`#RRGGBB`). Omit for default. |
| `background_opacity` | integer | `0` | Background opacity, `0`–`255` |

## Built-in widgets

Widgets are configured as sub-tables under `[statusbar]`. Each widget has a `side` (left or right) and an optional `interval` (refresh rate in seconds, default 5).

### Current working directory

Shows the current directory, optionally truncated.

```toml
[statusbar.cwd]
side = "left"
truncate = 2          # show only the last 2 path components
```

### Git

Shows the current branch name and working tree status — staged, modified, untracked, conflicts, stash count, and line statistics.

```toml
[statusbar.git]
side = "left"
```

The git widget reacts to directory changes automatically — when you `cd` into a different repo, it updates immediately.

#### Customizing icons

Every field in the git widget has a configurable icon:

| Option | Default | Description |
|--------|---------|-------------|
| `icon_branch` | `"⎇ "` | Branch name prefix |
| `icon_hashprefix` | `"#"` | Detached HEAD commit hash prefix |
| `icon_ahead` | `"↑·"` | Commits ahead of remote |
| `icon_behind` | `"↓·"` | Commits behind remote |
| `icon_staged` | `"● "` | Staged changes |
| `icon_modified` | `"✚ "` | Modified files |
| `icon_untracked` | `"… "` | Untracked files |
| `icon_conflict` | `"✖ "` | Merge conflicts |
| `icon_stashed` | `"⚑ "` | Stashed items |
| `icon_clean` | `" ✔"` | Clean working tree |
| `icon_insertions` | `"+"` | Line insertions |
| `icon_deletions` | `"-"` | Line deletions |

#### Customizing colors

Each field can also have a custom color (`#RRGGBB`). When omitted, the theme's ANSI palette is used.

| Option | Description |
|--------|-------------|
| `color_staged` | Staged changes color |
| `color_modified` | Modified files color |
| `color_untracked` | Untracked files color |
| `color_conflict` | Conflicts color |
| `color_stashed` | Stash count color |
| `color_ahead` | Ahead count color |
| `color_behind` | Behind count color |
| `color_clean` | Clean indicator color |
| `color_insertions` | Insertions count color |
| `color_deletions` | Deletions count color |

#### Example

```toml
[statusbar.git]
side = "left"
icon_branch = " "
icon_clean = " ✓"
color_staged = "#a6e3a1"
color_conflict = "#f38ba8"
```

### Time

Displays the current time.

```toml
[statusbar.time]
side = "right"
24h = true            # use 24-hour format
```

## Custom widgets

You can add your own widgets by placing executable scripts in `~/.config/attyx/statusbar/`. Each script becomes a widget whose name matches the filename (without extension).

For example, create `~/.config/attyx/statusbar/battery`:

```bash
#!/bin/bash
pmset -g batt | grep -Eo "\d+%" | head -1
```

Then reference it in your config:

```toml
[statusbar.battery]
side = "right"
interval = 30
```

The script's stdout becomes the widget text. It re-runs every `interval` seconds.

## Widget options

Every widget (built-in or custom) supports these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `side` | string | `"left"` | `"left"` or `"right"` |
| `interval` | integer | `5` | Refresh interval in seconds |

Any additional keys in a widget's table are passed as parameters to the widget. For built-in widgets, these are documented per-widget above (e.g. `truncate` for cwd, `24h` for time).

## Example: full status bar

```toml
[statusbar]
enabled = true
position = "bottom"

[statusbar.cwd]
side = "left"
truncate = 2

[statusbar.git]
side = "left"

[statusbar.time]
side = "right"
24h = true
interval = 1
```
