import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://attyx.sh",
  output: "static",

  integrations: [
    starlight({
      title: "Attyx",
      components: {
        Head: "./src/components/Head.astro",
      },
      customCss: ["./src/styles/docs.css"],
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: true,
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preload",
            as: "style",
            href: "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
          },
        },
        {
          tag: "script",
          content: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap';document.head.appendChild(l)})()`,
        },
      ],
      logo: {
        src: "./public/logos/Attyx.png",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/semos-labs/attyx",
        },
      ],
      sidebar: [
        { label: "Overview", link: "/docs/" },
        { label: "Configuration", link: "/docs/configuration/" },
        { label: "Font", link: "/docs/font/" },
        { label: "Cursor", link: "/docs/cursor/" },
        { label: "Window", link: "/docs/window/" },
        { label: "Shell", link: "/docs/shell/" },
        { label: "Scrollback", link: "/docs/scrollback/" },
        { label: "Themes", link: "/docs/themes/" },
        { label: "Keybindings", link: "/docs/keybindings/" },
        { label: "Custom Sequences", link: "/docs/custom-sequences/" },
        { label: "Tabs & Splits", link: "/docs/tabs-and-splits/" },
        { label: "Popups", link: "/docs/popups/" },
        { label: "Status Bar", link: "/docs/status-bar/" },
        { label: "Sessions", link: "/docs/sessions/" },
        { label: "Visual Mode", link: "/docs/visual-mode/" },
        { label: "Command Palette", link: "/docs/command-palette/" },
        { label: "CLI", link: "/docs/cli/" },
        { label: "Integration", link: "/docs/integration/" },
        { label: "Claude Code Skill", link: "/docs/claude-code/" },
        { label: "VT Compatibility", link: "/docs/vt-compatibility/" },
        { label: "Building from Source", link: "/docs/building/" },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
