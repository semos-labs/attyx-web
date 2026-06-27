---
title: Integration
description: Control Attyx from scripts, AI agents, and external tools via IPC.
sidebar:
  order: 18
---

Attyx exposes a full IPC interface over sockets. Scripts, AI agents, and external tools can create tabs, split panes, send keystrokes, read screen content, and more — all from the command line.

## How it works

Every running Attyx instance listens on a socket:

| Platform | Path |
|----------|------|
| macOS / Linux | `~/.local/state/attyx/ctl-<pid>.sock` (Unix domain socket) |

The `attyx` binary doubles as both the terminal and the IPC client. When you run a subcommand like `attyx tab create`, it connects to the socket of the most recently active instance and sends the command.

## Global options

All IPC commands accept these flags:

| Flag | Description |
|------|-------------|
| `--target <pid>` | Send to a specific Attyx instance by PID |
| `-s`, `--session <id>` | Route the command to a specific session |
| `--json` | Output in JSON format for programmatic use |
| `--help`, `-h` | Show help for any command |

## Pane targeting

Every pane has a **stable numeric ID** that never changes once assigned. IDs are monotonically increasing integers (1, 2, 3, ...) — they don't get reused when other panes close. Use `attyx list` to see them.

Almost all commands accept `--pane` (`-p`) to target a specific pane without changing focus:

```bash
attyx send-keys -p 3 "ls -la\n"      # send to pane 3
attyx get-text -p 3                   # read from pane 3
attyx split close -p 5               # close pane 5
attyx split zoom -p 5                # toggle zoom on pane 5
attyx split rotate -p 3              # rotate splits in pane 3's tab
```

Tab commands accept a positional tab number instead:

```bash
attyx tab close 3                     # close tab 3
attyx tab rename 2 "build logs"       # rename tab 2
```

### Tracking new pane IDs

When you create a tab or split, the command returns the new pane's ID:

```bash
id=$(attyx tab create)              # returns e.g. "4"
id=$(attyx split v --cmd htop)      # returns e.g. "5"
```

Capture this output to target the pane later without guessing:

```bash
id=$(attyx split v --cmd python3)
attyx send-keys -p "$id" "print('hello')\r"
attyx get-text -p "$id"
attyx split close -p "$id"
```

### Session-targeted commands

Use `-s`/`--session <id>` to route any command to a specific session:

```bash
attyx -s 2 tab create                # create tab in session 2
attyx -s 2 send-keys -p 3 "ls\n"    # send to pane 3 in session 2
attyx -s 2 get-text -p 5            # read from pane 5 in session 2
attyx -s 2 list                     # list tabs/panes in session 2
```

When `-s` is omitted, commands target the currently attached session. With `-s`, most commands (creating/closing tabs and splits, sending keys, reading text, listing, scrolling, watching agents) route directly through the daemon, so they work even when no window is attached to that session — useful for driving background agents in their own session.

## Tabs

```bash
attyx tab create                         # new shell tab
attyx tab create --cmd htop              # new tab running htop
attyx tab create --cmd "make test" --wait # wait for exit code
attyx tab close                          # close active tab
attyx tab close 3                        # close tab 3
attyx tab next                           # switch to next tab
attyx tab prev                           # switch to previous tab
attyx tab select 3                       # jump to tab 3 (1-indexed)
attyx tab move left                      # reorder tab left
attyx tab move right                     # reorder tab right
attyx tab rename "build logs"            # set active tab title
attyx tab rename 2 "build logs"          # set tab 2 title
```

### Options for `tab create`

| Option | Description |
|--------|-------------|
| `--cmd <command>` | Run a command instead of a bare shell. Runs inside a full interactive shell with your PATH and config. The shell stays open after the command exits. |
| `--wait`, `-w` | Wait for the command to exit and return its exit code. Requires `--cmd`. |

## Splits

```bash
attyx split vertical                     # new pane to the right
attyx split horizontal                   # new pane below
attyx split v --cmd claude               # vertical split running claude
attyx split h --cmd htop --wait          # horizontal split, wait for exit
attyx split close                        # close focused pane
attyx split close -p 3                   # close pane 3 (no focus change)
attyx split rotate                       # rotate layout in active tab
attyx split rotate -p 3                  # rotate layout in pane 3's tab
attyx split zoom                         # toggle zoom on focused pane
attyx split zoom -p 5                    # toggle zoom on pane 5
```

`v` and `h` are aliases for `vertical` and `horizontal`. The `--cmd` and `--wait` options work the same as `tab create`.

## Focus

Move focus between panes. Focus determines which pane receives input from `send-keys` and `send-text`.

```bash
attyx focus up
attyx focus down
attyx focus left
attyx focus right
```

## Sending input

### send-keys

Send keystrokes to a pane with C-style escape sequence support. Targets the focused pane by default, or use `-p` to target a specific pane.

```bash
attyx send-keys "ls -la\n"              # type ls -la and press Enter
attyx send-keys -p 3 "ls\n"            # send to pane 3 (no focus change)
attyx send-keys "\x03"                  # Ctrl-C (interrupt)
attyx send-keys -p 5 "\x03"            # Ctrl-C to pane 5
attyx send-keys "\x04"                  # Ctrl-D (EOF)
attyx send-keys "\x1b"                  # Escape
attyx send-keys "\x1b[A\n"             # Arrow up then Enter
attyx send-keys "q"                     # press q (e.g. quit less)
attyx send-keys "y\n"                   # confirm a prompt
```

#### Options for `send-keys`

| Option | Description |
|--------|-------------|
| `-p`, `--pane <id>` | Target a specific pane by ID |
| `--wait-stable [ms]` | After sending, poll the pane until its output stabilizes, then print the final screen text to stdout. Optional stable window in milliseconds (default `300`, max timeout 30s). |

#### Escape sequences

| Sequence | Key |
|----------|-----|
| `\n` | Enter / newline |
| `\t` | Tab |
| `\x03` | Ctrl-C |
| `\x04` | Ctrl-D |
| `\x1a` | Ctrl-Z |
| `\x1b` | Escape |
| `\x1b[A` | Arrow up |
| `\x1b[B` | Arrow down |
| `\x1b[C` | Arrow right |
| `\x1b[D` | Arrow left |
| `\x7f` | Backspace |

#### Named keys

You can also use named key tokens in curly braces:

```bash
attyx send-keys "{Up}{Enter}"             # arrow up then Enter
attyx send-keys "{Ctrl-c}"                # Ctrl-C
attyx send-keys "{Shift-Tab}"             # Shift-Tab
attyx send-keys "{Ctrl-Shift-Up}"         # combined modifiers
attyx send-keys "{F1}"                    # function key
```

| Token | Key |
|-------|-----|
| `{Up}`, `{Down}`, `{Left}`, `{Right}` | Arrow keys |
| `{Home}`, `{End}`, `{PgUp}`, `{PgDn}` | Navigation |
| `{Enter}`, `{Tab}`, `{Escape}` | Common keys |
| `{Backspace}`, `{Delete}`, `{Insert}` | Editing keys |
| `{F1}`–`{F12}` | Function keys |
| `{Ctrl-c}`, `{Alt-a}`, `{Shift-Tab}` | Modifier combos |

### send-text

Send raw text to a pane. Supports the same escape sequences as `send-keys`.

```bash
attyx send-text "hello"                  # write "hello" (no newline)
attyx send-text -p 3 "hello"            # write to pane 3
attyx send-text "echo hello\n"           # write "echo hello" + Enter
```

### send-image

Attach an image file to a pane as if it were dragged or pasted in — handy for handing an agent a screenshot from a script. The file path is injected as a bracketed paste; Enter is **not** pressed, so the agent receives the reference without submitting.

```bash
attyx send-image ~/shot.png              # attach to the focused pane
attyx send-image /tmp/diagram.png -p 3  # attach to pane 3
```

The path must already exist on disk. (Over MCP, the `send_image` tool also accepts base64 `data` for images not on disk.)

## Reading screen content

Read the visible text from a pane (focused pane by default).

```bash
attyx get-text                           # plain text, one line per row
attyx get-text -p 3                     # read from pane 3
attyx get-text --json                    # { "lines": ["row1", "row2", ...] }
attyx get-text -p 5 --json             # pane 5 as JSON
```

Trailing whitespace is trimmed per row. Empty trailing rows are omitted.

#### Options for `get-text`

| Option | Description |
|--------|-------------|
| `-p`, `--pane <id>` | Read from a specific pane by ID |
| `--lines`, `-n <N>` | Return the last `N` rows from scrollback + visible screen, like `tail -N`, instead of just the visible screen. Capped at the pane's scrollback depth. |

```bash
attyx get-text -n 100                    # last 100 rows (scrollback + screen)
attyx get-text -p 5 -n 500              # last 500 rows from pane 5
```

## Querying state

```bash
attyx list                               # full tab/pane tree
attyx list tabs                          # tab names and indices
attyx list splits                        # panes in active tab
attyx list sessions                      # daemon sessions
attyx list agents                        # panes running an AI agent
attyx list --json                        # any of the above as JSON
```

`panes` is an alias for `splits`.

Plain-text output for `tabs`/`splits`/`sessions` is tab-separated, one entry per line, with active items marked `*` in the third column. `list agents` instead prints an aligned, human-readable table (see [Tracking agents](#tracking-agents)). Use `--json` for output that's easier to parse.

## Tracking agents

Attyx detects when a pane is running an AI agent (Claude Code, Codex, opencode, pi.dev) and tracks its status — `idle`, `working`, or `input` (waiting on a prompt) — along with token, cost, and context-window **usage**. This lets a supervisor script know which panes are busy, which are blocked on input, which have gone quiet, and how much each is spending.

```bash
attyx list agents                        # all panes running an agent
attyx list agents -p 3                   # just pane 3's agent
attyx list agents --json                 # as a JSON array
attyx list agents -s 2                   # agents in session 2
```

Without `--json`, `list agents` prints an aligned, human-readable table — tokens humanized (`1.2M`), context as `used/max`, and `-` for unknown values:

```
PANE  SESSION  STATE    MODEL      IN     OUT    CTX        COST    MESSAGE
3     1        working  opus-4.8   1.2M   320K   82K/200K   $0.42   Editing client.zig
8     1        input    opus-4.8   -      -      -          -       Approve running tests?
```

The table is for humans and its layout may change — **parse `--json`**, which returns an array of records:

```json
[{"pane_id":3,"tab_id":3,"session":1,"pid":4821,"state":"working","message":"Editing client.zig",
  "usage":{"input_tokens":1200000,"output_tokens":320000,"context_used":82000,"context_max":200000,
           "cost_usd":0.42,"cost_is_estimate":false,"model":"opus-4.8"}}]
```

Each record carries these fields:

| Field | Description |
|-------|-------------|
| `pane_id` | Stable pane ID of the agent's pane |
| `tab_id` | The tab's stable handle (its focused pane's ID, the same `pane:N` shown by `attyx list`). Equals `pane_id` for a single-pane tab. |
| `session` | Session ID the pane belongs to |
| `pid` | The agent's foreground process ID (`0` = unknown, e.g. daemon-backed panes) |
| `state` | `idle`, `working`, or `input` |
| `message` | The agent's latest status preview (may be empty) |
| `usage` | Token / cost / context object (below). Possibly `{}` before the agent reports anything |

The `usage` object only includes **known** fields — an absent field means *unknown*, never zero (so don't treat a missing `cost_usd` as free):

| `usage` field | Description |
|---------------|-------------|
| `input_tokens`, `output_tokens` | Tokens sent / generated (cumulative for the session) |
| `cache_read_tokens`, `cache_write_tokens`, `reasoning_tokens` | Cache and reasoning tokens, when the agent reports them |
| `context_used`, `context_max` | Current context-window usage and size |
| `cost_usd` | Session cost in USD |
| `cost_is_estimate` | `true` when Attyx computed the cost from a built-in price table because the agent didn't report one (Codex) |
| `model` | Model identifier the agent reported |

Coverage varies by agent: Claude, opencode, and pi.dev report cost directly; Codex is estimated; some builds report no usage at all. Usage tracking is on by default and can be turned off with `[agent] telemetry = false` — see [Configuration](/docs/configuration/).

By default `list agents` scopes to the attached/local session. Add `-s`/`--session <id>` to list any session's agents directly from the daemon — no window needs to be attached to that session.

## Watching agents

`attyx watch agents` is the live counterpart of `list agents` — it opens a long-lived connection, emits the current agents as a snapshot, then streams **the same data** on every change. It blocks until interrupted (Ctrl-C) or the instance exits.

Default output is the same aligned table as `list agents` (a header, then a row per update). Use `--json` for one NDJSON record per change — the same shape as `list agents --json`, including the `usage` object — which is what scripts should parse:

```bash
attyx watch agents                       # live table of every agent
attyx watch agents -p 3                  # watch only pane 3's agent
attyx watch agents -s 2                  # watch session 2's agents (via daemon)
attyx watch agents --json | while read -r l; do notify-send "$l"; done
```

Each `--json` line looks like:

```json
{"pane_id":3,"tab_id":3,"session":1,"pid":4821,"state":"working","message":"Editing client.zig","usage":{...}}
```

The `state` field is one of `idle`, `working`, `input`, or `none` — where `none` means the agent ended. As with `list agents`, `-s`/`--session <id>` streams a specific session's agents directly from the daemon regardless of which session a window is showing (or whether any window is attached). Frames for a slow reader are dropped rather than stalling the terminal.

For a full-screen, cross-session view of every agent with this telemetry — plus navigation, jump-to-pane, sort/filter/search, and zoom/close — use [`attyx dashboard`](#agent-dashboard).

## Agent dashboard

`attyx dashboard` opens a full-screen, live table of every agent across **all** sessions (it reads the daemon when one is running, otherwise the attached window), with the same token/cost/context columns plus an `age` column for time-in-state. It reconnects on its own if the stream drops.

```bash
attyx dashboard                          # interactive full-screen view
attyx dashboard --once                   # print a one-shot snapshot and exit
```

| Key | Action |
|-----|--------|
| `↑` `↓` / `j` `k` | Move the selection |
| `Enter` | Jump to the selected agent — switch to its session and focus its pane |
| `z` | Zoom (maximize) the selected pane |
| `x` | Close the selected pane (asks `y/N` first) |
| `s` | Cycle sort: state · cost · tokens · ctx · session |
| `f` | Cycle filter: all · needs-input · working · idle |
| `/` | Search by model or message |
| `Tab` | Toggle a detail panel for the selected agent |
| `r` | Force a redraw |
| `q` | Quit |

The same view is available **inside** Attyx as an overlay — press **Cmd+Shift+A** (macOS) / **Ctrl+Shift+A** (Linux), or run the `Agent dashboard` [command-palette](/docs/command-palette/) entry.

## Configuration

```bash
attyx reload                             # hot-reload config from disk
attyx theme dracula                      # switch theme
attyx theme "catppuccin-mocha"
```

## Scrolling

```bash
attyx scroll-to top
attyx scroll-to bottom
attyx scroll-to page-up
attyx scroll-to page-down
```

## Popups

Open a floating terminal overlay. Closes when the command exits.

```bash
attyx popup lazygit
attyx popup htop --width 90 --height 90
attyx popup fzf --width 60 --height 40 --border none
attyx popup "k9s" --border heavy
```

| Option | Default | Description |
|--------|---------|-------------|
| `--width`, `-w` | `80` | Width as % of terminal (1-100) |
| `--height` | `80` | Height as % of terminal (1-100) |
| `--border`, `-b` | `rounded` | Border style: `single`, `double`, `rounded`, `heavy`, `none` |

## Sessions

```bash
attyx session list                       # list all sessions
attyx session create                     # create new session
attyx session switch 2                   # switch to session 2
attyx session rename "dev server"        # rename current session
attyx session rename 1 "dev server"      # rename session 1
attyx session kill 3                     # kill session 3
```

## Run (shorthand)

`attyx run` is shorthand for `attyx tab create --cmd`:

```bash
attyx run htop                           # open tab running htop
attyx run "make test" --wait             # run and wait for exit code
attyx run claude                         # open tab running claude
```

## Targeting instances

By default, IPC commands target the most recently active Attyx instance. To target a specific one:

```bash
attyx --target 12345 tab create
```

You can also set the `ATTYX_PID` environment variable. Socket discovery scans `~/.local/state/attyx/` for `ctl-*.sock` files and picks the most recently modified one.

## JSON output

All query commands support `--json` for structured output:

```bash
attyx list --json
attyx list tabs --json
attyx get-text --json
attyx session list --json
```

Errors are returned as `{"error": "message"}`.

## Wait mode

The `--wait` flag on `tab create`, `split vertical`, and `split horizontal` blocks until the command exits and returns its exit code:

```bash
attyx run "make test" --wait && echo "Tests passed"
attyx split v --cmd "cargo build" --wait
```

This is useful for scripting workflows where you need to know if a command succeeded.

## Agent workflow

A typical AI agent or automation script interacts with Attyx using pane targeting — capture the ID on creation, then use `-p` for all subsequent commands. This avoids focus juggling entirely.

```bash
# 1. Open a pane and capture its stable ID
id=$(attyx split v --cmd "your-tool")

# 2. Read the output (by pane ID, no focus change)
attyx get-text -p "$id"

# 3. Send input
attyx send-keys -p "$id" "some input\n"

# 4. Read the result
attyx get-text -p "$id"

# 5. Clean up
attyx split close -p "$id"
```

For commands that take time to produce output, poll instead of guessing with `sleep`:

```bash
# Wait for output to stabilize (poll every 2s, 2 stable reads = done)
stable=0; prev=""; for i in $(seq 1 15); do
  sleep 2
  curr=$(attyx get-text -p "$id" 2>/dev/null)
  if [ "$curr" = "$prev" ] && [ -n "$curr" ]; then
    stable=$((stable + 1))
    [ $stable -ge 2 ] && break
  else
    stable=0
  fi
  prev="$curr"
done
echo "$curr"
```

For quick commands (`ls`, `cat`, etc.) a simple `sleep 1` is fine. Use polling for anything interactive or slow (builds, installs, AI responses). `send-keys --wait-stable` does this stabilize-then-read loop for you in one call.

When the pane is running an AI agent, prefer `attyx watch agents -p "$id"` (or `attyx list agents -p "$id"`) over polling screen text — it reports the agent's `idle`/`working`/`input` state directly instead of guessing from output churn.

## All commands

| Command | Description |
|---------|-------------|
| `tab create [--cmd] [--wait]` | Create a new tab (returns pane ID) |
| `tab close [N]` | Close tab N (default: active tab) |
| `tab next` / `tab prev` | Switch tabs |
| `tab select <N>` | Jump to tab N |
| `tab move left\|right` | Reorder tab |
| `tab rename [N] <name>` | Set tab title (default: active tab) |
| `split vertical\|horizontal [--cmd] [--wait]` | Split pane (returns pane ID) |
| `split close [-p <id>]` | Close pane (default: focused) |
| `split rotate [-p <id>]` | Rotate layout |
| `split zoom [-p <id>]` | Toggle pane zoom |
| `focus up\|down\|left\|right` | Move focus |
| `send-keys [-p <id>] [--wait-stable] <keys>` | Send keystrokes (with escapes) |
| `send-text [-p <id>] <text>` | Send raw text |
| `send-image <path> [-p <id>]` | Attach an image file to a pane |
| `get-text [-p <id>] [-n <N>]` | Read screen content (or last N scrollback rows) |
| `list [tabs\|splits\|sessions\|agents]` | Query state (`agents` adds token/cost/context usage) |
| `watch agents [-p <id>] [--json]` | Stream agent status + usage live (table; `--json` for NDJSON) |
| `dashboard [--once]` | Full-screen cross-session agent dashboard |
| `reload` | Hot-reload config |
| `theme <name>` | Switch theme |
| `scroll-to top\|bottom\|page-up\|page-down` | Scroll viewport |
| `popup <cmd> [--width] [--height] [--border]` | Open popup |
| `session list\|create\|kill\|switch\|rename` | Manage sessions |
| `run <cmd> [--wait]` | Shorthand for `tab create --cmd` |

