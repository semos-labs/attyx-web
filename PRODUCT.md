# Product

## Register

brand

> Dual-surface project. The default register is **brand** (the marketing landing
> at `/` — design IS the product). The Starlight **docs** under `/docs/*` are a
> **product** surface (design serves reading and navigation). When a task targets
> docs, treat it as `product`; everything else defaults to `brand`.

## Users

Developers and power users who live in the terminal — the kind who tune their
shell, script their workflows, and care that a tool is fast and small. A growing
slice drive terminals programmatically: people wiring AI agents and scripts to
the `attyx` CLI / IPC layer. They arrive skeptical (they've seen a lot of
terminal projects), evaluate fast, and convert by reading real docs and trying
the install. Context: a laptop, probably a dark editor already open, low
tolerance for marketing fluff.

## Product Purpose

Attyx is a GPU-accelerated terminal built for the agentic era — **the operator
console for AI agents.** Its differentiator is that it's agent-aware end to end:
it tracks agent lifecycle natively (Claude / Codex via JSON lifecycle hooks,
opencode via an event-bus plugin) and surfaces run-state — thinking / waiting /
done — right in the tab and status bars; its IPC layer + `attyx` CLI (`agent`,
`watch`, `status`, `pane`, `read`, `split`, `send-keys`, `get-text`) let one
agent spawn, drive, and coordinate others across panes; it ships a Claude Code
skill (`attyx skill install`); and it speaks **MCP** natively — `attyx mcp` (a
stdio bridge, every platform) and an embedded loopback HTTP MCP server
(`http://127.0.0.1:7333/mcp`, POSIX) expose the full terminal surface (panes,
tabs, keystrokes, output, sessions, agent status, image injection) as typed
tools to Claude and any MCP client. The terminal fundamentals — sessions, splits, tabs, popups,
command palette, status bar — are all built in (no tmux + config pile). Written
in Zig, under 5MB, MIT-licensed, cross-platform (macOS / Linux / Windows). Part
of the Semos Labs constellation of terminal-native tools.

The site's job: convince a skeptical developer in under a minute that this is the
terminal built for running and watching agents — fast, small, genuinely
scriptable — then get them to install or read the docs. Lead with the agentic
angle (tracking, IPC, CLI orchestration); the terminal craft is the proof it's
solid, not the headline. Success = installs, GitHub stars, and docs engagement,
not time-on-page.

## Brand Personality

Precise · engineered · fast. Confident understatement — the product's specs do
the talking (Zig, <5MB, IPC + CLI, GPU backends). Voice is terse and technical,
zero hype, dry where it earns it. It should feel like the tool itself: low-level,
exact, and quietly fast. Show the engineering, don't sell it.

## Anti-references

Avoid all of these — they're the opposite of the brand:

- **Generic SaaS / gradient hero.** No purple-blue gradients, hero-metric
  templates, rounded-everything startup look, stock illustrations, gradient text.
- **Warm cream / editorial AI-slop.** No sand/parchment warm-neutral palettes,
  serif-magazine "restraint," the 2026 AI-default warm near-white body.
- **Loud neon / cyberpunk terminal.** No glowing neon-green-on-black "hacker
  movie" clichés, matrix rain, heavy CRT scanlines. Terminal-native ≠ terminal
  cosplay.
- **Heavy enterprise / corporate.** No dense mega-nav, feature-comparison tables,
  trust-badge logo walls, conversion-funnel heaviness.

## Design Principles

- **The tool is the pitch.** Specs, real install commands, and live data
  (GitHub stars, download counts) over adjectives. Show, don't tell.
- **Terminal-native, not terminal cosplay.** Monospace, black surface, traffic-
  light dots, coordinate labels — earned references, used with restraint. Never
  tip into neon/CRT kitsch.
- **Restraint is the accent.** Monochrome by default; white is the only "color."
  Emphasis comes from weight, spacing, and hierarchy, not hue.
- **Fast like the product.** Static, light, no heavy frameworks. The site should
  load as quickly as Attyx starts.
- **Earn every motif.** Numbered features, kicker labels, grain, boot sequence —
  each is deliberate and load-bearing, not scaffolding. If it doesn't carry
  information or identity, cut it.

## Accessibility & Inclusion

Target **WCAG AA**. Body text ≥4.5:1 against its background; large/bold text
≥3:1. Known risk to watch: the muted-gray-on-black body ramp (`--color-gray-400`
/ `-500` on `#0a0a0a`) sits near the AA line for small text — bump toward the
ink end where it's close rather than shipping elegant-but-unreadable gray. Every
animation (boot sequence, hero stagger, feature hovers) needs a
`prefers-reduced-motion: reduce` alternative. Keyboard-navigable, visible focus
states, real alt text on the screenshot.
