<template>
  <div class="container mx-auto px-4 py-16">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Фильтры -->
      <div class="w-full md:w-1/4">
        <div class="sticky top-4">
          <h2 class="text-xl font-bold mb-4">Категории</h2>
          <div class="space-y-2">
            <div v-for="category in categories" :key="category.id" class="flex items-center">
              <input
                :id="category.slug"
                v-model="selectedCategories"
                type="checkbox"
                :value="category.slug"
                class="mr-2"
              />
              <label :for="category.slug">{{ category.name }}</label>
            </div>
          </div>

          <h2 class="text-xl font-bold mt-8 mb-4">Сортировка</h2>
          <select v-model="sortBy" class="w-full p-2 border rounded">
            <option value="price-asc">По цене (возрастание)</option>
            <option value="price-desc">По цене (убывание)</option>
          </select>
        </div>
      </div>

      <!-- Товары -->
      <div class="w-full md:w-3/4">
        <div v-if="categoriesLoading || productsLoading" class="text-center">
          Загрузка...
        </div>

        <div v-else-if="categoriesError || productsError" class="text-red-500">
          Произошла ошибка при загрузке данных
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="border rounded-lg overflow-hidden"
          >
            <router-link :to="`/product/${product.slug}`">
              <img
                v-if="product.image"
                :src="product.image.sourceUrl"
                :alt="product.image.altText"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                <div class="mt-2">
                  <span class="text-xl font-bold">{{ product.price }}</span>
                  <span
                    v-if="product.regularPrice !== product.price"
                    class="ml-2 text-gray-500 line-through"
                  >
                    {{ product.regularPrice }}
                  </span>
                </div>
              </div>
            </router-link>
            <button
              @click="handleAddToCart(product)"
              class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from '#imports'
import { useQuery } from '#imports'

interface Category {
  id: string
  name: string
  slug: string
  count?: number
}

interface ProductImage {
  sourceUrl: string
  altText: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: string
  regularPrice: string
  salePrice: string
  stockStatus: string
  image?: ProductImage
  productCategories?: {
    edges: Array<{
      node: Category
    }>
  }
}

const CATEGORIES_QUERY = `
  query GetCategories {
    productCategories {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`

const PRODUCTS_QUERY = `
  query GetProducts {
    products(first: 100) {
      edges {
        node {
          id
          name
          slug
          image {
            sourceUrl
            altText
          }
          productCategories {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
            stockStatus
          }
          ... on VariableProduct {
            price
            regularPrice
            salePrice
            stockStatus
          }
        }
      }
    }
  }
`

const sortBy = ref('price-asc')
const selectedCategories = ref<string[]>([])

const { data: categoriesData, loading: categoriesLoading, error: categoriesError, fetch: fetchCategories } = useQuery<{
  productCategories: {
    edges: Array<{
      node: Category
    }>
  }
}>(CATEGORIES_QUERY)

const { data: productsData, loading: productsLoading, error: productsError, fetch: fetchProducts } = useQuery<{
  products: {
    edges: Array<{
      node: Product
    }>
  }
}>(PRODUCTS_QUERY)

const categories = computed(() => {
  try {
    if (!categoriesData.value?.productCategories?.edges) {
      return []
    }
    return categoriesData.value.productCategories.edges.map(edge => edge.node)
  } catch (error) {
    console.error('Ошибка при обработке категорий:', error)
    return []
  }
})

const products = computed(() => {
  try {
    if (!productsData.value?.products?.edges) {
      return []
    }
    return productsData.value.products.edges.map(edge => edge.node)
  } catch (error) {
    console.error('Ошибка при обработке товаров:', error)
    return []
  }
})

const filteredProducts = computed(() => {
  if (!products.value) return []
  
  let result = [...products.value]
  
  if (selectedCategories.value.length > 0) {
    result = result.filter(product => 
      product.productCategories?.edges.some(edge => 
        selectedCategories.value.includes(edge.node.slug)
      )
    )
  }
  
  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => {
      const priceA = parseFloat(a.price || '0')
      const priceB = parseFloat(b.price || '0')
      return priceA - priceB
    })
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => {
      const priceA = parseFloat(a.price || '0')
      const priceB = parseFloat(b.price || '0')
      return priceB - priceA
    })
  }
  
  return result
})

const handleAddToCart = (product: Product) => {
  console.log('Товар добавлен в корзину:', product.name)
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: translateY(-5px);
}
</style>
