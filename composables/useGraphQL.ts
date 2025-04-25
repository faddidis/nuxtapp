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

interface GraphQLError {
  message: string
  locations?: Array<{
    line: number
    column: number
  }>
  path?: string[]
}

export const useGraphQL = () => {
  const config = useRuntimeConfig()
  
  // На сервере используем полный URL, на клиенте - прокси
  const endpoint = process.server 
    ? config.public.graphqlHttp 
    : '/api/graphql' // Используем новый путь для прокси

  const execute = async <T>(query: string, variables?: Record<string, any>): Promise<GraphQLResponse<T>> => {
    // Для отладки
    console.log('GraphQL Query:', query)
    console.log('GraphQL Variables:', variables)
    console.log('Using GraphQL endpoint:', endpoint)
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Меняем настройки CORS в зависимости от среды
        credentials: process.server ? 'include' : 'same-origin',
        mode: process.server ? 'cors' : 'same-origin',
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HTTP Error Status:', response.status, response.statusText)
        console.error('Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Журналируем успешный ответ для отладки
      console.log('GraphQL Response:', data)
      
      if (data.errors && data.errors.length > 0) {
        console.error('GraphQL Errors:', data.errors)
        const errorMessage = data.errors.map((e: GraphQLError) => e.message).join(', ')
        throw new Error(`GraphQL Error: ${errorMessage}`)
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