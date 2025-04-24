// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2025-04-24',
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    // приватные значения (server-only) можно указать здесь
    public: {
      // названия после public будут доступны в браузере
      graphqlHttp: process.env.NUXT_PUBLIC_GRAPHQL_HTTP,
      graphqlWs: process.env.NUXT_PUBLIC_GRAPHQL_WS
    }
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_HTTP || 'https://wp.chinpoko.ru/graphql'
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
      '@apollo/client',
      '@vue/apollo-composable',
      'ts-invariant/process',
    ]
  },
  typescript: {
    strict: true
  }
})