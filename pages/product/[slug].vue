<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      {{ error.message || 'Произошла ошибка при загрузке товара' }}
    </div>
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <NuxtImg 
          v-if="currentImage?.sourceUrl"
          :src="currentImage.sourceUrl"
          :alt="currentImage.altText || product.name"
          class="w-full h-auto rounded-lg"
          sizes="100vw md:50vw lg:400px"
          loading="eager"
          preload
          format="webp"
        />
        <div v-if="product.galleryImages?.nodes?.length" class="grid grid-cols-4 gap-2">
          <ClientOnly>
            <template #default>
              <NuxtImg 
                v-for="(image, index) in product.galleryImages.nodes" 
                :key="index"
                :src="image.sourceUrl"
                :alt="image.altText || product.name"
                class="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                sizes="100px"
                loading="lazy"
                format="webp"
                @click="setCurrentImage(image)"
              />
            </template>
            <template #fallback>
              <div v-for="i in 4" :key="i" class="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
            </template>
          </ClientOnly>
        </div>
      </div>
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
        <div class="flex items-center space-x-4">
          <p class="text-2xl font-semibold text-gray-900">
            {{ formatPrice(product.price) }} ₽
          </p>
          <p v-if="product.regularPrice && product.regularPrice !== product.price" class="text-lg text-gray-500 line-through">
            {{ formatPrice(product.regularPrice) }} ₽
          </p>
        </div>
        <div class="prose max-w-none" v-html="product.description"></div>
        <ClientOnly>
          <button 
            @click="addToCart"
            class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            :disabled="!product || product.stockStatus === 'OUT_OF_STOCK'"
          >
            <span v-if="product?.stockStatus !== 'OUT_OF_STOCK'">Добавить в корзину</span>
            <span v-else>Нет в наличии</span>
            <svg v-if="product?.stockStatus !== 'OUT_OF_STOCK'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </button>
          <template #fallback>
            <div class="w-full bg-gray-300 h-12 rounded-lg animate-pulse"></div>
          </template>
        </ClientOnly>
      </div>
    </div>
    <div v-else class="text-center py-8">
      <p>Товар не найден</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData, useHead, useNuxtApp } from '#imports'
import { useCart } from '~/composables/useCart'
import { useGraphQL } from '~/composables/useGraphQL'

interface ProductImageData {
  sourceUrl: string;
  altText: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  stockStatus: string;
  image: ProductImageData | null;
  galleryImages: {
    nodes: ProductImageData[];
  } | null;
}

interface GraphQLResponse {
  data: {
    product: ProductData | null;
  };
  errors?: Array<{ message: string }>;
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const nuxtApp = useNuxtApp()
const { execute } = useGraphQL()
const { addToCart: addToCartStore } = useCart()

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

const { data: asyncData, pending, error, refresh } = await useAsyncData<ProductData | null>(
  `product-${slug.value}`,
  async () => {
    const currentSlug = slug.value
    if (!currentSlug) {
      console.warn('useAsyncData handler called without a valid slug.')
      return null 
    }

    const response = await execute<GraphQLResponse>(PRODUCT_QUERY, { slug: currentSlug })
    
    if (response.errors && response.errors.length > 0) {
      console.error('GraphQL Error fetching product:', response.errors)
      throw new Error(response.errors.map(e => e.message).join(', '))
    }
    
    const productData = response.data?.product

    if (!productData) { 
      console.error('Product not found in GraphQL response', response)
      throw new Error('Товар не найден')
    }
    
    return productData
  },
  {
    watch: [slug]
  }
)

const product = computed(() => asyncData.value)

const currentImage = ref<ProductImageData | null>(null)

watch(product, (newProduct: ProductData | null) => {
  if (newProduct?.image) {
    currentImage.value = newProduct.image
  } else {
    currentImage.value = null
  }
}, { immediate: true })

const setCurrentImage = (image: ProductImageData) => {
  currentImage.value = image
}

const formatPrice = (price?: string) => {
  if (!price) return '0'
  return parseFloat(price).toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

const addToCart = () => {
  if (product.value && product.value.stockStatus !== 'OUT_OF_STOCK') {
    addToCartStore({
      id: product.value.id,
      name: product.value.name,
      slug: slug.value,
      price: product.value.price,
      regularPrice: product.value.regularPrice,
      image: product.value.image ? { ...product.value.image } : undefined,
    })
    console.log('Товар добавлен в корзину:', product.value.name)
  }
}

useHead(() => ({
  title: product.value?.name ? `${product.value.name} | My Store` : 'Loading product...',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: product.value?.description
        ? product.value.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
        : 'Loading product description...'
    }
  ]
}))
</script> 