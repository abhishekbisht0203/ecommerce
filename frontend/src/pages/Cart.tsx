import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'

export default function Cart() {
  const { items, fetchCart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const shipping = 10

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  useEffect(() => {
    const sub = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const t = sub * 0.05
    setSubtotal(sub)
    setTax(t)
    setTotal(sub + t + shipping)
  }, [items])

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen py-10 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-8">Your Shopping Cart</h2>

        <div className="flex flex-col space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-4 w-full md:w-2/3">
                <img
                  src={item.thumbnail || '/images/fallback.jpg'}
                  alt={item.title}
                  className="h-24 w-24 object-cover rounded-lg border"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                  {item.discountPercentage > 0 && (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      {Math.round(item.discountPercentage)}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="flex items-center border rounded-lg overflow-hidden divide-x divide-gray-300">
                  <button className="px-3 py-1 text-lg hover:bg-gray-100" onClick={() => decreaseQuantity(item.id)}>
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 text-center">{item.quantity}</span>
                  <button className="px-3 py-1 text-lg hover:bg-gray-100" onClick={() => increaseQuantity(item.id)}>
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-lg font-semibold text-indigo-600">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  className="text-red-600 hover:text-red-800 font-medium"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-10">
          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-5 text-gray-700">Order Summary</h3>
            <div className="flex justify-between mb-3 text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-600">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-600">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4 text-gray-800">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <button className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                Proceed to Checkout &rarr;
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
