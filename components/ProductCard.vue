<template>
  <div class="product-card bg-white rounded-lg overflow-hidden">
    <div class="relative pb-[100%] group">
      <img 
        :src="currentImage.sourceUrl" 
        :alt="currentImage.altText || product.name"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      <div v-if="hasGallery" class="absolute bottom-2 left-2 flex space-x-1">
        <button 
          v-for="(image, index) in galleryImages" 
          :key="index"
          @click="currentImageIndex = index"
          class="w-2 h-2 rounded-full transition-colors duration-300"
          :class="currentImageIndex === index ? 'bg-white' : 'bg-white/50'"
        ></button>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{{ product.name }}</h3>
      <div class="flex flex-col space-y-2">
        <div class="flex items-center space-x-2">
          <p class="text-lg font-semibold text-gray-900">
            {{ product.price }} ₽
          </p>
          <p v-if="product.regularPrice" class="text-sm text-gray-500 line-through">
            {{ product.regularPrice }} ₽
          </p>
        </div>
        <button 
          @click="addToCart"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <span>В корзину</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ProductImage {
  sourceUrl: string;
  altText: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  regularPrice?: string;
  image: ProductImage;
  galleryImages?: {
    nodes: ProductImage[];
  };
}

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['addToCart']);

const currentImageIndex = ref(0);

const galleryImages = computed(() => {
  const images = [props.product.image];
  if (props.product.galleryImages?.nodes) {
    images.push(...props.product.galleryImages.nodes);
  }
  return images;
});

const currentImage = computed(() => galleryImages.value[currentImageIndex.value]);

const hasGallery = computed(() => galleryImages.value.length > 1);

const addToCart = () => {
  emit('addToCart', props.product);
};
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 