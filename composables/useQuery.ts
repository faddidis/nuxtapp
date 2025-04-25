import { ref } from 'vue'
import type { Ref } from 'vue'
import { useGraphQL } from './useGraphQL'
import { useNuxtApp } from '#app'

export function useQuery<T>(query: string, variables?: Record<string, any>) {
  const { execute } = useGraphQL()
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nuxtApp = useNuxtApp()
  const isServer = process.server

  const fetch = async () => {
    loading.value = true
    error.value = null

    try {
      // Добавляем журналирование для отладки
      console.log(`Fetching query${isServer ? ' (SSR)' : ' (client)'}:`, query.substring(0, 50) + '...')
      
      const response = await execute<T>(query, variables)
      
      if (response.errors && response.errors.length > 0) {
        const errorMessages = response.errors.map(e => e.message).join(', ')
        throw new Error(errorMessages)
      }

      data.value = response.data || null
      
      // Журналируем полученные данные
      if (data.value) {
        console.log(`Query data${isServer ? ' (SSR)' : ' (client)'}:`, 
          JSON.stringify(data.value).substring(0, 100) + '...')
      } else {
        console.warn(`Query returned no data${isServer ? ' (SSR)' : ' (client)'}`)
      }
    } catch (err) {
      let errorMessage = 'Произошла ошибка при загрузке данных'
      
      if (err instanceof Error) {
        errorMessage = err.message
        
        // Специальная обработка ошибки URL
        if (errorMessage.includes('Failed to parse URL')) {
          console.error('URL Parse Error. Возможно, неправильно настроен эндпоинт GraphQL.')
          
          // Если на сервере, пытаемся использовать абсолютный URL
          if (isServer) {
            errorMessage += ' (Ошибка настройки эндпоинта GraphQL на сервере)'
          }
        }
      }
      
      error.value = errorMessage
      console.error(`Query Error${isServer ? ' (SSR)' : ' (client)'}:`, err)
      
      // Если мы на клиенте и произошла ошибка - пробуем повторить запрос через 1 секунду
      if (!isServer && nuxtApp.isHydrating) {
        console.log('Retrying query after hydration error...')
        setTimeout(() => fetch(), 1000)
      }
    } finally {
      loading.value = false
    }
  }

  // Если мы на клиенте и компонент гидратируется
  if (!isServer && nuxtApp.isHydrating) {
    // Запускаем запрос после завершения гидратации
    setTimeout(() => fetch(), 100)
  }

  return {
    data,
    loading,
    error,
    fetch
  }
} 