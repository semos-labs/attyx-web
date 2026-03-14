---
title: Integration
description: Control Attyx from scripts, AI agents, and external tools via IPC.
sidebar:
  order: 18
---

Attyx exposes a full IPC interface over Unix sockets. Scripts, AI agents, and external tools can create tabs, split panes, send keystrokes, read screen content, and more — all from the command line.

## How it works

Every running Attyx instance listens on a Unix domain socket at:

```
~/.local/state/attyx/ctl-<pid>.sock
```

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

When `-s` is omitted, commands target the currently attached session.

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

### send-text

Send raw text to a pane. Supports the same escape sequences as `send-keys`.

```bash
attyx send-text "hello"                  # write "hello" (no newline)
attyx send-text -p 3 "hello"            # write to pane 3
attyx send-text "echo hello\n"           # write "echo hello" + Enter
```

## Reading screen content

Read the visible text from a pane (focused pane by default).

```bash
attyx get-text                           # plain text, one line per row
attyx get-text -p 3                     # read from pane 3
attyx get-text --json                    # { "lines": ["row1", "row2", ...] }
attyx get-text -p 5 --json             # pane 5 as JSON
```

Trailing whitespace is trimmed per row. Empty trailing rows are omitted.

## Querying state

```bash
attyx list                               # full tab/pane tree
attyx list tabs                          # tab names and indices
attyx list splits                        # panes in active tab
attyx list sessions                      # daemon sessions
attyx list --json                        # any of the above as JSON
```

`panes` is an alias for `splits`.

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

For quick commands (`ls`, `cat`, etc.) a simple `sleep 1` is fine. Use polling for anything interactive or slow (builds, installs, AI responses).

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
| `send-keys [-p <id>] <keys>` | Send keystrokes (with escapes) |
| `send-text [-p <id>] <text>` | Send raw text |
| `get-text [-p <id>]` | Read screen content |
| `list [tabs\|splits\|sessions]` | Query state |
| `reload` | Hot-reload config |
| `theme <name>` | Switch theme |
| `scroll-to top\|bottom\|page-up\|page-down` | Scroll viewport |
| `popup <cmd> [--width] [--height] [--border]` | Open popup |
| `session list\|create\|kill\|switch\|rename` | Manage sessions |
| `run <cmd> [--wait]` | Shorthand for `tab create --cmd` |

---

## Raw IPC protocol

You don't need the `attyx` CLI to control a running instance. Any program that can open a Unix socket can speak the binary protocol directly. This section documents everything you need to build your own client.

### Connection

Every Attyx instance listens on a Unix domain socket (SOCK_STREAM) at:

```
~/.local/state/attyx/ctl-<pid>.sock
```

Where `<pid>` is the process ID of the running Attyx instance. Debug builds use the suffix `-dev` (e.g. `ctl-12345-dev.sock`).

**Socket discovery:** scan `~/.local/state/attyx/` for files matching `ctl-*.sock` and pick the most recently modified one. If the `ATTYX_PID` environment variable is set, connect to that specific PID's socket instead.

The socket has `0600` permissions (owner-only). There is no authentication beyond filesystem access.

### Message framing

Every message — request and response — uses the same 5-byte header:

```
┌─────────────────────────┬────────────┐
│  payload_len (4 bytes)  │  type (1B) │
│  little-endian u32      │  u8 enum   │
└─────────────────────────┴────────────┘
│◄─── header (5 bytes) ──►│
```

Followed by `payload_len` bytes of payload. Maximum payload size is 4096 bytes for requests, 65536 bytes for responses.

A message with no payload has `payload_len = 0` and consists of the 5-byte header only.

### Message types

**Requests** (client → instance):

| Type | Hex | Payload |
|------|-----|---------|
| `tab_create` | `0x20` | Command string (empty = default shell) |
| `tab_close` | `0x21` | (none) |
| `tab_next` | `0x22` | (none) |
| `tab_prev` | `0x23` | (none) |
| `tab_select` | `0x24` | `u8` tab index (1-based) |
| `tab_move_left` | `0x25` | (none) |
| `tab_move_right` | `0x26` | (none) |
| `tab_rename` | `0x27` | Name string |
| `split_vertical` | `0x28` | Command string (empty = default shell) |
| `split_horizontal` | `0x29` | Command string (empty = default shell) |
| `pane_close` | `0x2A` | (none) |
| `pane_rotate` | `0x2B` | (none) |
| `pane_zoom_toggle` | `0x2C` | (none) |
| `focus_up` | `0x2D` | (none) |
| `focus_down` | `0x2E` | (none) |
| `focus_left` | `0x2F` | (none) |
| `focus_right` | `0x30` | (none) |
| `send_keys` | `0x31` | Raw key bytes (after escape processing) |
| `send_text` | `0x32` | Raw text bytes |
| `get_text` | `0x33` | (none) |
| `config_reload` | `0x34` | (none) |
| `theme_set` | `0x35` | Theme name string |
| `scroll_to_top` | `0x36` | (none) |
| `scroll_to_bottom` | `0x37` | (none) |
| `scroll_page_up` | `0x38` | (none) |
| `scroll_page_down` | `0x39` | (none) |
| `list` | `0x3A` | (none) |
| `session_list` | `0x3B` | (none) |
| `session_create` | `0x3C` | (none) |
| `session_kill` | `0x3D` | `u32` LE session ID |
| `session_switch` | `0x3E` | `u32` LE session ID |
| `session_rename` | `0x3F` | `u32` LE session ID + name string |
| `list_tabs` | `0x40` | (none) |
| `list_splits` | `0x41` | (none) |
| `popup` | `0x42` | `u8` width% + `u8` height% + `u8` border style + command string |
| `tab_create_wait` | `0x43` | Command string (required) |
| `split_vertical_wait` | `0x44` | Command string (required) |
| `split_horizontal_wait` | `0x45` | Command string (required) |
| `send_keys_pane` | `0x46` | `u32` LE pane ID + key bytes |
| `send_text_pane` | `0x47` | `u32` LE pane ID + text bytes |
| `get_text_pane` | `0x48` | `u32` LE pane ID |
| `pane_close_targeted` | `0x49` | `u32` LE pane ID |
| `pane_zoom_targeted` | `0x4A` | `u32` LE pane ID |
| `pane_rotate_targeted` | `0x4B` | `u32` LE pane ID |
| `tab_close_targeted` | `0x4C` | `u8` tab index (0-based) |
| `tab_rename_targeted` | `0x4D` | `u8` tab index (0-based) + name string |
| `session_envelope` | `0x50` | `u32` LE session ID + `u8` inner msg type + inner payload |

**Responses** (instance → client):

| Type | Hex | Payload |
|------|-----|---------|
| `success` | `0xA0` | Response data (may be empty) |
| `err` | `0xA1` | JSON error: `{"error":"message"}` |
| `exit_code` | `0xA2` | `u8` exit code + captured stdout bytes |

### Response formats

**`list` response** — tab/pane tree, tab-separated:

```
1	bash	*
  1	bash	*	80x24
  3	python		40x24
2	vim
  2	vim		80x24
```

Active tab/pane marked with `*`. Panes indented with two spaces, format: `<pane_id>\t<title>[\t*]\t<cols>x<rows>`. Pane IDs are stable integers that never change.

**`list_tabs` response** — tabs only:

```
1	bash	*
2	vim
```

**`list_splits` response** — panes in the active tab:

```
1	bash	*	80x24
3	python		40x24
```

**`get_text` response** — visible screen content, one line per row. Trailing whitespace trimmed. Empty trailing rows omitted.

**`session_list` response:**

```
1	dev	*	3 panes
2	server		1 panes
3	old		dead	2 panes
```

**`session_create` response** — the new session ID as plain text (e.g. `3`).

### Popup border styles

The popup command encodes the border style as a single byte:

| Value | Style |
|-------|-------|
| `0` | `single` |
| `1` | `double` |
| `2` | `rounded` (default) |
| `3` | `heavy` |
| `4` | `none` |

### Examples

#### Python — create a tab and read screen content

```python
import socket
import struct
import glob
import os

def connect():
    """Connect to the most recently active Attyx instance."""
    state_dir = os.path.expanduser("~/.local/state/attyx")
    sockets = glob.glob(os.path.join(state_dir, "ctl-*.sock"))
    if not sockets:
        raise RuntimeError("No running Attyx instance found")
    # Pick the most recently modified socket
    sock_path = max(sockets, key=os.path.getmtime)
    s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    s.connect(sock_path)
    return s

def send_msg(s, msg_type, payload=b""):
    """Send a framed message and read the response."""
    header = struct.pack("<IB", len(payload), msg_type)
    s.sendall(header + payload)

    # Read 5-byte response header
    hdr = b""
    while len(hdr) < 5:
        hdr += s.recv(5 - len(hdr))
    resp_len, resp_type = struct.unpack("<IB", hdr)

    # Read payload
    data = b""
    while len(data) < resp_len:
        data += s.recv(resp_len - len(data))
    return resp_type, data

SUCCESS = 0xA0
ERROR   = 0xA1

# Create a new tab running htop
s = connect()
resp_type, data = send_msg(s, 0x20, b"htop")  # tab_create
s.close()
assert resp_type == SUCCESS

# Read the screen content
s = connect()
resp_type, data = send_msg(s, 0x33)  # get_text
s.close()
print(data.decode())

# Send Ctrl-C to the active pane
s = connect()
resp_type, data = send_msg(s, 0x31, b"\x03")  # send_keys
s.close()

# List all tabs
s = connect()
resp_type, data = send_msg(s, 0x40)  # list_tabs
s.close()
for line in data.decode().splitlines():
    print(line)
```

#### Node.js — split pane and send keystrokes

```js
import { createConnection } from "net";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const SUCCESS = 0xa0;
const ERROR = 0xa1;

function connectAttyx() {
  const stateDir = join(homedir(), ".local/state/attyx");
  const socks = readdirSync(stateDir)
    .filter((f) => f.startsWith("ctl-") && f.endsWith(".sock"))
    .map((f) => ({
      path: join(stateDir, f),
      mtime: statSync(join(stateDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (!socks.length) throw new Error("No running Attyx instance");
  return createConnection(socks[0].path);
}

function sendMsg(msgType, payload = Buffer.alloc(0)) {
  return new Promise((resolve, reject) => {
    const sock = connectAttyx();
    const header = Buffer.alloc(5);
    header.writeUInt32LE(payload.length, 0);
    header[4] = msgType;
    sock.write(Buffer.concat([header, payload]));

    const chunks = [];
    sock.on("data", (chunk) => chunks.push(chunk));
    sock.on("end", () => {
      const buf = Buffer.concat(chunks);
      const respLen = buf.readUInt32LE(0);
      const respType = buf[4];
      const data = buf.subarray(5, 5 + respLen);
      resolve({ type: respType, data });
      sock.destroy();
    });
    sock.on("error", reject);
  });
}

// Split vertical with a command
await sendMsg(0x28, Buffer.from("htop"));

// Send keystrokes (type "q" to quit htop)
await sendMsg(0x31, Buffer.from("q"));

// Read screen content
const { type, data } = await sendMsg(0x33);
if (type === SUCCESS) {
  console.log(data.toString());
}

// Close the pane
await sendMsg(0x2a);
```

#### Bash — using socat

```bash
SOCK=$(ls -t ~/.local/state/attyx/ctl-*.sock 2>/dev/null | head -1)

# Helper: send a raw IPC message via socat
attyx_raw() {
  local type_byte="$1"
  local payload="$2"
  local len=${#payload}

  # Build 5-byte header: 4 bytes LE length + 1 byte type
  local header
  header=$(printf '\\x%02x\\x%02x\\x%02x\\x%02x\\x%02x' \
    $((len & 0xFF)) $(((len >> 8) & 0xFF)) \
    $(((len >> 16) & 0xFF)) $(((len >> 24) & 0xFF)) \
    "$type_byte")

  # Send and receive
  printf "${header}${payload}" | socat - UNIX-CONNECT:"$SOCK"
}

# Create a tab (0x20) running "make test"
attyx_raw 0x20 "make test"

# Get screen text (0x33)
attyx_raw 0x33 ""

# Send Ctrl-C (0x31 = send_keys)
attyx_raw 0x31 $'\x03'

# Close active pane (0x2A)
attyx_raw 0x2A ""
```

#### Go — full client

```go
package main

import (
	"encoding/binary"
	"fmt"
	"net"
	"os"
	"path/filepath"
	"sort"
)

const (
	TabCreate   = 0x20
	SendKeys    = 0x31
	GetText     = 0x33
	ListTabs    = 0x40
	Success     = 0xA0
	Error       = 0xA1
)

func discoverSocket() (string, error) {
	dir := filepath.Join(os.Getenv("HOME"), ".local/state/attyx")
	matches, err := filepath.Glob(filepath.Join(dir, "ctl-*.sock"))
	if err != nil || len(matches) == 0 {
		return "", fmt.Errorf("no running Attyx instance")
	}
	sort.Slice(matches, func(i, j int) bool {
		si, _ := os.Stat(matches[i])
		sj, _ := os.Stat(matches[j])
		return si.ModTime().After(sj.ModTime())
	})
	return matches[0], nil
}

func send(msgType byte, payload []byte) (byte, []byte, error) {
	sockPath, err := discoverSocket()
	if err != nil {
		return 0, nil, err
	}
	conn, err := net.Dial("unix", sockPath)
	if err != nil {
		return 0, nil, err
	}
	defer conn.Close()

	// Send header + payload
	header := make([]byte, 5)
	binary.LittleEndian.PutUint32(header[:4], uint32(len(payload)))
	header[4] = msgType
	conn.Write(header)
	if len(payload) > 0 {
		conn.Write(payload)
	}

	// Read response header
	respHdr := make([]byte, 5)
	if _, err := conn.Read(respHdr); err != nil {
		return 0, nil, err
	}
	respLen := binary.LittleEndian.Uint32(respHdr[:4])
	respType := respHdr[4]

	// Read response payload
	data := make([]byte, respLen)
	total := 0
	for total < int(respLen) {
		n, err := conn.Read(data[total:])
		if err != nil {
			return 0, nil, err
		}
		total += n
	}
	return respType, data, nil
}

func main() {
	// Create a tab
	send(TabCreate, []byte("htop"))

	// Read screen
	respType, data, _ := send(GetText, nil)
	if respType == Success {
		fmt.Print(string(data))
	}

	// List tabs
	_, tabs, _ := send(ListTabs, nil)
	fmt.Print(string(tabs))
}
```

### Protocol lifecycle

1. **Connect** — open a `SOCK_STREAM` Unix socket to `ctl-<pid>.sock`
2. **Send** — write the 5-byte header followed by the payload
3. **Receive** — read the 5-byte response header, then read `payload_len` bytes
4. **Close** — close the socket

Each connection handles exactly one request-response pair. Open a new connection for each command. The `_wait` variants (`0x43`–`0x45`) hold the connection open until the spawned process exits, then respond with an `exit_code` (`0xA2`) message.

### Pane-targeted messages

The `_pane` variants (`0x46`–`0x48`) and targeted operations (`0x49`–`0x4D`) allow you to address specific panes and tabs by their stable ID without changing focus. Their payloads start with the target ID followed by the normal payload data.

For example, to send keys to pane 3:

```
[header: type=0x46] [u32 LE: 3] [key bytes]
```

### Session envelope

The `session_envelope` message (`0x50`) wraps any other command and routes it to a specific session. The payload format is:

```
[u32 LE: session_id] [u8: inner_msg_type] [inner_payload...]
```

This is how the `-s`/`--session` CLI flag works under the hood. When the flag is omitted, commands target the currently attached session.
