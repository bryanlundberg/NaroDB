import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NaroDB",
  description: "A lightweight NoSQL database that encode and decode MessagePack binaries.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sitemap: {
      hostname: 'https://naro-db.vercel.app',
    },
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    nav: [
      { text: 'Get Started', link: '/getting-started' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Usage', link: '/usage' }
        ]
      },
      {
        text: 'How it works',
        items: [
          { text: 'How NaroDB works', link: '/how-it-works' },
          { text: 'MessagePack', link: '/messagepack' },
          { text: 'Storage', link: '/storage' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Naro', link: '/api-reference/classes/Naro' },
          { text: 'NaroDocument', link: '/api-reference/interfaces/NaroDocument' },
          { text: 'NaroDBServer', link: '/api/narodbsserver' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bryanlundberg/NaroDB' }
    ],
    footer: {
      message: 'Released under the SSPL License.',
      copyright: 'Copyright © 2025-present Bryan Lundberg'
    },
    search: {
      provider: 'local'
    },
  },
})
