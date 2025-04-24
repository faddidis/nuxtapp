<template>
  <div v-if="cart.length" class="cart">
    <h2>Ваша корзина</h2>
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - {{ item.price }} x {{ item.quantity }}
        <button @click="removeFromCart(item)">Удалить</button>
      </li>
    </ul>
    <p>Итого: {{ totalPrice }}</p>
    <button @click="checkout">Оформить заказ</button>
  </div>
  <p v-else>Ваша корзина пуста</p>
</template>

<script setup>
import { ref } from 'vue';

const cart = ref([]);

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter(cartItem => cartItem.id !== item.id);
};

const checkout = () => {
  // �огика оформления заказа
};
</script>

<style scoped>
.cart {
  border: 1px solid #ccc;
  padding: 1rem;
}
</style>
