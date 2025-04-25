import { defineEventHandler, readBody, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const graphqlEndpoint = config.public.graphqlHttp

  try {
    // Получаем тело запроса для POST
    const body = await readBody(event).catch(() => null)
    
    // Получаем параметры запроса для GET
    const query = getQuery(event)
    
    // Журналируем для отладки
    console.log('Server API proxy for GraphQL received request')
    console.log('Using GraphQL endpoint:', graphqlEndpoint || 'UNDEFINED URL')
    
    // Проверяем на пустой URL
    if (!graphqlEndpoint) {
      throw new Error('GraphQL endpoint URL is not defined')
    }
    
    // Выполняем запрос к GraphQL API
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      console.error(`GraphQL Proxy Error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error('Error Response:', errorText)
      
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
        message: `GraphQL API returned error: ${response.status} ${response.statusText}`
      })
    }
    
    // Возвращаем результат
    const data = await response.json()
    return data
  } catch (error) {
    console.error('GraphQL Proxy Error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Ошибка GraphQL прокси'
    })
  }
}) 