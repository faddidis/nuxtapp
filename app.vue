<template>
  <div>
    <ClientOnly>
      <AppNavigation />
      <template #fallback>
        <!-- Optional: Placeholder while the navigation is loading -->
        <div class="h-16 bg-gray-200 animate-pulse"></div> 
      </template>
    </ClientOnly>
    <CartWidget ref="cartWidget" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppNavigation from '~/components/AppNavigation.vue'

const cartWidget = ref(null);
</script>
