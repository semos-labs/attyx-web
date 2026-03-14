---
title: VT Compatibility
description: Supported VT/ANSI escape sequences in Attyx.
sidebar:
  order: 9
---

Attyx implements a comprehensive set of VT/ANSI escape sequences.

## Cursor Movement

| Sequence | Description |
|----------|-------------|
| CSI H / CSI f | Absolute cursor position |
| CSI A/B/C/D | Relative cursor movement (up/down/right/left) |
| CSI E | Cursor next line |
| CSI F | Cursor previous line |
| CSI G | Cursor column absolute |
| CSI d | Cursor row absolute |
| ESC 7 / CSI s | Save cursor position |
| ESC 8 / CSI u | Restore cursor position |

## Erase

| Sequence | Description |
|----------|-------------|
| CSI J | Erase display (to end, to start, or all) |
| CSI K | Erase line (to end, to start, or all) |
| CSI X | Erase characters |

## Scrolling

| Sequence | Description |
|----------|-------------|
| CSI r | Set scroll region (DECSTBM) |
| CSI S | Scroll up |
| CSI T | Scroll down |
| ESC D | Index (move down, scroll within region) |
| ESC M | Reverse index (move up, scroll within region) |

## Line/Character Editing

| Sequence | Description |
|----------|-------------|
| CSI L | Insert lines |
| CSI M | Delete lines |
| CSI @ | Insert characters |
| CSI P | Delete characters |

## Style (SGR)

| Code | Description |
|------|-------------|
| 0 | Reset all attributes |
| 1 | Bold |
| 2 | Dim |
| 3 | Italic |
| 4 | Underline |
| 7 | Reverse video |
| 9 | Strikethrough |
| 30–37, 90–97 | Foreground colors (standard + bright) |
| 40–47, 100–107 | Background colors (standard + bright) |
| 38;5;N | 256-color foreground |
| 48;5;N | 256-color background |
| 38;2;R;G;B | 24-bit truecolor foreground |
| 48;2;R;G;B | 24-bit truecolor background |

## Modes

| Sequence | Description |
|----------|-------------|
| ESC[?1h/l | DECCKM — application/normal cursor keys |
| ESC[?7h/l | Auto-wrap mode |
| ESC[?25h/l | Cursor visibility |
| ESC[?47h/l | Alternate screen buffer (47) |
| ESC[?1000h/l | Mouse tracking (X10) |
| ESC[?1002h/l | Mouse tracking (button-event) |
| ESC[?1003h/l | Mouse tracking (any-event) |
| ESC[?1006h/l | SGR mouse encoding |
| ESC[?1047h/l | Alternate screen buffer (1047) |
| ESC[?1049h/l | Alternate screen buffer (1049) |
| ESC[?2004h/l | Bracketed paste mode |
| ESC[?2026h/l | Synchronized output |

## OSC Sequences

| Sequence | Description |
|----------|-------------|
| OSC 0/2 | Set terminal title |
| OSC 4 | Query palette color |
| OSC 7 | Set working directory |
| OSC 8 | Hyperlinks (clickable URLs) |
| OSC 9 | Desktop notification (iTerm2 style) |
| OSC 10 | Query/set foreground color |
| OSC 11 | Query/set background color |
| OSC 12 | Query/set cursor color |
| OSC 777 | Desktop notification (rxvt/Kitty style) |

## DCS Sequences

| Sequence | Description |
|----------|-------------|
| DCS ... ST | DCS passthrough |

## Kitty Protocols

| Sequence | Description |
|----------|-------------|
| CSI > N u | Push keyboard flags |
| CSI < N u | Pop keyboard flags |
| CSI ? u | Query keyboard flags |
| APC G | Graphics protocol (images) |

## Device Queries

| Sequence | Description |
|----------|-------------|
| CSI 5 n | Device status report |
| CSI 6 n | Cursor position report |
| CSI c | Primary device attributes (DA1) |
| CSI > c | Secondary device attributes (DA2) |
| CSI Ps SP q | Set cursor shape (DECSCUSR) |
| CSI ?Ps$p | Query DEC private mode (DECRQM) |
