// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/main.sass'],
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/fonts',
  ],
  // 建置時下載字型檔、和網站一起部署，頁面不再向 Google Fonts 請求
  fonts: {
    defaults: { weights: [400], styles: ['normal'] },
    families: [
      { name: 'Nunito', weights: [400, 700] },
      // @nuxt/fonts 只會自動下載 font-family 列表的第一個字型，排第二的要標成 global
      { name: 'Huninn', global: true },
    ],
  },
  // 用 Node 內建的 node:sqlite，不必裝 better-sqlite3 原生套件
  content: {
    experimental: { sqliteConnector: 'native' },
    build: { markdown: { highlight: { theme: 'monokai' } } },
  },
  site: {
    url: 'https://celia-blog.vercel.app',
  },
  gtag: {
    id: 'G-D5BG0PXWCQ',
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },
  vite: {
    esbuild: {
      drop: process.env.VITE_DEBUG_MODE ? [] : ['console', 'debugger'],
    },
  },
  app: {
    head: {
      title: `Celia's Note`,
      htmlAttrs: {
        lang: 'zh-Hant-TW',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            '主要記錄工作遇到的問題以及技術筆記，也希望能幫助到偶然來到這的人！',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '個人網站, Nuxt 3, SEO, 前端, frontend',
        },
        {
          name: 'google-site-verification',
          content: 'RxsAX-B4Wx58KvSm9bLHxM7AwMSsw3SvJnwoSrcgg1I',
        },
        {
          property: 'og:image',
          content:
            'https://celia-portfolio-website.vercel.app/project/project_3.jpg',
        },
      ],
      script: [],
    },
  },
})
