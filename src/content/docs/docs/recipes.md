---
title: IPC Recipes
description: Automation scripts and workflow integrations using the Attyx IPC interface.
sidebar:
  order: 19
---

Real-world automation patterns that use the Attyx IPC interface to orchestrate terminals programmatically. These assume you're familiar with the basics covered in [Integration](/docs/integration/).

## Auto-restart on file change

Watch source files and restart a process in a managed pane — without losing your place or disrupting other panes.

```bash
#!/bin/bash
# dev-watch.sh — file-watcher that restarts a dev server via IPC

CMD="node server.js"
server=$(attyx split v --cmd "$CMD")

cleanup() { attyx split close -p "$server" 2>/dev/null; exit; }
trap cleanup EXIT INT TERM

fswatch -o --event Updated ./src | while read -r _; do
  attyx send-keys -p "$server" "{Ctrl-c}"
  sleep 0.3
  attyx send-keys -p "$server" "$CMD{Enter}"
done
```

The server pane persists across restarts. Your focus stays wherever it is — all interaction happens via `-p`.

## CI-style test runner

Run test suites across services in parallel, capture exit codes, and report results — all visible in splits.

```bash
#!/bin/bash
# test-all.sh — parallel test runner with live output

services=(auth api gateway web)
declare -A pids panes

for svc in "${services[@]}"; do
  pane=$(attyx split v --cmd "cd services/$svc && make test" --wait) &
  pids[$svc]=$!
  panes[$svc]=$pane
done

failed=()
for svc in "${services[@]}"; do
  if ! wait "${pids[$svc]}"; then
    failed+=("$svc")
  fi
done

if [ ${#failed[@]} -eq 0 ]; then
  echo "All services passed"
else
  echo "FAILED: ${failed[*]}"
  # Leave failed panes open for inspection
  for svc in "${services[@]}"; do
    [[ ! " ${failed[*]} " =~ " $svc " ]] && attyx split close -p "${panes[$svc]}" 2>/dev/null
  done
  exit 1
fi
```

Each service gets its own visible split. Failed panes stay open so you can read the output.

## Workspace bootstrap script

Spin up an entire project layout — sessions, tabs, splits, running processes — from a single script. Run it on project start.

```bash
#!/bin/bash
# workspace.sh — bootstrap a full dev environment

# Backend session
backend=$(attyx session create ~/Projects/api -b "backend")
attyx -s "$backend" split v --cmd "npm run dev"
attyx -s "$backend" split h --cmd "tail -f logs/api.log"
attyx -s "$backend" tab create --cmd "psql -d myapp"
attyx -s "$backend" tab rename 2 "db"

# Frontend session
frontend=$(attyx session create ~/Projects/web -b "frontend")
attyx -s "$frontend" split v --cmd "npm run dev"
attyx -s "$frontend" tab create --cmd "npx storybook dev"
attyx -s "$frontend" tab rename 2 "storybook"

# Infrastructure session
infra=$(attyx session create ~/Projects/infra -b "infra")
attyx -s "$infra" split v --cmd "kubectl get pods -w"
attyx -s "$infra" split h --cmd "stern -n default ."

# Switch to the backend session to start
attyx session switch "$backend"
```

## Health check monitor

Poll a service endpoint and display status in a dedicated pane, sending alerts via IPC when things go wrong.

```bash
#!/bin/bash
# healthcheck.sh — monitor endpoints, show status in a pane

ENDPOINTS=(
  "http://localhost:3000/health api"
  "http://localhost:5432/health db"
  "http://localhost:6379/health cache"
)
INTERVAL=10

monitor=$(attyx split v)
attyx tab rename "monitor"

while true; do
  output=""
  for entry in "${ENDPOINTS[@]}"; do
    url="${entry%% *}"
    name="${entry##* }"
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$url" 2>/dev/null)
    if [ "$status" = "200" ]; then
      output+="[OK]   $name ($url)\\n"
    else
      output+="[FAIL] $name ($url) — HTTP $status\\n"
      # Send a visible alert to the main pane
      attyx send-text -p 1 "# ALERT: $name is down (HTTP $status)"
      attyx send-keys -p 1 "{Enter}"
    fi
  done

  attyx send-keys -p "$monitor" "{Ctrl-l}"
  attyx send-text -p "$monitor" "$(echo -e "=== Health Check $(date +%H:%M:%S) ===\n$output")"
  attyx send-keys -p "$monitor" "{Enter}"

  sleep "$INTERVAL"
done
```

## Deploy pipeline with gates

Run deployment steps sequentially, pausing for confirmation at each gate. The operator sees everything in real time.

```bash
#!/bin/bash
# deploy.sh — gated deployment pipeline

deploy_pane=$(attyx split v)

run_step() {
  local name="$1" cmd="$2"
  attyx send-text -p "$deploy_pane" "--- $name ---"
  attyx send-keys -p "$deploy_pane" "{Enter}"
  attyx send-keys -p "$deploy_pane" "$cmd{Enter}"

  # Wait for the command to finish by watching for the shell prompt
  local output=""
  for i in $(seq 1 60); do
    sleep 2
    output=$(attyx get-text -p "$deploy_pane" 2>/dev/null)
    if echo "$output" | grep -q '^\$'; then
      return 0
    fi
  done
  return 1
}

gate() {
  local step="$1"
  echo "Step '$step' complete. Proceed? [y/N]"
  read -r answer
  [ "$answer" = "y" ] || { echo "Aborted at '$step'"; exit 1; }
}

run_step "Build" "make build" && gate "Build"
run_step "Test" "make test" && gate "Test"
run_step "Staging deploy" "make deploy-staging" && gate "Staging"
run_step "Production deploy" "make deploy-prod"

echo "Deployment complete"
attyx split close -p "$deploy_pane"
```

## Log aggregator across sessions

Collect output from panes across multiple sessions into a single view.

```bash
#!/bin/bash
# aggregate-logs.sh — tail output from multiple service panes

declare -A targets=(
  [api]="2:3"      # session 2, pane 3
  [worker]="2:5"   # session 2, pane 5
  [frontend]="3:2" # session 3, pane 2
)

log_pane=$(attyx split v)

while true; do
  combined=""
  for name in "${!targets[@]}"; do
    IFS=: read -r sid pid <<< "${targets[$name]}"
    text=$(attyx -s "$sid" get-text -p "$pid" 2>/dev/null | tail -3)
    combined+="[$name] $(echo "$text" | tail -1)\n"
  done

  attyx send-keys -p "$log_pane" "{Ctrl-l}"
  attyx send-text -p "$log_pane" "$(echo -e "=== $(date +%H:%M:%S) ===\n$combined")"
  attyx send-keys -p "$log_pane" "{Enter}"

  sleep 5
done
```

## Git pre-push hook with visible output

Run checks in a visible split before pushing, so you can watch and debug failures inline.

```bash
#!/bin/bash
# .git/hooks/pre-push — run checks in a visible Attyx pane

# Only run inside Attyx
if ! command -v attyx &>/dev/null || ! attyx list &>/dev/null; then
  # Fallback: run checks inline
  make lint && make test
  exit $?
fi

check=$(attyx split v --cmd "make lint && make test" --wait)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "Pre-push checks failed. Check the split pane for details."
  # Leave the pane open for inspection
  exit 1
fi

attyx split close -p "$check" 2>/dev/null
exit 0
```

## Scripted REPL interaction

Drive a REPL programmatically — send expressions, read evaluated results, and branch on output.

```bash
#!/bin/bash
# seed-db.sh — use a psql REPL to seed data and verify

db=$(attyx split v --cmd "psql -d myapp")
sleep 1  # wait for REPL to start

# Run a migration
attyx send-keys -p "$db" --wait-stable "\i db/migrations/001_create_users.sql{Enter}"

# Verify the table exists
result=$(attyx send-keys -p "$db" --wait-stable "SELECT count(*) FROM users;{Enter}")

if echo "$result" | grep -q "(0 rows)"; then
  echo "Migration failed — no rows"
  exit 1
fi

# Seed data
attyx send-keys -p "$db" --wait-stable "\i db/seeds/users.sql{Enter}"

# Verify
result=$(attyx send-keys -p "$db" --wait-stable "SELECT count(*) FROM users;{Enter}")
echo "Users seeded: $result"

attyx send-keys -p "$db" "\q{Enter}"
attyx split close -p "$db" 2>/dev/null
```

## Cron-based session snapshot

Periodically capture the state of all sessions and panes to a log file — useful for auditing or debugging long-running processes.

`attyx list` and `attyx session list` emit tab-separated text (one entry per line), so we parse columns with `cut`. Session IDs are in column 1 of `session list`; pane IDs are in column 1 of `list splits`.

```bash
#!/bin/bash
# snapshot.sh — capture terminal state to a log (run via cron)

LOG_DIR="$HOME/.local/share/attyx/snapshots"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Session list rows: <id>\t<name>[\t*][\tdead]\t<N> panes
attyx session list 2>/dev/null | cut -f1 | while read -r sid; do
  [ -n "$sid" ] || continue
  # Split-list rows: <pane_id>\t<title>[\t*]\t<cols>x<rows>
  attyx -s "$sid" list splits 2>/dev/null | cut -f1 | while read -r pid; do
    [ -n "$pid" ] || continue
    text=$(attyx -s "$sid" get-text -p "$pid" 2>/dev/null)
    file="$LOG_DIR/${TIMESTAMP}_s${sid}_p${pid}.log"
    echo "$text" > "$file"
  done
done
```

Add to crontab: `*/15 * * * * ~/scripts/snapshot.sh`

Note: `list agents` and `watch agents` print a human-readable table by default and switch to JSON with `--json`; `list`, `list tabs`, `list splits`, and `session list` are tab-separated, and `get-text` is plain text. Parse the tab-separated ones with `cut`/`awk`, and reserve `jq` for `list agents --json` / `watch agents --json`.

## Notify on agent state changes

`attyx watch agents` opens a long-lived connection that updates every time a pane's agent changes state — including the transition to `none` when an agent finishes. On connect it first emits the current set of active agents as a snapshot. By default it prints a live table; add `--json` to stream one JSON object per line (NDJSON), which is what a script should parse. This is the clean way to react to background AI agents without polling.

```bash
#!/bin/bash
# agent-notify.sh — desktop alert when an agent needs input or finishes

attyx watch agents --json | jq -rc '"\(.state)\t\(.pane_id)\t\(.message)"' |
while IFS=$'\t' read -r state pane message; do
  case "$state" in
    input)
      notify-send "Agent waiting" "pane $pane: ${message:-needs input}"
      ;;
    none)
      notify-send "Agent finished" "pane $pane"
      ;;
  esac
done
```

Each `--json` frame is `{"pane_id":N,"tab_id":N,"session":N,"pid":N,"state":"...","message":"...","usage":{...}}` with `state` one of `idle`, `working`, `input`, or `none`, and a `usage` object carrying token/cost/context numbers. Add `-p <id>` to watch a single pane, or `-s <id>` to stream a specific session's agents directly from the daemon. See [Agent Workflows](/docs/agent-workflows/) and [Integration → Tracking agents](/docs/integration/#tracking-agents) for the full agent-monitoring surface.

## Tool integrations

These examples show how to wire third-party tools into Attyx so they call back into the terminal via IPC — custom keybindings, shell functions, and hooks that make your existing tools more powerful.

### gh-dash — review PRs in a popup

Configure [gh-dash](https://github.com/dlvhdr/gh-dash) keybindings to open diffs, checkouts, and reviews in Attyx popups. Add to `~/.config/gh-dash/config.yml`:

```yaml
keybindings:
  prs:
    - key: d
      command: attyx popup "gh pr diff {{.PrNumber}}" --width 90 --height 85
    - key: v
      command: attyx popup "gh pr view {{.PrNumber}}" --width 80 --height 70
    - key: c
      command: >
        attyx popup "gh pr checkout {{.PrNumber}} && $SHELL" --width 90 --height 85
    - key: w
      command: attyx popup "gh pr review {{.PrNumber}}" --width 80 --height 70
    - key: b
      command: >
        attyx popup "gh pr checks {{.PrNumber}} --watch" --width 70 --height 60
```

Now pressing `d` on a PR opens its diff in a floating popup with your full scrollback, `c` checks it out in a temporary shell, and `b` watches CI — all without leaving gh-dash.

### lazygit — open files in a split editor

Configure [lazygit](https://github.com/jesseduffield/lazygit) custom commands to open files in a neovim split instead of its built-in editor. Add to `~/.config/lazygit/config.yml`:

```yaml
customCommands:
  - key: e
    context: files
    command: attyx split v --cmd "nvim {{.SelectedFile.Name}}"
    description: Edit in split
  - key: e
    context: commitFiles
    command: attyx split v --cmd "nvim {{.SelectedCommitFile.Name}}"
    description: Edit in split
  - key: D
    context: localBranches
    command: >
      attyx popup "git diff {{.SelectedLocalBranch.Name}}..HEAD | delta" --width 90 --height 85
    description: Diff branch in popup
  - key: L
    context: localBranches
    command: >
      attyx popup "git log --oneline --graph {{.SelectedLocalBranch.Name}}..HEAD" --width 80 --height 70
    description: Log in popup
```

### vim / neovim — terminal-aware commands

Add Neovim commands that use Attyx IPC to run things in adjacent panes instead of the built-in terminal. In your `init.lua`:

```lua
-- Run the current file in a split, reuse the pane if it exists
local run_pane = nil
vim.keymap.set("n", "<leader>r", function()
  local file = vim.fn.expand("%:p")
  if run_pane then
    -- Reuse existing pane: Ctrl-C, then rerun
    vim.fn.system('attyx send-keys -p ' .. run_pane .. ' "{Ctrl-c}"')
    vim.fn.system('attyx send-keys -p ' .. run_pane .. ' "' .. file .. '{Enter}"')
  else
    run_pane = vim.fn.system("attyx split v --cmd " .. vim.fn.shellescape(file)):gsub("%s+", "")
  end
end, { desc = "Run file in Attyx split" })

-- Run tests for the current file in a popup
vim.keymap.set("n", "<leader>t", function()
  local file = vim.fn.expand("%:t:r")  -- filename without extension
  vim.fn.system('attyx popup "make test TEST=' .. file .. '" --width 90 --height 80')
end, { desc = "Test in popup" })

-- Open lazygit in a popup
vim.keymap.set("n", "<leader>g", function()
  vim.fn.system("attyx popup lazygit --width 90 --height 90")
end, { desc = "lazygit popup" })
```

### fzf — preview and open in splits

Use `attyx` as an action target in [fzf](https://github.com/junegunn/fzf) to open results directly in managed panes. Add to your shell rc:

```bash
# fzf file finder that opens results in a split editor
fe() {
  local file
  file=$(fzf --preview 'bat --color=always {}' --preview-window=right:60%)
  [ -n "$file" ] && attyx split v --cmd "nvim $file"
}

# fzf git log browser — view selected commit diff in a popup
fgl() {
  local commit
  commit=$(git log --oneline --color=always | \
    fzf --ansi --preview 'git show --color=always {1}' --preview-window=right:60% | \
    awk '{print $1}')
  [ -n "$commit" ] && attyx popup "git show $commit | delta" --width 90 --height 85
}

# fzf process killer with confirmation in a popup
fkill() {
  local pid
  pid=$(ps aux | fzf --header='Select process to kill' | awk '{print $2}')
  [ -n "$pid" ] && attyx popup "kill -15 $pid && echo 'Sent SIGTERM to $pid' && sleep 2"
}
```

### k9s — custom actions via Attyx

Configure [k9s](https://github.com/derailed/k9s) plugins to use Attyx popups for log viewing and shell access. Add to `~/.config/k9s/plugins.yaml`:

```yaml
plugins:
  attyx-logs:
    shortCut: l
    description: Stream logs in popup
    scopes:
      - pods
      - containers
    command: attyx
    args:
      - popup
      - "kubectl logs -f --tail=100 $NAME -n $NAMESPACE -c $COL-NAME"
      - --width
      - "90"
      - --height
      - "80"
  attyx-shell:
    shortCut: s
    description: Shell into pod via popup
    scopes:
      - pods
      - containers
    command: attyx
    args:
      - popup
      - "kubectl exec -it $NAME -n $NAMESPACE -c $COL-NAME -- sh"
      - --width
      - "85"
      - --height
      - "80"
  attyx-describe:
    shortCut: d
    description: Describe resource in popup
    scopes:
      - all
    command: attyx
    args:
      - popup
      - "kubectl describe $RESOURCE_NAME $NAME -n $NAMESPACE | less"
      - --width
      - "80"
      - --height
      - "70"
```

### Shell aliases

Useful shell functions that combine common tools with Attyx IPC. Add to your `.zshrc` or `.bashrc`:

```bash
# Open a man page in a popup
man() { attyx popup "command man $*" --width 85 --height 85 2>/dev/null || command man "$@"; }

# Quick note — opens $EDITOR in a popup on a scratch file
note() { attyx popup "${EDITOR:-vim} ~/notes/$(date +%Y-%m-%d).md" --width 70 --height 60; }

# SSH into a host in a new tab, named after the host
ssht() { attyx tab create --cmd "ssh $1" && attyx tab rename "$1"; }

# Docker logs in a popup
dlog() { attyx popup "docker logs -f --tail 100 $1" --width 90 --height 80; }
```

See also: [Agent Workflows](/docs/agent-workflows/) for using AI agents with Attyx IPC.
