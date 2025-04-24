import { ref } from 'vue'
import type { Ref } from 'vue'
import { useGraphQL } from './useGraphQL'

export function useQuery<T>(query: string, variables?: Record<string, any>) {
  const { execute } = useGraphQL()
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await execute<T>(query, variables)
      
      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      data.value = response.data || null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных'
      console.error('Query Error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    fetch
  }
} 