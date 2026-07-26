import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

interface Order {
  id: number
  product: string
  quantity: number
  total: string
  status: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.get('/orders/').then((res) => {
      if (Array.isArray(res.data)) setOrders(res.data)
      else if (res.data.orders) setOrders(res.data.orders)
    })
  }, [])

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Shipped: 'bg-blue-100 text-blue-800',
      Delivered: 'bg-green-100 text-green-800',
    }
    return `inline-block ${colors[status] || 'bg-gray-100 text-gray-800'} text-xs font-semibold px-3 py-1 rounded-full`
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Order History</h2>
        <Link to="/" className="inline-block bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.product}</td>
                <td className="px-6 py-4">{order.quantity}</td>
                <td className="px-6 py-4 font-semibold text-green-600">₹{order.total}</td>
                <td className="px-6 py-4"><span className={statusBadge(order.status)}>{order.status}</span></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="text-center px-6 py-8 text-gray-500">You don't have any orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
