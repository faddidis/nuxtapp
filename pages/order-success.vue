<template>
  <div class="container mx-auto px-4 py-16 text-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Заказ успешно оформлен!</h1>
      <p class="text-gray-600 mb-8">
        Спасибо за ваш заказ. Мы отправили подтверждение на вашу электронную почту.
      </p>
      <NuxtLink
        to="/catalog"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Вернуться в каталог
      </NuxtLink>
    </div>
  </div>
</template> 