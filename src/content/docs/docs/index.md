---
title: Attyx
description: A fast, GPU-accelerated terminal environment with built-in sessions, splits, and more.
sidebar:
  label: Overview
  order: 1
---

Attyx is a fast, GPU-accelerated terminal environment written in **Zig**. Persistent sessions, splits, tabs, popups, and GPU rendering — everything you need in a single binary.

## Install

### Homebrew (macOS)

```bash
brew install semos-labs/tap/attyx --cask
```

### Homebrew (Linux x86_64)

```bash
brew install semos-labs/tap/attyx
```

On Linux, Attyx installs as a desktop application. It should appear in your app launcher automatically. If it doesn't, log out and back in to refresh the desktop entry cache.

### Build from source

Requires **Zig 0.15.2+**.

```bash
zig build run
```

## Configuration

Attyx is configured via `~/.config/attyx/attyx.toml`. See the [configuration docs](/docs/configuration/) for all options, or check the included [`attyx.toml.example`](https://github.com/semos-labs/attyx/blob/main/config/attyx.toml.example) for a quick-start template.

## Features

- **Deterministic VT-compatible engine** — predictable, reproducible terminal behavior
- **GPU-accelerated rendering** — Metal on macOS, OpenGL on Linux
- **Status bar** — configurable widgets for cwd, git branch, time, and custom scripts
- **Sessions** — tmux-style workspace management with a background daemon
- **Visual mode** — Vim-inspired keyboard-driven text selection with character, line, and block modes
- **Command palette** — searchable list of all actions with `Cmd+Shift+P` / `Ctrl+Shift+P`
- **Native macOS tabs** — system window tabs alongside the built-in overlay tab bar
- **Full SGR support** — 16, 256, and 24-bit true color
- **Scrollback buffer** — configurable size with efficient memory usage
- **Mouse support** — X10 and SGR mouse encoding, text selection
- **In-terminal search** — incremental search with smart-case matching
- **TOML + CLI configuration** — human-readable config with hot reload
- **Cross-platform** — macOS and Linux
- **Unicode support** — proper wide-character handling
- **Alternate screen buffer** — full support for TUI applications
- **Hyperlinks** — OSC 8 clickable URLs in terminal output
- **IME support** — input method editor for CJK and other languages
- **Bracketed paste mode** — safe pasting with shell awareness
- **Kitty graphics protocol** — display images and rich visual content in the terminal
- **Kitty keyboard protocol** — unambiguous key reporting with modifier keys, key release events, and full disambiguation
- **Background transparency + blur** — opacity control with blur effects
- **Reflow on resize** — preserves text wrapping when terminal size changes
- **Scroll regions** — DECSTBM top/bottom margins for scrolling areas
- **Synchronized output** — deferred rendering for smooth TUI updates
- **Session logging** — bounded ring buffer of session events
- **Cursor trail** — optional cursor trail effect

## Next Steps

> [Configuration](/docs/configuration/) — TOML config file and hot reload

> [Font](/docs/font/) — font family, size, cell dimensions, and ligatures

> [Cursor](/docs/cursor/) — cursor shape, blinking, and trail effect

> [Window](/docs/window/) — decorations, padding, and background transparency

> [Shell](/docs/shell/) — shell program, arguments, and working directory

> [Scrollback](/docs/scrollback/) — scrollback buffer and text reflow

> [Themes](/docs/themes/) — built-in and custom color schemes

> [Keybindings](/docs/keybindings/) — rebind hotkeys and keyboard shortcuts

> [Custom Sequences](/docs/custom-sequences/) — bind keys to raw escape sequences

> [Tabs & Splits](/docs/tabs-and-splits/) — multiple tabs and split panes

> [Popups](/docs/popups/) — floating terminal overlays

> [Status Bar](/docs/status-bar/) — configurable widgets and custom scripts

> [Sessions](/docs/sessions/) — tmux-style workspace management

> [Visual Mode](/docs/visual-mode/) — keyboard-driven text selection

> [Command Palette](/docs/command-palette/) — searchable action list

> [CLI](/docs/cli/) — command-line flags

> [Integration](/docs/integration/) — control Attyx from scripts and AI agents via IPC

> [Architecture](/docs/architecture/) — layers, data flow, and design decisions

> [VT Compatibility](/docs/vt-compatibility/) — supported escape sequences

> [Building from Source](/docs/building/) — build, run, and test

## Alpha

Attyx is currently in alpha. Expect breaking changes as we iterate toward a stable release.
