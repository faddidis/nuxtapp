// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  target: 'server',
  devtools: { enabled: true },
  compatibilityDate: '2025-04-24',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/apollo'
  ],
  runtimeConfig: {
    // приватные значения (server-only) можно указать здесь
    public: {
      // названия после public будут доступны в браузере
      graphqlHttp: process.env.GRAPHQL_HTTP || 'https://wp.chinpoko.ru/graphql'
    }
  },
  nitro: {
    devProxy: {
      '/graphql': {
        target: process.env.GRAPHQL_HTTP || 'https://wp.chinpoko.ru/graphql',
        changeOrigin: true,
        secure: false
      }
    }
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: '/graphql'
      }
    }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  build: {
    transpile: [
      'ts-invariant/process',
    ]
  },
  typescript: {
    strict: true
  }
})