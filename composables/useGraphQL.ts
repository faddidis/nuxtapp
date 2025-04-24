import { useRuntimeConfig } from '#app'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

export const useGraphQL = () => {
  const config = useRuntimeConfig()
  const endpoint = '/graphql' // Используем прокси-эндпоинт

  const execute = async <T>(query: string, variables?: Record<string, any>): Promise<GraphQLResponse<T>> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.errors) {
        console.error('GraphQL Errors:', data.errors)
        throw new Error(data.errors[0].message)
      }

      return data
    } catch (error) {
      console.error('GraphQL Error:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack)
        return { errors: [{ message: error.message }] }
      }
      return { errors: [{ message: 'Произошла ошибка при выполнении запроса' }] }
    }
  }

  return {
    execute,
  }
} 