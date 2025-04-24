import { GraphQLClient } from 'graphql-request'

declare module '#app' {
  interface NuxtApp {
    $graphql: {
      default: GraphQLClient
      [key: string]: GraphQLClient
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $graphql: {
      default: GraphQLClient
      [key: string]: GraphQLClient
    }
  }
} 