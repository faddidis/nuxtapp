<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <h1 class="text-3xl font-bold">Аксессуары</h1>
      <div class="mt-4 md:mt-0">
        <select 
          v-model="sortBy"
          class="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="price_asc">По цене (возрастание)</option>
          <option value="price_desc">По цене (убывание)</option>
          <option value="name_asc">По названию (А-Я)</option>
          <option value="name_desc">По названию (Я-А)</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Фильтры -->
      <div class="w-full md:w-64 space-y-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-semibold mb-4">Категории</h3>
          <div class="space-y-2">
            <label v-for="category in categories" :key="category.id" class="flex items-center">
              <input 
                type="checkbox" 
                :value="category.slug"
                v-model="selectedCategories"
                class="mr-2"
              >
              {{ category.name }}
            </label>
          </div>
        </div>
      </div>

      <!-- Товары -->
      <div class="flex-1">
        <div v-if="loading" class="text-center py-8">
          <p class="text-xl text-gray-600">Загрузка товаров...</p>
        </div>
        <div v-else-if="error" class="text-center py-8">
          <p class="text-xl text-red-600">Произошла ошибка при загрузке товаров</p>
          <p class="text-sm text-gray-500 mt-2">{{ error.message }}</p>
        </div>
        <div v-else-if="filteredProducts.length === 0" class="text-center py-8">
          <p class="text-xl text-gray-600">Товары не найдены</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from '#imports'
import { useQuery } from '#imports'
import gql from 'graphql-tag'
import { useRoute } from 'vue-router'

const route = useRoute()
const sortBy = ref('price_asc')
const selectedCategories = ref<string[]>([])

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  parent?: {
    node: {
      id: string;
    };
  };
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  stockStatus: string;
  image?: {
    sourceUrl: string;
    altText: string;
  };
  productCategories?: {
    nodes: ProductCategory[];
  };
}

const CATEGORIES_QUERY = gql`
  query GetCategories {
    productCategories(first: 100, where: { parent: 0 }) {
      edges {
        node {
          id
          name
          slug
          count
          parent {
            node {
              id
            }
          }
        }
      }
    }
  }
`

const PRODUCTS_QUERY = gql`
  query GetProducts {
    products(first: 100) {
      nodes {
        id
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`

const { result: categoriesResult, loading: categoriesLoading } = useQuery(CATEGORIES_QUERY)
const { result, loading, error, refetch } = useQuery(PRODUCTS_QUERY)

const categories = computed(() => {
  try {
    return categoriesResult.value?.productCategories?.edges?.map((edge: { node: Category }) => edge.node) || []
  } catch (e) {
    console.error('Ошибка при обработке категорий:', e)
    return []
  }
})

const products = computed(() => {
  try {
    const nodes = result.value?.products?.nodes || []
    return nodes.map((node: Product) => ({
      ...node,
      price: node.price || '0',
      regularPrice: node.regularPrice || node.price || '0',
      salePrice: node.salePrice || node.price || '0',
      stockStatus: node.stockStatus || 'IN_STOCK'
    }))
  } catch (e) {
    console.error('Ошибка при обработке товаров:', e)
    return []
  }
})

const filteredProducts = computed(() => {
  let filtered = [...products.value]
  
  // Фильтрация по категориям
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(product => 
      product.productCategories?.nodes?.some(category => 
        selectedCategories.value.includes(category.slug)
      )
    )
  }
  
  // Сортировка
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'price_asc':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price_desc':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'name_asc':
        return a.name.localeCompare(b.name)
      case 'name_desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })
  
  return filtered
})

// Следим за изменениями в URL
watch(() => route.query.category, async (newCategory) => {
  if (newCategory) {
    const category = categories.value.find((cat: Category) => cat.slug === newCategory)
    if (category) {
      selectedCategories.value = [category.slug]
    }
  } else {
    selectedCategories.value = []
  }
}, { immediate: true })

const handleAddToCart = (product: Product) => {
  // TODO: Реализовать добавление в корзину
  console.log('Добавление в корзину:', product)
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
}
</style>
