<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Каталог товаров</h1>
    <div v-if="loading" class="text-center py-8">
      <p class="text-xl text-gray-600">Загрузка товаров...</p>
    </div>
    <div v-else-if="error" class="text-center py-8">
      <p class="text-xl text-red-600">Произошла ошибка при загрузке товаров</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '#imports'
import { useQuery } from '#imports'
import gql from 'graphql-tag'

const PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      nodes {
        id
        name
        ... on SimpleProduct {
          price
          regularPrice
        }
        image {
          sourceUrl
        }
      }
    }
  }
`

const { result, loading, error } = useQuery(PRODUCTS_QUERY)

const products = computed(() => result.value?.products?.nodes || [])

const handleAddToCart = (product: any) => {
  // TODO: Реализовать добавление в корзину
  console.log('Добавление в корзину:', product)
}
</script>

<style scoped>
.catalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}
</style>
