---
name: Attyx
description: GPU-accelerated, agent-aware terminal — a dark operator console for driving and observing AI agents.
colors:
  ink: "#f0f0f0"
  black: "#0a0a0a"
  gray-100: "#e0e0e0"
  gray-200: "#c0c0c0"
  gray-300: "#a0a0a0"
  gray-400: "#808080"
  gray-500: "#606060"
  gray-600: "#404040"
  gray-700: "#2a2a2a"
  gray-800: "#1a1a1a"
  gray-900: "#111111"
  signal-amber: "#fbbf24"
  status-red: "#ff5f57"
  status-yellow: "#febc2e"
  status-green: "#28c840"
typography:
  display:
    fontFamily: "Space Mono, monospace"
    fontSize: "clamp(2rem, 6vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  heading:
    fontFamily: "Space Mono, monospace"
    fontSize: "2.2rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Mono, monospace"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.2em"
rounded:
  sm: "0.375rem"
  md: "0.75rem"
  full: "9999px"
spacing:
  section: "8rem"
  block: "3rem"
  card: "1.75rem"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.black}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gray-300}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 2rem"
  install-block:
    backgroundColor: "{colors.gray-900}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1rem 1.25rem"
  feature-cell:
    backgroundColor: "{colors.black}"
    textColor: "{colors.gray-500}"
    rounded: "0"
    padding: "1.75rem 2rem"
  badge-pill:
    backgroundColor: "{colors.gray-900}"
    textColor: "{colors.gray-400}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.625rem"
---

# Design System: Attyx

## 1. Overview

**Creative North Star: "The Operator Console"**

Attyx's surface is a dark control panel for someone driving machines — and increasingly, driving *agents*. The whole system is built on schematic discipline: a near-black ground, an ambient engineering grid, corner coordinates, numbered parts, hairline dividers, and a single typeface that never breaks character. It reads like the precise technical drawing of an instrument, not a marketing page about one. The product tracks AI agent lifecycle (thinking / waiting / done), drives panes over IPC, and exposes a CLI for orchestration — so the site itself should feel like the console an operator watches those agents from: exact, legible, alive only where state changes.

The palette is **Phosphor & Graphite** — white-as-phosphor signal glowing against a graphite-to-carbon ramp. White (`#f0f0f0`) is the only "color"; everything else is a degree of grey falling toward true black. There is no second hue carrying brand meaning. Emphasis is engineered from weight, spacing, and contrast, never from a palette swatch. The few chromatic moments (a star's amber, the macOS traffic-light triad on a window chrome) are quotations of real UI, not decoration.

This system **explicitly rejects**: generic SaaS gradient heroes and gradient text; warm cream / parchment "editorial-restraint" palettes (the 2026 AI default); loud neon-green "hacker movie" cyberpunk and CRT-scanline cosplay; and heavy enterprise chrome (mega-nav, comparison tables, logo walls). Terminal-native, never terminal cosplay.

**Key Characteristics:**
- True-black ground (`#0a0a0a`) with a single phosphor ink (`#f0f0f0`).
- One typeface — Space Mono — across display, body, and code. No pairing.
- Schematic motifs: ambient grid, corner coordinates, numbered features, hairline rules.
- Flat by default; one dramatic shadow lifts the product screenshot off the page.
- Quiet at rest, tactile on interaction — hover inverts, reveals a line, fills white.
- Agent-aware framing: the console watches and drives; restraint is the operator's calm.

## 2. Colors

A pure-neutral grayscale on a near-black ground, with white as the sole accent and three borrowed status hues used only as literal UI quotations.

### Primary
- **Phosphor White** (`#f0f0f0`): The signal. Headings, primary text, the hover-fill on primary buttons, logo wordmark. This is the only color that means "attention." It is never pure `#ffffff` — the slight pull-back keeps it from glaring against the black.

### Neutral
- **True Black** (`#0a0a0a`): The body ground and feature-cell fill. Everything sits on this.
- **Carbon** (`#111111` / gray-900): Raised surfaces — install blocks, badges, the screenshot window body. The first step up from the ground.
- **Iron** (`#1a1a1a` / gray-800): Dividers and section borders — the hairline structure of the schematic.
- **Slate** (`#2a2a2a` / gray-700): Resting borders on interactive chrome (buttons-secondary, badge outlines, install panels).
- **Graphite** (`#404040` / gray-600): Coordinate labels, the faint corner readouts, the dimmest legible marks.
- **Ash** (`#606060` / gray-500): Body copy inside feature cells, captions, fine print. *Watch this one* — on `#0a0a0a` it is near the AA floor for small text.
- **Smoke** (`#808080` / gray-400): Secondary body copy, the muted second line of the hero headline.
- **Fog** (`#a0a0a0` / gray-300) → **Mist** (`#c0c0c0` / gray-200) → **Frost** (`#e0e0e0` / gray-100): The brightening steps toward the ink, used for hover targets and emphasized inline text.

### Tertiary (borrowed status hues — UI quotations only)
- **Signal Amber** (`#fbbf24`): The single functional non-neutral — the GitHub star glyph in the stats badge. Earns its place because it quotes GitHub's own star.
- **Traffic Lights** (`#ff5f57` red · `#febc2e` yellow · `#28c840` green): The macOS window-control triad on the product screenshot's title bar. A literal quotation of real chrome. Never used as a brand palette.

### Named Rules
**The One Signal Rule.** Phosphor White is the only color that carries meaning. If a screen needs "emphasis," it comes from weight, size, or contrast against graphite — never from introducing a hue. The day a brand teal or accent blue appears, the schematic is broken.

**The Quotation Rule.** Chromatic color (amber, traffic lights) is permitted *only* when it quotes a real interface element the user already recognizes. Decorative color is forbidden.

## 3. Typography

**Display Font:** Space Mono (with `monospace` fallback)
**Body Font:** Space Mono (with `monospace` fallback)
**Label/Mono Font:** Space Mono — there is no separate mono; the whole system already is.

**Character:** One monospaced voice end to end. Space Mono's slab-serif terminals and fixed advance width give the page a typewritten, instrument-readout precision — every glyph sits on a grid, which is the entire point. No pairing, no contrast axis; the discipline *is* the single family in two weights (400 / 700) plus italic.

### Hierarchy
- **Display** (700, `clamp(2rem, 6vw, 4.2rem)`, line-height 1.1, `-0.03em`): The hero headline only. Two lines, the second dimmed to Smoke. Ceiling stays well under the shouting threshold.
- **Heading** (700, ~2.2rem, line-height 1.3, `-0.02em`): Section titles ("Try Attyx").
- **Title** (700, ~1.2rem, line-height 1.3): Feature names, footer wordmark, nav brand.
- **Body** (400, 0.95rem, line-height 1.7): Descriptive copy. Cap measure at 65–75ch (`max-w-[560px]` on the hero does this). Mid-grey on black — keep it toward the ink end where contrast is close.
- **Label** (400, 0.8rem, `0.2em` tracking, often UPPERCASE): The schematic readouts — section kickers ("FEATURES"), spec strip, coordinate marks, install-panel caption. Wide tracking is what makes them read as instrument labels, not headings.

### Named Rules
**The One Voice Rule.** Space Mono everywhere, no exceptions. The temptation to add a "clean sans for body" is the thing that would make Attyx look like every other tool. The monospace *is* the brand.

**The Readout Rule.** Anything functioning as a label, coordinate, or status readout takes `0.2em` tracking and usually uppercase. Tracking signals "machine output"; body copy stays at normal tracking so it never gets mistaken for chrome.

## 4. Elevation

Flat by default. Depth is carried almost entirely by hairline borders (`#1a1a1a`–`#2a2a2a`) and one-step tonal shifts (a `#111111` surface on a `#0a0a0a` ground), not shadow. Surfaces sit *in* the schematic, coplanar, separated by line weight the way an engineering drawing separates parts.

There is exactly **one deliberate exception**: the product screenshot. It gets a deep, soft, far-offset shadow that lifts it off the page as the one tangible object in an otherwise flat field — the thing the whole console is pointing at. A faint blurred gradient "glow" sits beneath it to complete the float.

A second, quieter elevation tool is **backdrop blur**, used functionally (not decoratively) on the fixed nav and the install panels so content scrolls legibly beneath them.

### Shadow Vocabulary
- **Hero Lift** (`box-shadow: 0 30px 80px -20px rgba(0,0,0,0.8)`): The single structural shadow, on the product screenshot frame only.
- **Functional Blur** (`backdrop-filter: blur(...)` on `bg-black/85`): Nav and install-panel legibility, not aesthetics.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are coplanar and separated by hairlines. A drop shadow anywhere except the hero screenshot is a bug. If a card needs a shadow to read, the border or tonal step is wrong — fix that instead.

## 5. Components

Quiet at rest, tactile on interaction. Every interactive element is near-invisible chrome until you touch it — then it inverts, fills, or reveals a line. The payoff is in the state change, not the resting state.

### Buttons
- **Shape:** Gently rounded (`0.375rem` / rounded-md). Pill radius is reserved for badges.
- **Primary:** Transparent fill, `#606060` (gray-500) hairline border, Phosphor White text, padding `0.8rem 2rem`. On **hover** it *inverts* — fills Phosphor White, text flips to True Black, border goes white. The single most tactile moment on the page.
- **Secondary / Ghost:** Transparent, dimmer `#2a2a2a` (gray-700) border, Fog text. Hover brightens text to white and the border to gray-500. No fill — it stays subordinate to primary.
- **Transition:** ~200ms on color/background. No transform bounce.

### Badges (stats pills)
- **Style:** Carbon (`#111111`) fill, `#2a2a2a` hairline, fully rounded (`9999px`), Smoke text, tiny inline SVG glyph. The star badge carries the one Signal Amber.
- **State:** Hidden until their data loads (`data-[loaded]`), then fade in — never show a placeholder dash as final state. Hover brightens border and text.

### Cards / Feature Cells
- **Corner Style:** Square (0 radius). The cells tile edge-to-edge separated by a 1px Iron gap on a gray-800 grid — a contact sheet, not a set of floating cards.
- **Background:** True Black at rest; warms to `#0e0e0e` on hover.
- **Signature behavior:** On hover a 1px Slate hairline draws in along the cell's left inner edge (top 20% → bottom 20%) — a schematic "you are here" mark. Numbered `01`–`12` in Graphite tabular-nums; heading brightens to white.
- **Shadow Strategy:** None. See Flat-By-Default.
- **Internal Padding:** `1.75rem`–`2rem` (card spacing).

### Install Block (signature component)
- The brand's hero affordance: a faux terminal window. Carbon body, `#2a2a2a` border, `0.75rem` radius, backdrop blur, max-width 420px.
- **Title bar:** three muted dots (gray-600 — *not* the macOS triad here; deliberately monochrome), an uppercase "INSTALL" readout, and a copy button on the right.
- **Body:** `$` prompts in Ash, commands in Phosphor White, monospace at `0.82rem`.
- **Copy button:** ghost border, "copy" → "copied" state swap on click, 2s revert.

### Window Frame (product screenshot)
- Carbon body, `#2a2a2a` border, `0.75rem` radius, the **macOS traffic-light triad** in real color (this is where the quotation lives), an "attyx" readout in mono. Carries the one Hero Lift shadow.

### Navigation
- **Style:** Fixed top, `bg-black/85` + backdrop blur, single Iron bottom border. Logo mark + Space Mono wordmark left; text links (Docs / Blog / GitHub) right in Fog, hover to white.
- **Mobile:** Links shrink to label size and stay inline — no hamburger; the nav is short enough to survive.

### Section Label (signature readout)
- A recurring schematic header: an uppercase `0.2em`-tracked kicker ("FEATURES") + a flex-1 hairline rule + a count number in Graphite. This is the *one* deliberate "labels everywhere" system — earned because it reads as instrument annotation, and it carries a real count.

## 6. Do's and Don'ts

### Do:
- **Do** keep True Black (`#0a0a0a`) as the ground and Phosphor White (`#f0f0f0`) as the only accent. Emphasis comes from weight and contrast.
- **Do** set everything in Space Mono. Display, body, code, labels — one voice.
- **Do** give labels, coordinates, and status readouts `0.2em` tracking (usually uppercase) so they read as machine output.
- **Do** keep surfaces flat and separated by hairline borders (`#1a1a1a`–`#2a2a2a`); reserve the one deep shadow for the product screenshot.
- **Do** make the payoff the *state change* — invert the primary button, draw the feature-cell hairline, fill on hover. Quiet at rest, alive on touch.
- **Do** earn every motif. The grid, coordinates, numbered features, and install-block chrome each carry information or quote real UI. If a motif is purely decorative, cut it.
- **Do** lean the positioning into agent workflows where copy allows — agent-status tracking, IPC orchestration, the `attyx` CLI. The console *watches and drives*.
- **Do** verify body text hits WCAG AA (≥4.5:1). Ash (`#606060`) and Smoke (`#808080`) on `#0a0a0a` are close — bump toward the ink end when a block is small or long.

### Don't:
- **Don't** introduce a second brand hue. No accent blue, teal, or "primary" color — that breaks the One Signal Rule. Chromatic color is allowed *only* as a quotation (amber star, traffic lights).
- **Don't** use gradient text or `background-clip: text`. Emphasis is weight and size, never a gradient.
- **Don't** drift toward warm cream / parchment / "editorial-restraint" near-white palettes — the 2026 AI default. This system is black-grounded, full stop.
- **Don't** tip into neon-green-on-black hacker cosplay, matrix rain, or heavy CRT scanlines. Terminal-native ≠ terminal cosplay.
- **Don't** add SaaS gradient heroes, hero-metric templates, identical floating card grids, or enterprise chrome (mega-nav, comparison tables, logo walls).
- **Don't** pair Space Mono with a "clean sans for readability." The monospace is the brand; a sans body would make Attyx look like everything else.
- **Don't** add drop shadows to cards or panels. If a surface won't read flat, fix the border or tonal step — don't reach for elevation.
- **Don't** ship animations without a `prefers-reduced-motion: reduce` alternative. The boot sequence, hero stagger, and feature hovers all need a crossfade/instant fallback (currently missing — fix on the next pass).
