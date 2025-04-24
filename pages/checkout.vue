<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Оформление заказа</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Форма оформления заказа -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <form @submit.prevent="submitOrder" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              id="name"
              v-model="order.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Электронная почта
            </label>
            <input
              id="email"
              v-model="order.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              id="phone"
              v-model="order.phone"
              type="tel"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
              Адрес доставки
            </label>
            <textarea
              id="address"
              v-model="order.address"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Подтвердить заказ
          </button>
        </form>
      </div>

      <!-- Сводка заказа -->
      <div class="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 class="text-xl font-semibold mb-4">Ваш заказ</h2>
        <div class="space-y-4">
          <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-4 py-2 border-b">
            <img :src="item.image?.sourceUrl || '/placeholder.jpg'" :alt="item.name" class="w-16 h-16 object-cover rounded" />
            <div class="flex-1">
              <h4 class="text-sm font-medium">{{ item.name }}</h4>
              <p class="text-sm text-gray-600">{{ item.price }} ₽</p>
            </div>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t">
          <div class="flex justify-between items-center text-lg font-semibold">
            <span>Итого:</span>
            <span>{{ totalPrice }} ₽</span>
          </div>
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

interface OrderForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Здесь должны быть данные из хранилища корзины
const cartItems = ref<CartItem[]>([]);

const order = ref<OrderForm>({
  name: '',
  email: '',
  phone: '',
  address: ''
});

const totalPrice = computed(() => {
  return cartItems.value
    .reduce((total, item) => total + parseFloat(item.price), 0)
    .toFixed(2);
});

const submitOrder = async () => {
  try {
    // TODO: Реализовать отправку заказа через GraphQL мутацию
    console.log('Отправка заказа:', {
      ...order.value,
      items: cartItems.value,
      totalPrice: totalPrice.value
    });
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);
  }
};
</script>
  