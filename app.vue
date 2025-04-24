<template>
  <div>
    <CartWidget ref="cartWidget" />
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cartWidget = ref(null);
</script>
