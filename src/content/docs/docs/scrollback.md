---
title: Scrollback
description: Scrollback buffer size and text reflow.
sidebar:
  order: 7
---

Attyx maintains a scrollback buffer that preserves terminal output after it scrolls off the visible screen. You can scroll back through history, search it, and copy text from it.

## Configuration

```toml
[scrollback]
lines = 20000

[reflow]
enabled = true
```

## Scrollback options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lines` | integer | `20000` | Scrollback buffer size in lines. Set to `0` to disable. |

The scrollback buffer is implemented as a bounded ring buffer — when it fills up, the oldest lines are discarded to make room for new ones.

## Reflow

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Reflow text when the terminal is resized |

When reflow is enabled, long lines that were wrapped due to a narrow terminal width will re-wrap when you make the terminal wider. This preserves the logical structure of text across resize events.

When disabled, wrapped lines stay wrapped regardless of terminal size changes.

## Scrolling keybindings

| Action | macOS | Linux |
|--------|-------|-------|
| Scroll page up | `Shift+Page Up` | `Shift+Page Up` |
| Scroll page down | `Shift+Page Down` | `Shift+Page Down` |
| Scroll to top | `Shift+Home` | `Shift+Home` |
| Scroll to bottom | `Shift+End` | `Shift+End` |

These can be rebound in the `[keybindings]` table. See the [Keybindings docs](/docs/keybindings/) for details.

## Searching scrollback

Use the in-terminal search (`Cmd+F` / `Ctrl+F`) to search through scrollback history, or enter [Visual Mode](/docs/visual-mode/) and use `/` or `?` to search forward or backward.

## CLI flags

| Flag | Description |
|------|-------------|
| `--scrollback-lines <int>` | Scrollback buffer size |
| `--reflow` / `--no-reflow` | Enable/disable reflow |

## Runtime changes

Scrollback lines is [hot-reloadable](/docs/configuration/#hot-reload). Increasing the value preserves existing history; decreasing it trims the oldest lines.
