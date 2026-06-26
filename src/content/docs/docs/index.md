---
title: Attyx
description: Attyx is the agent-aware terminal for the agentic era — it tracks AI agent lifecycle and drives panes over IPC, the attyx CLI, and a native MCP server. Written in Zig, under 5 MB.
sidebar:
  label: Overview
  order: 1
---

Attyx is the terminal built for the agentic era — the operator console for AI agents. It's **agent-aware end to end**: it tracks the lifecycle of AI coding agents (Claude Code, Codex, opencode, pi.dev) and paints a status dot on every pane — idle, working, or waiting on you — and it exposes a full IPC layer, the `attyx` CLI, and a native **MCP server** so agents and scripts can spawn, read, and drive panes, and coordinate one another. Underneath it's a fast, GPU-accelerated terminal written in **Zig**: persistent sessions, splits, tabs, popups, and a command palette, all in a single binary under 5 MB.

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

- **Agent-aware** — detects AI agents (Claude Code, Codex, opencode, pi.dev) and shows a per-pane status dot: idle, working, or waiting on you
- **IPC + `attyx` CLI** — scriptable control over splits, input, and screen content so agents and scripts can drive your terminal
- **MCP server** — native Model Context Protocol over stdio and loopback HTTP, exposing the terminal as typed tools to Claude and any MCP client
- **Claude Code skill** — give Claude Code native control of your terminal with `attyx skill install`
- **GPU-accelerated rendering** — Metal on macOS, OpenGL on Linux
- **Sessions** — tmux-style workspace management with a background daemon
- **Deterministic VT-compatible engine** — predictable, reproducible terminal behavior
- **Status bar** — configurable widgets for cwd, git branch, time, and custom scripts
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

> [Agent Workflows](/docs/agent-workflows/) — orchestrate multi-pane AI agent workflows

> [Claude Code Skill](/docs/claude-code/) — give Claude Code native control of your terminal

> [IPC Recipes](/docs/recipes/) — automation scripts and workflow integrations

> [Raw IPC Protocol](/docs/raw-ipc/) — binary protocol reference for custom clients

> [Architecture](/docs/architecture/) — layers, data flow, and design decisions

> [VT Compatibility](/docs/vt-compatibility/) — supported escape sequences

> [Building from Source](/docs/building/) — build, run, and test

