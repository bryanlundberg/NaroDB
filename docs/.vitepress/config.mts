import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NaroDB",
  siteTitle: "NaroDB",
  logo: "/favicon.ico",
  lastUpdated: true,
  description: "A lightweight NoSQL database that encode and decode MessagePack binaries.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sitemap: {
      hostname: 'https://naro-db.vercel.app',
    },
    editLink: {
      pattern: 'https://github.com/bryanlundberg/NaroDB/tree/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    nav: [
      { text: 'Guide', link: '/installation' },
      { text: 'Examples', link: '/guides/index' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'About', link: '/about' },
          { text: 'Installation', link: '/installation' },
          { text: 'Usage', link: '/usage' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Getting Started', link: '/guides/index.md' },
          { text: 'Express.js', link: '/guides/express.md' },
          { text: 'Nest.js', link: '/guides/nestjs.md' }
        ],
      },
      {
        text: 'API Reference',
        items: [
          { text: 'get', link: '/api-reference/get' },
          { text: 'getAll', link: '/api-reference/getAll' },
          { text: 'add', link: '/api-reference/add' },
          { text: 'update', link: '/api-reference/update' },
          { text: 'delete', link: '/api-reference/delete' },
          { text: 'populate', link: '/api-reference/populate' },
          { text: 'populateCollection', link: '/api-reference/populateCollection' },
        ]
      },
      {
        text: 'Types Reference',
        items: [
          { text: 'NaroDocument', link: '/types-reference/naro-document' },
          { text: 'Operators', link: '/types-reference/operators' },
          { text: 'Filter', link: '/types-reference/filter' },
          { text: 'Limit', link: '/types-reference/limit' },
          { text: 'Options', link: '/types-reference/options' },
          { text: 'Query', link: '/types-reference/query' }
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
