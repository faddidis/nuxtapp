<template>
  <div class="container mx-auto px-4 py-16">
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold mb-8">Добро пожаловать в наш магазин</h1>
      <p class="text-xl text-gray-600 mb-8">
        Здесь вы найдете широкий ассортимент товаров по выгодным ценам
      </p>
      <button 
        @click="navigateToCatalog"
        class="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-300"
      >
        Перейти в каталог
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <p class="text-xl text-gray-600">Загрузка категорий...</p>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <p class="text-xl text-red-600">Произошла ошибка при загрузке категорий</p>
      <p class="text-sm text-gray-500 mt-2">{{ error.message }}</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        @click="navigateToCategory(category.slug)"
      >
        <div class="relative pb-[100%]">
          <div class="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span class="text-4xl">📦</span>
          </div>
        </div>
        <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div class="text-center text-white">
            <h3 class="text-2xl font-bold mb-2">{{ category.name }}</h3>
            <p class="text-sm">{{ category.count }} товаров</p>
            <div 
              class="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-300 inline-block"
            >
              Смотреть товары
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '#imports'
import gql from 'graphql-tag'
import { useRouter } from 'vue-router'

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image?: {
    sourceUrl: string;
  };
}

interface CategoryEdge {
  node: Category;
}

const router = useRouter()

const CATEGORIES_QUERY = gql`
  query GetCategories {
    productCategories(first: 6, where: { parent: 0 }) {
      edges {
        node {
          id
          name
          slug
          count
          image {
            sourceUrl
          }
        }
      }
    }
  }
`

const { result, loading, error } = useQuery(CATEGORIES_QUERY)

const categories = computed(() => {
  try {
    return result.value?.productCategories?.edges?.map((edge: CategoryEdge) => edge.node) || []
  } catch (e) {
    console.error('Ошибка при обработке категорий:', e)
    return []
  }
})

const navigateToCatalog = () => {
  router.push('/catalog')
}

const navigateToCategory = (slug: string) => {
  router.push({
    path: '/catalog',
    query: { category: slug }
  })
}
</script>

<style scoped>
.category-card {
  transition: transform 0.2s ease-in-out;
}

.category-card:hover {
  transform: translateY(-5px);
}
</style> 