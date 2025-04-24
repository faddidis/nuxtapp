import { ApolloClient } from '@apollo/client/core'
import { inject } from 'vue'

export function useApollo() {
  const apolloClient = inject('apollo') as ApolloClient<any>
  
  if (!apolloClient) {
    throw new Error('Apollo client not found')
  }
  
  return apolloClient
} 