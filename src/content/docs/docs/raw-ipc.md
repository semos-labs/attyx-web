---
title: Raw IPC Protocol
description: Binary protocol reference for building custom Attyx IPC clients.
sidebar:
  order: 20
---

You don't need the `attyx` CLI to control a running instance. Any program that can open a Unix socket can speak the binary protocol directly. This page documents everything you need to build your own client.

## Connection

Every Attyx instance listens on a Unix domain socket (SOCK_STREAM) at:

```
~/.local/state/attyx/ctl-<pid>.sock
```

Where `<pid>` is the process ID of the running Attyx instance. Debug builds use the suffix `-dev` (e.g. `ctl-12345-dev.sock`).

**Socket discovery:** scan `~/.local/state/attyx/` for files matching `ctl-*.sock` and pick the most recently modified one. If the `ATTYX_PID` environment variable is set, connect to that specific PID's socket instead.

The socket has `0600` permissions (owner-only). There is no authentication beyond filesystem access.

## Message framing

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

## Message types

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

## Response formats

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

## Popup border styles

The popup command encodes the border style as a single byte:

| Value | Style |
|-------|-------|
| `0` | `single` |
| `1` | `double` |
| `2` | `rounded` (default) |
| `3` | `heavy` |
| `4` | `none` |

## Examples

### Python — create a tab and read screen content

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

### Node.js — split pane and send keystrokes

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

### Bash — using socat

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

### Go — full client

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

## Protocol lifecycle

1. **Connect** — open a `SOCK_STREAM` Unix socket to `ctl-<pid>.sock`
2. **Send** — write the 5-byte header followed by the payload
3. **Receive** — read the 5-byte response header, then read `payload_len` bytes
4. **Close** — close the socket

Each connection handles exactly one request-response pair. Open a new connection for each command. The `_wait` variants (`0x43`–`0x45`) hold the connection open until the spawned process exits, then respond with an `exit_code` (`0xA2`) message.

## Pane-targeted messages

The `_pane` variants (`0x46`–`0x48`) and targeted operations (`0x49`–`0x4D`) allow you to address specific panes and tabs by their stable ID without changing focus. Their payloads start with the target ID followed by the normal payload data.

For example, to send keys to pane 3:

```
[header: type=0x46] [u32 LE: 3] [key bytes]
```

## Session envelope

The `session_envelope` message (`0x50`) wraps any other command and routes it to a specific session. The payload format is:

```
[u32 LE: session_id] [u8: inner_msg_type] [inner_payload...]
```

This is how the `-s`/`--session` CLI flag works under the hood. When the flag is omitted, commands target the currently attached session.
