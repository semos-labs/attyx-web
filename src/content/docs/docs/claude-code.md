---
title: Claude Code Skill
description: Give Claude Code native control over your Attyx terminal via the /attyx skill.
sidebar:
  order: 19
---

Attyx ships with a [Claude Code skill](https://docs.anthropic.com/en/docs/claude-code/skills) that gives Claude native control over your terminal — creating splits, sending commands, reading output, and managing sessions, all through the IPC interface.

## What it does

When you invoke `/attyx` in Claude Code, Claude can:

- Create and close tabs and split panes
- Send keystrokes and text to any pane by ID
- Read visible screen content (and scrollback) from any pane
- Manage sessions (create, switch, rename, kill) and route commands to a specific session with `-s`
- Track and watch the status of AI agents running in other panes (`list agents`, `watch agents`)
- Orchestrate multi-pane workflows (e.g. run a server in one pane, test it from another)

The skill gives Claude the full `attyx` CLI vocabulary with awareness of pane targeting, stable IDs, and best practices for reading output reliably.

## Installation

```bash
attyx skill install
```

After installing, restart Claude Code. The skill will appear in the `/` menu.

## Usage

Invoke the skill with `/attyx` followed by a natural language instruction:

```
/attyx open a split with htop
/attyx send "hello" to the other pane
/attyx close the other pane
/attyx what's on screen in the right pane
/attyx create a background session for ~/Projects/api
/attyx list sessions
```

Or just `/attyx` with no arguments — Claude will ask what you'd like to do.

### Examples

**Run a dev server and watch its output:**

```
/attyx open a vertical split running "npm run dev", then read its output once it starts
```

**Multi-pane workflow:**

```
/attyx set up a split with python3 on the right, send it "import json; print(json.dumps({'ok': True}))", and read the result
```

**Session management:**

```
/attyx create a new session for ~/Projects/backend called "api"
```

## How it works

The skill file (`SKILL.md`) is loaded into Claude's context when you invoke `/attyx`. It contains:

- The full list of `attyx` IPC commands (dynamically pulled from `attyx --help`)
- Rules for pane targeting with stable IDs
- Session management documentation
- Best practices (don't close your own pane, use `\r` for Enter, poll for output instead of guessing sleep times)
- Argument interpretation guidelines for natural language

Claude then translates your request into one or more `attyx` CLI commands, executed via the Bash tool.

## Skill file structure

```
skills/claude/attyx/
  SKILL.md     # Skill definition with frontmatter + documentation
  data.zig     # Embeds SKILL.md for Attyx's built-in help system
```

The `SKILL.md` frontmatter defines the skill metadata:

```yaml
---
name: attyx
description: Control the Attyx terminal via IPC — manage splits, send input, read output, track and watch agent status, orchestrate panes.
allowed-tools: Bash
argument-hint: [action] [args...]
---
```

## Tips

- **Always use pane targeting.** The skill teaches Claude to capture pane IDs on creation (`id=$(attyx split v)`) and target panes with `-p "$id"` instead of juggling focus.
- **Long-running commands.** For builds, installs, or anything slow, Claude will poll with `get-text` until the output stabilizes rather than blindly sleeping.
- **Don't close yourself.** The skill warns Claude not to run `attyx split close` without `-p`, which would close the pane Claude is running in.

## Automatic status detection

Separate from the skill, Attyx automatically detects when Claude Code is running in a pane and tracks its state — `idle`, `working`, or `input` (waiting on a permission prompt or question) — shown as a colored status dot on the tab. No setup is required.

This works by merging a small set of lifecycle hooks into Claude Code's `settings.json` (in `~/.claude`, plus any sibling `~/.claude-*` config directories, and honoring `CLAUDE_CONFIG_DIR`). The merge runs once at startup and is non-destructive — your existing settings and hooks are preserved. The injected hooks only emit a status signal and only do so while running inside Attyx, so they're a no-op when you launch Claude Code elsewhere.

The same mechanism covers [Codex](https://github.com/openai/codex) (via `~/.codex/hooks.json`), [opencode](https://opencode.ai) (via a plugin in `~/.config/opencode`), and [pi.dev](https://pi.dev) (via an extension in `~/.pi/agent/extensions`), but only patches them if they're already set up on your machine.

Other panes — and the skill, or any MCP client — can read this status with `attyx list agents` and `attyx watch agents`. See [Agent Workflows](/docs/agent-workflows/) for how to use it.

## MCP server

The skill drives Attyx through the Bash CLI. If you'd rather give a client structured tool calls — Claude Desktop, Claude Code's MCP support, or any other MCP client — Attyx also ships a built-in MCP server over stdio and HTTP. See [MCP Server](/docs/mcp/) for transports, setup, and the full tool list.
