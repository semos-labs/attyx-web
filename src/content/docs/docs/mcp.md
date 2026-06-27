---
title: MCP Server
description: Drive Attyx from MCP clients like Claude over stdio or HTTP — list panes, send keys, read output, manage sessions, and track agents.
sidebar:
  order: 22
---

Attyx ships a built-in [Model Context Protocol](https://modelcontextprotocol.io) server, so any MCP client — Claude Desktop, Claude Code, or your own — can drive your terminal: list and create tabs and panes, send keystrokes, read pane output, manage sessions, and check agent status.

Every MCP tool maps to the same IPC command the [`attyx` CLI](/docs/integration/) uses, so anything you can script you can also expose to an agent.

## Transports

Attyx serves MCP two ways. Both drive the **running** Attyx instance, so Attyx must be open.

### stdio

Run the bridge as a subprocess. It speaks newline-delimited JSON-RPC 2.0 over stdin/stdout and forwards each call to your running instance:

```bash
attyx mcp
```

Point a client at it with:

```json
{
  "mcpServers": {
    "attyx": { "command": "attyx", "args": ["mcp"] }
  }
}
```

The stdio bridge works regardless of the `[mcp]` config below — it's owned by the trusted parent process, so there's no auth.

### HTTP

While the UI is open, Attyx also serves a Streamable-HTTP endpoint (POST-only — no SSE) at:

```
http://127.0.0.1:7333/mcp
```

Point an HTTP-capable client at the URL:

```json
{
  "mcpServers": {
    "attyx": { "url": "http://127.0.0.1:7333/mcp" }
  }
}
```

This matches how other local desktop apps expose MCP. Use it when a client can't spawn a subprocess, or when you want a single always-on endpoint.

## Configuration

The HTTP listener is controlled by the `[mcp]` section of your config:

```toml
[mcp]
enabled = true
host = "127.0.0.1"
port = 7333
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Serve the HTTP endpoint at `http://<host>:<port>/mcp` while the UI is open |
| `host` | string | `"127.0.0.1"` | Bind address. Keep this on loopback — the tools run arbitrary commands in your terminal, so never expose them to the network |
| `port` | integer | `7333` | HTTP listen port. Set to `0` to disable the HTTP listener while keeping the stdio bridge available |

These settings hot-reload — see [Configuration](/docs/configuration/#mcp-server).

:::caution
MCP tools run arbitrary commands in your terminal. Keep `host` on loopback (`127.0.0.1`) and never bind it to a public interface.
:::

## Tools

All tools take an optional `session` id to target a specific session (omit for the current one). Pane-scoped tools take an optional `pane` id (omit for the focused pane).

### Inspecting

| Tool | Description |
|------|-------------|
| `list` | List the full session / tab / pane tree |
| `list_tabs` | List tabs in the current (or targeted) session |
| `list_panes` | List panes with their stable IPC ids |
| `list_agents` | List AI agents running in panes with their status and a `usage` object (tokens, cost, context window, model). Returns JSON |
| `get_text` | Capture a pane's visible screen text; with `lines`, capture that many trailing rows from scrollback |

### Input

| Tool | Description |
|------|-------------|
| `send_keys` | Send keystrokes/text to a pane. Supports C-style escapes (`\n`, `\t`, `\x03`) and named keys like `{Enter}` `{Down}` |
| `send_image` | Attach an image to a pane (e.g. hand Claude Code a screenshot). Provide `path` (a file on disk) or `data` (base64 bytes). The path is injected as a bracketed paste; Enter is **not** pressed |
| `focus` | Move keyboard focus between panes (`up`/`down`/`left`/`right`) |
| `scroll` | Scroll the focused pane (`top`/`bottom`/`page_up`/`page_down`) |

### Tabs

| Tool | Description |
|------|-------------|
| `tab_create` | Open a new tab, optionally running a command. With `wait=true`, blocks until it exits and returns the exit code + output |
| `tab_close` | Close a tab (1-based number) or the active tab |
| `tab_select` | Switch to a tab by 1-based index (1–9) |
| `tab_switch` | Switch to the `next` or `prev` tab |
| `tab_move` | Move the active tab `left` or `right` |
| `tab_rename` | Rename a tab (1-based number) or the active tab |

### Panes

| Tool | Description |
|------|-------------|
| `split` | Split the focused pane (`vertical`/`horizontal`), optionally running a command. With `wait=true`, blocks until it exits |
| `split_close` | Close a pane by id, or the focused pane |
| `split_rotate` | Rotate the pane layout |
| `split_zoom` | Toggle zoom (maximize) for a pane |

### Sessions

| Tool | Description |
|------|-------------|
| `session_list` | List all sessions |
| `session_create` | Create a session; with `background=true`, don't switch to it |
| `session_kill` | Kill a session by id |
| `session_switch` | Switch the active window to a session by id |
| `session_rename` | Rename a session (or the current one) |

### Other

| Tool | Description |
|------|-------------|
| `theme_set` | Switch the active color theme by name |
| `config_reload` | Reload the Attyx config from disk |
| `popup` | Open a floating popup pane running a command |

There is no `watch_agents` tool — MCP calls are request/response, so streaming doesn't fit. Poll `list_agents` instead. To stream agent state changes, use the CLI's [`attyx watch agents`](/docs/agent-workflows/).

## See also

> [Claude Code](/docs/claude-code/) — install the Attyx skill and let Claude Code drive your terminal

> [Agent Workflows](/docs/agent-workflows/) — orchestrate multi-pane agent workflows

> [Integration](/docs/integration/) — the `attyx` CLI surface these tools mirror
