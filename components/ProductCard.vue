<template>
  <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="relative pb-[100%]">
      <img 
        :src="product.image?.sourceUrl || '/placeholder.jpg'" 
        :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ product.name }}</h3>
      <div class="flex justify-between items-center">
        <p class="text-gray-600" v-if="product.price">
          {{ product.price }} ₽
        </p>
        <button 
          @click="addToCart"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          В корзину
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  price: string;
  image?: {
    sourceUrl: string;
  };
}

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['addToCart']);

const addToCart = () => {
  emit('addToCart', props.product);
};
</script> 