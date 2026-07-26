import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { FiUser, FiMapPin, FiMail, FiPhone, FiGlobe, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import CheckoutHeader from '../components/checkout/CheckoutHeader'
import OrderSummaryCard from '../components/checkout/OrderSummaryCard'
import PaymentMethods from '../components/checkout/PaymentMethods'
import { CheckoutInput, CheckoutSelect } from '../components/checkout/CheckoutInput'
import CheckoutButton from '../components/checkout/CheckoutButton'

export default function Checkout() {
  const { items, fetchCart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const shipping = subtotal >= 150 ? 0 : 10
  const total = subtotal + tax + shipping

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve) => {
      if ((window as any).Razorpay) { resolve(); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    const addrFields = [
      address.firstName, address.lastName, address.address,
      address.city, address.state, address.zip, address.country,
    ]
    if (addrFields.some((f) => !f.trim())) {
      toast.error('Please fill all billing address fields')
      return
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setLoading(true)
    try {
      await api.post('/sync-cart/', { items })
      await loadRazorpayScript()
      const res = await api.get('/payment/')
      const data = res.data

      const options = {
        key: data.razorpay_key_id,
        amount: data.amount_paisa,
        currency: 'INR',
        name: 'CADL',
        image: 'https://cadl.in/public/website/favicon2.png',
        order_id: data.order_id,
        handler: async (response: any) => {
          try {
            const callbackRes = await api.post('/payment/callback/', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            })
            if (callbackRes.data.status === 'success') {
              navigate(`/payment/success?payment_id=${response.razorpay_payment_id}`)
            } else {
              toast.error('Payment failed')
            }
          } catch {
            toast.error('Payment verification failed')
          }
        },
        modal: { ondismiss: () => navigate('/') },
        prefill: {
          name: `${address.firstName} ${address.lastName}`,
          contact: address.phone,
          email: address.email,
        },
        theme: { color: '#7C3AED' },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch {
      toast.error('Failed to initialize payment')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-purple-100/60 to-pink-100/30 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-purple-50/40 to-pink-50/20 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center px-6"
        >
          <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some items to get started with checkout</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <FiShoppingBag className="w-4 h-4" />
            Browse Products
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-purple-100/60 to-pink-100/30 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-gradient-to-tr from-purple-50/40 to-pink-50/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutHeader />

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1"
        >
          Checkout
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-gray-400 mb-10"
        >
          Complete your purchase securely
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <OrderSummaryCard
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Payment Method</h2>
              <PaymentMethods
                selected={paymentMethod}
                onSelect={(id) => setPaymentMethod(id)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CheckoutInput
                  label="First Name"
                  icon={<FiUser className="w-4 h-4" />}
                  value={address.firstName}
                  onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                />
                <CheckoutInput
                  label="Last Name"
                  icon={<FiUser className="w-4 h-4" />}
                  value={address.lastName}
                  onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                />
                <CheckoutInput
                  label="Email"
                  type="email"
                  icon={<FiMail className="w-4 h-4" />}
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                />
                <CheckoutInput
                  label="Phone"
                  type="tel"
                  icon={<FiPhone className="w-4 h-4" />}
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
                <div className="sm:col-span-2">
                  <CheckoutInput
                    label="Address"
                    icon={<FiMapPin className="w-4 h-4" />}
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  />
                </div>
                <CheckoutInput
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
                <CheckoutInput
                  label="State / Province"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
                <CheckoutInput
                  label="ZIP / Postal Code"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                />
                <CheckoutSelect
                  label="Country"
                  icon={<FiGlobe className="w-4 h-4" />}
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                >
                  <option value="">Select a country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                </CheckoutSelect>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { icon: '🛡️', label: 'Secure Payment' },
                { icon: '🔒', label: 'SSL Encrypted' },
                { icon: '🚚', label: 'Free Shipping' },
                { icon: '↩️', label: 'Easy Returns' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100"
                >
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-xs font-medium text-gray-600">{badge.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <CheckoutButton
                loading={loading}
                onClick={handlePayment}
              />
              <p className="text-center text-xs text-gray-400 mt-3">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
