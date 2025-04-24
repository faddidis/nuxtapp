<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ClientOnly>
        <div class="space-y-4">
          <img 
            :src="currentImage?.sourceUrl" 
            :alt="currentImage?.altText || product?.name"
            class="w-full h-auto rounded-lg"
          />
          <div v-if="product?.galleryImages?.nodes?.length" class="grid grid-cols-4 gap-2">
            <img 
              v-for="(image, index) in product.galleryImages.nodes" 
              :key="index"
              :src="image.sourceUrl"
              :alt="image.altText"
              class="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
              @click="setCurrentImage(image)"
            />
          </div>
        </div>
      </ClientOnly>
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ product?.name }}</h1>
        <div class="flex items-center space-x-4">
          <p class="text-2xl font-semibold text-gray-900">
            {{ formatPrice(product?.price) }} ₽
          </p>
          <p v-if="product?.regularPrice && product.regularPrice !== product.price" class="text-lg text-gray-500 line-through">
            {{ formatPrice(product?.regularPrice) }} ₽
          </p>
        </div>
        <div class="prose max-w-none" v-html="product?.description"></div>
        <button 
          @click="addToCart"
          class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <span>Добавить в корзину</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '~/composables/useQuery'
import { useCart } from '~/composables/useCart'

const route = useRoute()
const slug = route.params.slug as string

const PRODUCT_QUERY = `
  query GetProduct($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      description
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
    }
  }
`

const { data, loading, error, fetch } = useQuery<{
  product: {
    id: string
    name: string
    description: string
    price: string
    regularPrice: string
    salePrice: string
    stockStatus: string
    image: {
      sourceUrl: string
      altText: string
    }
    galleryImages: {
      nodes: Array<{
        sourceUrl: string
        altText: string
      }>
    }
  }
}>(PRODUCT_QUERY, { slug })

// Вызываем fetch() сразу после создания запроса
fetch()

const product = computed(() => data.value?.product)

const currentImage = ref<{ sourceUrl: string; altText: string } | null>(null)

watch(product, (newProduct) => {
  if (newProduct?.image) {
    currentImage.value = newProduct.image
  }
}, { immediate: true })

const setCurrentImage = (image: { sourceUrl: string; altText: string }) => {
  currentImage.value = image
}

const formatPrice = (price?: string) => {
  if (!price) return '0'
  return parseFloat(price).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

const { addToCart: addToCartStore } = useCart()

const addToCart = () => {
  if (product.value) {
    addToCartStore(product.value)
    console.log('Товар добавлен в корзину:', product.value.name)
  }
}

watch(data, (newData) => {
  console.log('GraphQL response:', newData)
}, { immediate: true })

watch(error, (newError) => {
  console.log('GraphQL error:', newError)
}, { immediate: true })
</script> 