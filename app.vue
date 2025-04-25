<template>
  <div>
    <AppNavigation />
    <CartWidget ref="cartWidget" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cartWidget = ref(null);
</script>
