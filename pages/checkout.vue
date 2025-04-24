<template>
    <div class="checkout">
      <h2>Оформление заказа</h2>
      <form @submit.prevent="submitOrder">
        <div>
          <label for="name">Имя</label>
          <input id="name" v-model="order.name" required />
        </div>
        <div>
          <label for="email">Электронная почта</label>
          <input id="email" v-model="order.email" type="email" required />
        </div>
        <div>
          <label for="address">Адрес</label>
          <input id="address" v-model="order.address" required />
        </div>
        <button type="submit">Подтвердить заказ</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const order = ref({
    name: '',
    email: '',
    address: '',
  });
  
  const submitOrder = () => {
    // Логика отправки заказа
  };
  </script>
  
  <style scoped>
  .checkout {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  