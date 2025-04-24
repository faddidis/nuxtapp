<template>
  <div class="container mx-auto px-4 py-16 text-center">
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
</template>

<script setup lang="ts">
const router = useRouter();

const navigateToCatalog = () => {
  router.push('/catalog');
};
</script> 