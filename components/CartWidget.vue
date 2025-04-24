<template>
  <div class="fixed top-4 right-4 z-50">
    <button 
      @click="isOpen = !isOpen"
      class="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
    >
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="cartItemsCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {{ cartItemsCount }}
        </span>
      </div>
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4">
      <div v-if="cartItems.length === 0" class="text-center text-gray-500 py-4">
        Корзина пуста
      </div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 py-2 border-b">
          <img :src="item.image?.sourceUrl || '/placeholder.jpg'" :alt="item.name" class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <h4 class="text-sm font-medium">{{ item.name }}</h4>
            <p class="text-sm text-gray-600">{{ item.price }} ₽</p>
          </div>
          <button @click="removeFromCart(item)" class="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div class="mt-4">
          <div class="flex justify-between font-medium mb-4">
            <span>Итого:</span>
            <span>{{ totalPrice }} ₽</span>
          </div>
          <NuxtLink 
            to="/checkout"
            class="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Оформить заказ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image?: {
    sourceUrl: string;
  };
}

const isOpen = ref(false);
const cartItems = ref<CartItem[]>([]);

const cartItemsCount = computed(() => cartItems.value.length);

const totalPrice = computed(() => {
  return cartItems.value
    .reduce((total, item) => total + parseFloat(item.price), 0)
    .toFixed(2);
});

const removeFromCart = (item: CartItem) => {
  const index = cartItems.value.findIndex((cartItem) => cartItem.id === item.id);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

// Метод для добавления товара в корзину (будет вызываться из родительского компонента)
const addToCart = (item: CartItem) => {
  if (!cartItems.value.some((cartItem) => cartItem.id === item.id)) {
    cartItems.value.push(item);
  }
};

defineExpose({
  addToCart
});
</script> 