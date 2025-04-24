import { ref, computed, watch, onMounted } from 'vue'

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: {
    sourceUrl: string;
    altText: string;
  };
}

// Ключ для localStorage
const CART_STORAGE_KEY = 'nuxt-shop-cart'

export const useCart = () => {
  const items = ref<CartItem[]>([])
  
  // Загрузка корзины из localStorage при инициализации
  onMounted(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (error) {
      console.error('Ошибка при загрузке корзины из localStorage:', error)
    }
  })
  
  // Сохранение корзины в localStorage при изменениях
  watch(items, (newItems) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
    } catch (error) {
      console.error('Ошибка при сохранении корзины в localStorage:', error)
    }
  }, { deep: true })

  const addToCart = (product: any) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || { sourceUrl: '', altText: '' }
      })
    }
  }

  const removeFromCart = (productId: string) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Если количество 0 или меньше, удаляем товар из корзины
      removeFromCart(productId)
      return
    }
    
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }
  
  const clearCart = () => {
    items.value = []
  }

  const totalItems = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((total, item) => 
      total + (parseFloat(item.price || '0') * item.quantity), 0
    )
  )
  
  const formattedTotalPrice = computed(() => {
    return totalPrice.value.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' ₽'
  })

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    formattedTotalPrice
  }
} 