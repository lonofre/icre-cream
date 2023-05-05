// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "primevue/resources/primevue.css",
    "primeflex/primeflex.css",
    "~/assets/css/global.scss"
  ],
  build: {
    transpile: ["primevue"]
  },
  runtimeConfig: {
    API_BASE_URL: 'localhost:8000'
  },
  imports: {
    dirs: ['stores']
  },
  modules: [
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Roboto: true,
          prefetch: true,
          preconnect: true,
          preload: true
        }
      }
    ],
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUUpdate']
      }
    ]
  ],
  typescript: {
    typeCheck: true,
    strict: true
  },
})
