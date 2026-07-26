import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { DummyProduct } from '../types/product'
import type { CartItem } from '../types/cart'

interface CartContextType {
  items: CartItem[]
  count: number
  loading: boolean
  fetchCart: () => void
  addToCart: (product: DummyProduct) => void
  removeFromCart: (productId: number) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
}

const CartContext = createContext<CartContextType | null>(null)

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const fetchCart = useCallback(() => {
    setLoading(true)
    setItems(loadCart())
    setLoading(false)
  }, [])

  const addToCart = (product: DummyProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price * (1 - product.discountPercentage / 100),
          thumbnail: product.thumbnail,
          discountPercentage: product.discountPercentage,
          stock: product.stock,
          quantity: 1,
        },
      ]
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  const increaseQuantity = (productId: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    )
  }

  const decreaseQuantity = (productId: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

  return (
    <CartContext.Provider value={{ items, count, loading, fetchCart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
