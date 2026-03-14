---
title: Shell
description: Shell program, arguments, and working directory.
sidebar:
  order: 6
---

The program section controls which shell Attyx launches and how it starts.

## Configuration

```toml
[program]
shell = "/bin/zsh"
args = ["-l"]
working_directory = "~/Projects"
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shell` | string | `$SHELL` or `/bin/sh` | Shell program to run |
| `args` | string[] | `[]` | Extra arguments passed to the shell |
| `working_directory` | string | — | Initial working directory |

## Shell detection

If `shell` is not set, Attyx uses the `SHELL` environment variable. If that's also unset, it falls back to `/bin/sh`.

## Login shell

To start a login shell, pass `-l` in the args:

```toml
[program]
args = ["-l"]
```

## Working directory

Set the initial directory for new terminal sessions:

```toml
[program]
working_directory = "~/Projects"
```

When not set, Attyx inherits the working directory from its parent process (typically your home directory when launched from an app launcher).

## Running a command instead of a shell

You can run any program, not just a shell:

```toml
[program]
shell = "/usr/bin/htop"
```

The terminal will close when the program exits.

## CLI flags

| Flag | Description |
|------|-------------|
| `--shell <path>` | Shell program |
| `--cmd <command...>` | Override shell command |
| `-d`, `--working-directory <path>` | Initial working directory |

## Shell integration

Attyx includes shell integration scripts for zsh, bash, fish, nushell, and sh. These enable features like working directory tracking (OSC 7) and PATH reporting for popups. Shell integration is automatic — no configuration needed.

## Runtime changes

Program settings require a restart — they are not [hot-reloadable](/docs/configuration/#hot-reload). Changing the shell or working directory only affects new terminals.
