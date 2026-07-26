import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface WishlistContextType {
  ids: number[]
  count: number
  toggle: (productId: number) => void
  isWishlisted: (productId: number) => boolean
  fetchWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | null>(null)

function loadWishlist(): number[] {
  try {
    const stored = localStorage.getItem('wishlist')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>(loadWishlist)

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(ids))
  }, [ids])

  const fetchWishlist = useCallback(() => {
    setIds(loadWishlist())
  }, [])

  const toggle = (productId: number) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const isWishlisted = (productId: number) => ids.includes(productId)

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
