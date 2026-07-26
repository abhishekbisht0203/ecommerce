import { useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import CartHeader from '../components/cart/CartHeader'
import CartItemCard from '../components/cart/CartItemCard'
import ShippingProgress from '../components/cart/ShippingProgress'
import OrderSummary from '../components/cart/OrderSummary'
import EmptyCart from '../components/cart/EmptyCart'

const SHIPPING_COST = 10
const FREE_SHIPPING_THRESHOLD = 150

export default function Cart() {
  const { items, fetchCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const originalTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const origPrice =
          item.discountPercentage > 0
            ? item.price / (1 - item.discountPercentage / 100)
            : item.price
        return sum + origPrice * item.quantity
      }, 0),
    [items]
  )

  const discount = Math.max(originalTotal - subtotal, 0)
  const tax = subtotal * 0.05
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + tax + shipping

  if (items.length === 0) return <EmptyCart />

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <CartHeader itemCount={items.length} />

        <div className="mt-6">
          <ShippingProgress subtotal={subtotal} threshold={FREE_SHIPPING_THRESHOLD} />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left column — Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={() => increaseQuantity(item.id)}
                  onDecrease={() => decreaseQuantity(item.id)}
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right column — Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              discount={discount}
              itemCount={items.length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
