import { defineNuxtPlugin } from '#app'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  
  const apolloClient = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  })

  nuxtApp.vueApp.provide('apollo', apolloClient)
}) 