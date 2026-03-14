---
title: Visual Mode
description: Vim-inspired keyboard-driven text selection and search.
sidebar:
  order: 15
---

Visual mode gives you keyboard-driven text selection, inspired by Vim. Select text, search the scrollback, and copy — all without touching the mouse.

## Entering visual mode

Press `Ctrl+Shift+Space` to enter copy mode. You'll see a cursor you can move around the terminal.

## Navigation

| Key | Action |
|-----|--------|
| `h` / `Left` | Move left |
| `j` / `Down` | Move down |
| `k` / `Up` | Move up |
| `l` / `Right` | Move right |
| `w` | Jump forward one word |
| `b` | Jump backward one word |
| `e` | Jump to end of word |
| `0` | Jump to start of line |
| `^` | Jump to first non-blank character |
| `$` | Jump to end of line |
| `g` | Jump to top of scrollback |
| `G` | Jump to bottom |

Numeric prefixes work — `5j` moves down 5 lines, `3w` jumps 3 words forward.

## Selection modes

From copy mode, press one of these to start selecting:

| Key | Mode |
|-----|------|
| `v` | Character-wise selection |
| `V` | Line-wise selection |
| `Ctrl+V` | Block (rectangular) selection |

Move the cursor to extend your selection, then press `y` to copy it to the clipboard.

## Text objects

While in a selection mode, you can use text object modifiers:

| Key | Action |
|-----|--------|
| `i` + object | Select inner text object (e.g. `iw` for inner word, `i"` for inner quotes) |
| `a` + object | Select around text object (e.g. `aw` for word + surrounding space) |

## In-terminal search

While in copy mode, you can search the scrollback:

| Key | Action |
|-----|--------|
| `/` | Search forward |
| `?` | Search backward |
| `n` | Next match |
| `N` | Previous match |

The search query appears in the status bar, and matches are highlighted as you type. Search is smart-case — lowercase queries are case-insensitive, queries with uppercase letters are case-sensitive.

## Exiting

| Key | Action |
|-----|--------|
| `y` | Yank (copy) selection and exit |
| `Escape` | Step back through modes (selection → copy mode → normal) |

## Example workflow

1. Press `Ctrl+Shift+Space` to enter copy mode
2. Use `/` to search for a string — e.g., `/error`
3. Press `n` to jump through matches
4. Press `v` to start character selection
5. Extend the selection with movement keys
6. Press `y` to copy to clipboard

## Keybindings

The key to enter copy mode can be rebound:

```toml
[keybindings]
copy_mode = "ctrl+shift+space"
```
