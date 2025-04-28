<template>
  <div class="container mx-auto px-4 py-16">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Фильтры -->
      <div class="w-full md:w-1/4">
        <div class="sticky top-4">
          <h2 class="text-xl font-bold mb-4">Категории</h2>
          <div v-if="categoriesLoading" class="text-gray-500">Загрузка...</div>
          <div v-else-if="categoriesError" class="text-red-500">Ошибка загрузки категорий</div>
          <div v-else class="space-y-2">
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
        <!-- Индикатор загрузки (первая загрузка) -->
        <div v-if="productsLoading && loadedProducts.length === 0" class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <!-- Ошибка загрузки -->
        <div v-else-if="productsError && loadedProducts.length === 0" class="text-red-500 text-center py-10">
          Произошла ошибка при загрузке товаров
        </div>

        <!-- Список товаров -->
        <div v-else-if="loadedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in loadedProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- Нет товаров -->
        <div v-else-if="!productsLoading" class="text-center text-gray-500 py-10">
          Товары пока не найдены. Ищем...
        </div>

        <!-- Кнопка Загрузить еще и индикатор подгрузки -->
        <div class="text-center mt-8">
          <button
            v-if="hasNextPage && !loadingMore"
            @click="loadMoreProducts"
            class="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors duration-300"
          >
            Загрузить еще
          </button>
          <div v-if="loadingMore" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, useRoute, reactive, watch } from '#imports'
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
  image?: ProductImage
  galleryImages?: {
    nodes: ProductImage[]
  }
}

interface PageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

interface ProductsData {
  products: {
    edges: Array<{ node: Product }>
    pageInfo: PageInfo
  }
}

interface CategoriesData {
  productCategories: {
    edges: Array<{ node: Category }>
  }
}

const route = useRoute()
const sortBy = ref('price-asc')
const selectedCategories = ref<string[]>([])
const loadedProducts = ref<Product[]>([])
const hasNextPage = ref(false)
const endCursor = ref<string | null>(null)
const loadingMore = ref(false)

onMounted(() => {
  const categoryParam = route.query.category as string
  if (categoryParam) {
    if (categoryParam && !selectedCategories.value.includes(categoryParam)) {
      selectedCategories.value = [categoryParam]
    }
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
  query GetProducts(
    $first: Int!
    $after: String
    $categoryIn: [String]
    $orderBy: [ProductsOrderbyInput!]
  ) {
    products(
      first: $first
      after: $after
      where: { categoryIn: $categoryIn, orderby: $orderBy }
    ) {
      edges {
        node {
          id
          name
          slug
          image {
            sourceUrl
            altText
          }
          galleryImages {
            nodes {
              sourceUrl
              altText
            }
          }
          ... on SimpleProduct {
            price
            regularPrice
          }
          ... on VariableProduct {
            price
            regularPrice
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

type OrderByInput = {
  field: string
  order: 'ASC' | 'DESC'
}

const variables = reactive({
  first: 20,
  after: null as string | null,
  categoryIn: [] as string[],
  orderBy: [] as OrderByInput[]
})

const { data: categoriesData, loading: categoriesLoading, error: categoriesError, fetch: fetchCategories } = useQuery<CategoriesData>(CATEGORIES_QUERY)

const { data: productsData, loading: productsLoading, error: productsError, fetch: fetchProducts } = useQuery<ProductsData>(
  PRODUCTS_QUERY,
  variables
)

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

watch(productsData, (newData) => {
  if (newData?.products?.edges) {
    const newProducts = newData.products.edges.map(edge => edge.node)
    if (variables.after === null) {
      loadedProducts.value = newProducts
    } else {
      loadedProducts.value.push(...newProducts)
    }
    hasNextPage.value = newData.products.pageInfo.hasNextPage
    endCursor.value = newData.products.pageInfo.endCursor
  }
  loadingMore.value = false
}, { deep: true })

watch([selectedCategories, sortBy], () => {
  variables.categoryIn = selectedCategories.value
  if (sortBy.value === 'price-asc') {
    variables.orderBy = [{ field: 'PRICE', order: 'ASC' }]
  } else if (sortBy.value === 'price-desc') {
    variables.orderBy = [{ field: 'PRICE', order: 'DESC' }]
  } else {
    variables.orderBy = []
  }

  variables.after = null
  loadedProducts.value = []
  hasNextPage.value = false
  endCursor.value = null

  fetchProducts()
}, { deep: true })

const loadMoreProducts = () => {
  if (!hasNextPage.value || loadingMore.value) return

  loadingMore.value = true
  variables.after = endCursor.value
  fetchProducts()
}

const { addToCart } = useCart()

const handleAddToCart = (product: Product) => {
  addToCart(product)
  console.log('Товар добавлен в корзину:', product.name)
}

onMounted(() => {
  fetchCategories()
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
