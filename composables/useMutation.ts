import { ref } from 'vue'
import { useGraphQL } from './useGraphQL'

export function useMutation<T>(mutation: string) {
  const { execute } = useGraphQL()
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const mutate = async (variables?: Record<string, any>) => {
    loading.value = true
    error.value = null

    try {
      const response = await execute<T>(mutation, variables)
      
      if (response.errors) {
        throw new Error(response.errors[0].message)
      }

      data.value = response.data || null
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Произошла ошибка при выполнении операции'
      console.error('Mutation Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    mutate
  }
} 