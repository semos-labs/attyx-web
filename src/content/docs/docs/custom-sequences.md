---
title: Custom Sequences
description: Bind key combos to raw escape sequences in Attyx.
sidebar:
  order: 10
---

Attyx lets you bind any key combo to send a raw escape sequence to the terminal via the `[sequences]` table.

## Configuration

```toml
[sequences]
"ctrl+shift+k" = "\u001b[K"
"alt+enter" = "\u001b\r"
```

Each key is a [key combo](/docs/keybindings/#key-combo-syntax) and each value is the escape sequence string to send.

## Escape syntax

Values use standard TOML string escapes:

| Escape | Character |
|---|---|
| `\u001b` | ESC (`0x1b`) |
| `\n` | Newline |
| `\r` | Carriage return |
| `\t` | Tab |
| `\\` | Literal backslash |

## Examples

Clear the line from cursor to end:

```toml
[sequences]
"ctrl+shift+k" = "\u001b[K"
```

Send Alt+Enter as ESC followed by carriage return:

```toml
[sequences]
"alt+enter" = "\u001b\r"
```

Send a CSI sequence to move the cursor up 5 lines:

```toml
[sequences]
"ctrl+shift+up" = "\u001b[5A"
```
