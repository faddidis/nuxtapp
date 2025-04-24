import { ref, computed } from 'vue'

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

export const useCart = () => {
  const items = ref<CartItem[]>([])

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
        image: product.image
      })
    }
  }

  const removeFromCart = (productId: string) => {
    items.value = items.value.filter(item => item.id !== productId)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
    }
  }

  const totalItems = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0
    )
  )

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  }
} 