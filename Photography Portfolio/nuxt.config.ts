// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    '@vueuse/motion/nuxt'
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/animations.css'
  ],
  googleFonts: {
    families: {
      'Playfair+Display': [400, 500, 600, 700],
      'Montserrat': [300, 400, 500, 600]
    },
    display: 'swap'
  },
  content: {
    documentDriven: true
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Photography Portfolio',
      meta: [
        { name: 'description', content: 'Professional photography portfolio showcasing stunning visuals and artistic excellence' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})