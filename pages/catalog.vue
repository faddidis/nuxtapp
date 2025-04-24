<template>
  <div class="catalog">
    <div v-for="product in products" :key="product.id" class="product-card">
      <img :src="product.image" :alt="product.name" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }}</p>
      <button @click="addToCart(product)">Добавить в корзину</button>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10) {
      nodes {
        id
        name
        price
        image {
          uri
        }
      }
    }
  }
`;

const { result } = useQuery(GET_PRODUCTS);

const products = result?.products?.nodes || [];

const addToCart = (product) => {
  // �огика добавления товара в корзину
};
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
