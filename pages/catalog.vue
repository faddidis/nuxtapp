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
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <div v-else-if="categoriesError || productsError" class="text-red-500">
          Произошла ошибка при загрузке данных
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in transformedProducts"
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
import { computed, ref, onMounted, useRoute } from '#imports'
import { useQuery } from '#imports'
import { useCart } from '~/composables/useCart'
import ProductCard from '~/components/ProductCard.vue'

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

const route = useRoute()
const sortBy = ref('price-asc')
const selectedCategories = ref<string[]>([])

// Проверка параметров URL
onMounted(() => {
  const categoryParam = route.query.category as string
  if (categoryParam) {
    selectedCategories.value = [categoryParam]
  }
})

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

// Используем мемоизированные вычисления для фильтрации и сортировки
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

const { addToCart } = useCart()

const handleAddToCart = (product: Product) => {
  addToCart(product)
  console.log('Товар добавлен в корзину:', product.name)
}

const transformedProducts = computed(() => {
  return filteredProducts.value.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    regularPrice: product.regularPrice,
    image: product.image || { sourceUrl: '', altText: '' },
    stockStatus: product.stockStatus
  }))
})

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
