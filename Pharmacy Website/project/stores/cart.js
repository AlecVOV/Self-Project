import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    itemCount: (state) => state.items.length,
    
    total: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    },
  },
  
  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        })
      }
    },
    
    updateQuantity(index, quantity) {
      if (this.items[index]) {
        this.items[index].quantity = quantity
      }
    },
    
    removeItem(index) {
      this.items.splice(index, 1)
    },
    
    clearCart() {
      this.items = []
    },
    
    async addToCart(product, quantity) {
      if (!product) return
      
      this.addItem(product, quantity)
      
      // Use toast notification instead of alert
      const { useNotificationsStore } = await import('~/stores/notifications')
      const notifications = useNotificationsStore()
      notifications.success(`${product.name} added to cart!`)
    }
  },
})