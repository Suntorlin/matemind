import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Matemind',
  description: 'The first mate for your AI coding agents.',
  base: '/docs/',

  head: [
    ['link', { rel: 'icon', href: '/docs/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Quick Start', link: '/guide/quick-start' },
      { text: 'GitHub', link: 'https://github.com/matemind/matemind', target: '_blank' }
    ],

    sidebar: [
      { text: 'Quick Start', link: '/guide/quick-start' },
      { text: 'Installation', link: '/guide/installation' },
      { text: 'PWA', link: '/guide/pwa' },
      { text: 'How it Works', link: '/guide/how-it-works' },
      { text: 'Cursor Agent', link: '/guide/cursor' },
      { text: 'Voice Assistant', link: '/guide/voice-assistant' },
      { text: 'Why Matemind', link: '/guide/why-matemind' },
      { text: 'FAQ', link: '/guide/faq' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/matemind/matemind' }
    ],

    footer: {
      message: 'Released under the AGPL-3.0 License. Derived from hapi and haqi.',
      copyright: 'Copyright © 2024-present'
    },

    search: {
      provider: 'local'
    }
  },

  vite: {
    server: {
      allowedHosts: true
    }
  }
})
