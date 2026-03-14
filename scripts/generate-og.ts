import satori from "satori";
import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { createHash } from "crypto";

const ROOT = resolve(import.meta.dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const OUT_DIR = join(PUBLIC_DIR, "og");
const MANIFEST_PATH = join(OUT_DIR, ".manifest.json");

const WIDTH = 1200;
const HEIGHT = 630;

const force = process.argv.includes("--force");

// ── Manifest ────────────────────────────────────────────────

type Manifest = Record<string, string>;

function loadManifest(): Manifest {
  if (!existsSync(MANIFEST_PATH)) return {};
  try {
    return JSON.parse(readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function saveManifest(manifest: Manifest) {
  Bun.write(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function hashInputs(data: { title: string; description: string }): string {
  const h = createHash("sha256");
  h.update(data.title);
  h.update(data.description);
  return h.digest("hex").slice(0, 16);
}

// ── Fonts ───────────────────────────────────────────────────

const fontRegular = readFileSync(
  join(ROOT, "scripts/fonts/SpaceMono-Regular.ttf")
);
const fontBold = readFileSync(
  join(ROOT, "scripts/fonts/SpaceMono-Bold.ttf")
);
const fontInter = readFileSync(
  join(ROOT, "scripts/fonts/Inter-Regular.ttf")
);

// Load Attyx logo as base64
const logoPath = join(PUBLIC_DIR, "logos/Attyx.png");
const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`;

// ── Helpers ─────────────────────────────────────────────────

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

// ── Markup ──────────────────────────────────────────────────

function buildOgMarkup(opts: { title: string; description: string }) {
  const { title, description } = opts;

  return {
    type: "div" as const,
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        position: "relative" as const,
        backgroundColor: "#0a0a0a",
        fontFamily: "SpaceMono",
        overflow: "hidden",
      },
      children: [
        // Gradient background
        {
          type: "div" as const,
          props: {
            style: {
              position: "absolute" as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)",
              display: "flex",
            },
          },
        },
        // Subtle grid pattern
        {
          type: "div" as const,
          props: {
            style: {
              position: "absolute" as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.04,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              display: "flex",
            },
          },
        },
        // Content
        {
          type: "div" as const,
          props: {
            style: {
              position: "relative" as const,
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
              padding: "48px 64px",
              gap: 24,
            },
            children: [
              // Logo + name
              {
                type: "div" as const,
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  },
                  children: [
                    {
                      type: "img" as const,
                      props: {
                        src: logoBase64,
                        width: 44,
                        height: 44,
                        style: { borderRadius: 10 },
                      },
                    },
                    {
                      type: "span" as const,
                      props: {
                        style: {
                          fontSize: 24,
                          color: "#d4d4d4",
                          fontFamily: "SpaceMono",
                          letterSpacing: "0.02em",
                        },
                        children: "Attyx",
                      },
                    },
                  ],
                },
              },
              // Title + description
              {
                type: "div" as const,
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 16,
                    maxWidth: 960,
                  },
                  children: [
                    {
                      type: "div" as const,
                      props: {
                        style: {
                          fontSize: 48,
                          fontWeight: 700,
                          fontFamily: "SpaceMonoBold",
                          color: "#ffffff",
                          lineHeight: 1.2,
                          letterSpacing: "-0.02em",
                        },
                        children: truncate(title, 80),
                      },
                    },
                    {
                      type: "div" as const,
                      props: {
                        style: {
                          fontSize: 20,
                          color: "#9ca3af",
                          lineHeight: 1.6,
                          fontFamily: "Inter",
                        },
                        children: truncate(description, 140),
                      },
                    },
                  ],
                },
              },
              // Footer
              {
                type: "div" as const,
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  },
                  children: [
                    {
                      type: "div" as const,
                      props: {
                        style: {
                          fontSize: 14,
                          color: "#4b5563",
                          fontFamily: "SpaceMono",
                        },
                        children: "attyx.sh",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ── Generate ────────────────────────────────────────────────

async function generateOgImage(
  slug: string,
  data: { title: string; description: string }
) {
  const markup = buildOgMarkup(data);

  const svg = await satori(markup, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "SpaceMono",
        data: fontRegular,
        weight: 400,
        style: "normal",
      },
      {
        name: "SpaceMonoBold",
        data: fontBold,
        weight: 700,
        style: "normal",
      },
      {
        name: "Inter",
        data: fontInter,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();

  const outPath = join(OUT_DIR, `${slug}.png`);
  await Bun.write(outPath, png);
  return png.length;
}

// ── Main ────────────────────────────────────────────────────

type OgEntry = { slug: string; data: { title: string; description: string } };

async function main() {
  console.log(`\n  Generating OG images${force ? " (force)" : ""}…\n`);

  mkdirSync(OUT_DIR, { recursive: true });

  const oldManifest = loadManifest();
  const newManifest: Manifest = {};

  let generated = 0;
  let skipped = 0;

  const entries: OgEntry[] = [
    {
      slug: "main",
      data: {
        title: "Attyx",
        description:
          "GPU-accelerated, scriptable terminal environment. Built-in sessions, splits, IPC, and the attyx CLI for agentic workflows. Written in Zig, under 5MB.",
      },
    },
    {
      slug: "docs",
      data: {
        title: "Attyx Documentation",
        description:
          "Configuration, features, keybindings, IPC, and everything else you need to get started with Attyx.",
      },
    },
  ];

  for (const { slug, data } of entries) {
    const hash = hashInputs(data);
    newManifest[slug] = hash;

    const imageExists = existsSync(join(OUT_DIR, `${slug}.png`));

    if (!force && imageExists && oldManifest[slug] === hash) {
      console.log(`  · /og/${slug}.png (unchanged)`);
      skipped++;
      continue;
    }

    const size = await generateOgImage(slug, data);
    console.log(`  ✓ /og/${slug}.png (${(size / 1024).toFixed(0)}kb)`);
    generated++;
  }

  saveManifest(newManifest);

  console.log(`\n  Done — ${generated} generated, ${skipped} skipped.\n`);
}

main().catch((err) => {
  console.error("Failed to generate OG images:", err);
  process.exit(1);
});
