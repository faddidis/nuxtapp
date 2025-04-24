// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  //…
  runtimeConfig: {
    // приватные значения (server-only) можно указать здесь
    public: {
      // названия после public будут доступны в браузере
      graphqlHttp: process.env.NUXT_PUBLIC_GRAPHQL_HTTP,
      graphqlWs: process.env.NUXT_PUBLIC_GRAPHQL_WS
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/apollo',
    '@nuxtjs/tailwindcss'
  ],
  apollo: {
    clients: {
      default: {
        // берем значения прямо из process.env для сборки,
        // но можно передать useRuntimeConfig() в плагине
        httpEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_HTTP,
        wsEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_WS
      }
    }
  },
  css: ['~/assets/css/main.css'],
})