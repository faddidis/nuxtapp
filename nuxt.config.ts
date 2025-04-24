// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2025-04-24',
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-graphql-request'
  ],
  runtimeConfig: {
    // приватные значения (server-only) можно указать здесь
    public: {
      // названия после public будут доступны в браузере
      graphqlHttp: process.env.GRAPHQL_HTTP || 'https://wp.chinpoko.ru/graphql'
    }
  },
  // @ts-ignore - игнорируем ошибку типизации для graphql конфигурации
  graphql: {
    clients: {
      default: {
        endpoint: process.env.GRAPHQL_HTTP || 'https://wp.chinpoko.ru/graphql',
        options: {
          credentials: 'same-origin',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      }
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
  },
  // Настройки для улучшения гидратации
  vue: {
    config: {
      performance: true
    }
  },
  app: {
    // Возможность повторного использования состояния после ошибок гидратации
    keepalive: true,
    head: {
      // Отключаем кэширование для предотвращения проблем с гидратацией
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { name: 'cache-control', content: 'no-cache' },
        { name: 'expires', content: '0' }
      ]
    }
  }
})