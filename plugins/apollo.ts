import { defineNuxtPlugin } from '#app'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

export default defineNuxtPlugin((nuxtApp) => {
  const apolloClient = new ApolloClient({
    uri: 'https://wp.chinpoko.ru/graphql', // Замените на ваш реальный эндпоинт
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })

  nuxtApp.vueApp.provide('apollo', apolloClient)
}) 