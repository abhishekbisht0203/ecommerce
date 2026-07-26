import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, fetchCart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ firstName: '', lastName: '', address: '', city: '', state: '', zip: '', country: '' })
  const [payWithRazorpay, setPayWithRazorpay] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const shipping = 10
  const total = subtotal + tax + shipping

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve) => {
      if ((window as any).Razorpay) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve()
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    const addrFields = [address.firstName, address.lastName, address.address, address.city, address.state, address.zip, address.country]
    if (addrFields.some((f) => !f.trim())) {
      toast.error('Please fill all billing address fields')
      return
    }
    if (!payWithRazorpay) {
      toast.error('Please select Razorpay as payment method')
      return
    }

    setLoading(true)
    try {
      await loadRazorpayScript()
      const res = await api.get('/payment/')
      const data = res.data

      const options = {
        key: data.razorpay_key_id,
        amount: data.amount * 100,
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
        prefill: { name: `${address.firstName} ${address.lastName}`, contact: '', email: '' },
        theme: { color: '#3399cc' },
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
    return <div className="text-center py-20 text-gray-500">Your cart is empty. <a href="/" className="text-blue-600 underline">Shop now</a></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <img src={item.thumbnail || ''} alt={item.title} className="h-12 w-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity} x ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="font-medium">₹{shipping}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-base font-medium pt-2 border-t mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={payWithRazorpay} onChange={(e) => setPayWithRazorpay(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <span className="ml-3 text-sm font-medium text-gray-700">Pay with Razorpay</span>
                </label>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">First name</label>
                    <input value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Last name</label>
                    <input value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">State / Province</label>
                    <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                    <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
                      <option value="">Select a country</option>
                      <option>India</option>
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
