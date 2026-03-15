---
title: Agent Workflows
description: Use AI agents to orchestrate multi-pane workflows, parallelize tasks, and coordinate work across your terminal.
sidebar:
  order: 21
---

Attyx's IPC layer turns your terminal into a multi-agent workspace. An AI agent running in one pane can spawn others, delegate tasks, read their output, and coordinate results — all without human intervention.

These examples use [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with the [Attyx skill](/docs/claude-code/). Install it with `attyx skill install`.

## Parallel task delegation

Ask Claude to split work across multiple panes, each handling a different concern. Claude creates the panes, sends instructions, and aggregates results.

```
/attyx set up three splits:
  - left: run "npm run lint" and tell me if there are errors
  - middle: run "npm test" and summarize failures
  - right: run "npm run build" and report if it succeeds
wait for all three to finish, then give me a summary
```

Claude will:
1. Create three splits, capturing each pane ID
2. Send the commands via `send-keys -p`
3. Poll each pane with `get-text -p` until output stabilizes
4. Read and summarize the results in your original pane

## Specialized agent roles

Run multiple Claude Code instances in separate panes, each focused on a different role. The primary agent (yours) orchestrates via IPC.

```
/attyx open a split running "claude" — tell that Claude instance to review
the code in src/auth/ for security issues. meanwhile, I'll keep working here.
read its output when it's done and summarize the findings for me.
```

You can scale this to a team of agents:

```
/attyx set up a workspace:
  - split 1: run "claude" and ask it to write unit tests for src/api/
  - split 2: run "claude" and ask it to update the API docs in docs/api.md
  - split 3: run "claude" and ask it to check for unused dependencies
monitor all three. when each finishes, read its output and give me a report.
```

Each Claude instance runs independently in its own pane. Your primary instance sends prompts via `send-keys`, waits for output to settle with `get-text`, and coordinates the results.

## Watch and react

Have Claude monitor a running process and take action based on what it sees.

```
/attyx open a split running our dev server with "npm run dev".
watch its output — if you see an error, read the stack trace,
find the relevant file, and suggest a fix.
```

Claude will:
1. Open the dev server in a split
2. Periodically `get-text` from the pane
3. When an error appears, parse the stack trace
4. Read the relevant source files
5. Propose a fix in your conversation

This also works for watching build output, test runs, or deployment logs.

## Interactive debugging

Claude can drive debuggers and REPLs in adjacent panes while discussing the problem with you.

```
/attyx open a split with "node --inspect-brk src/server.js".
in another split, open "node inspect localhost:9229".
set a breakpoint at line 45 of server.js, continue execution,
and read the variable state when it hits.
```

Or with a database:

```
/attyx open a split with "psql -d myapp".
run the query from the bug report (SELECT * FROM orders WHERE status = 'stuck')
and show me the results. then check the related records in the payments table.
```

## Session-per-project agents

Assign each project its own session with a dedicated Claude agent doing background work.

```
/attyx create a background session for ~/Projects/api called "api-agent".
in that session, open claude and ask it to run the full test suite,
fix any failures, and commit the fixes. I'll check on it later.
```

Check progress from any session:

```
/attyx read the screen from the claude pane in the "api-agent" session
— what's it working on?
```

## Coordinated refactoring

Use multiple agents to refactor a codebase in parallel, with one agent verifying consistency.

```
/attyx set up this workflow:
  - split 1: run "claude" — have it rename all instances of "userId" to "user_id" in src/api/
  - split 2: run "claude" — have it do the same rename in src/workers/
  - split 3: run "claude" — have it update the database migration to rename the column
when all three are done, run the test suite and tell me if anything broke.
```

## Build → test → deploy pipeline

Chain steps across panes with Claude reading output and deciding the next step.

```
/attyx run "make build" in a split. if it succeeds, run the tests in another
split. if tests pass, open a popup with lazygit so I can review and push.
if anything fails, read the error output and help me fix it.
```

Claude drives the entire pipeline, reading exit status and output at each stage, and only proceeds when the previous step succeeds.
