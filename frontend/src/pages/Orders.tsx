import { useEffect, useMemo, useState, useCallback } from 'react'
import api from '../api/axios'
import type { Order, OrderStatus } from '../types/order'
import AnimatedBackground from '../components/orders/AnimatedBackground'
import OrderHeader from '../components/orders/OrderHeader'
import OrderStatsRow from '../components/orders/OrderStatsRow'
import OrderFilters from '../components/orders/OrderFilters'
import OrderTable from '../components/orders/OrderTable'
import OrderCard from '../components/orders/OrderCard'
import OrderPagination from '../components/orders/OrderPagination'
import EmptyState from '../components/orders/EmptyState'

type SortKey = 'newest' | 'oldest' | 'amount-desc' | 'amount-asc'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All')
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get('/orders/')
      .then((res) => {
        if (cancelled) return
        const data: Order[] = Array.isArray(res.data)
          ? res.data
          : res.data?.orders ?? []
        setOrders(data)
      })
      .catch(() => {
        if (!cancelled) setOrders([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleFilterChange = useCallback((filter: OrderStatus | 'All') => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort as SortKey)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  const filteredOrders = useMemo(() => {
    let result = [...orders]
    if (activeFilter !== 'All') {
      result = result.filter((o) => o.status === activeFilter)
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.id - a.id
        case 'oldest': return a.id - b.id
        case 'amount-desc': return parseFloat(b.total) - parseFloat(a.total)
        case 'amount-asc': return parseFloat(a.total) - parseFloat(b.total)
        default: return 0
      }
    })
    return result
  }, [orders, activeFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  )

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + parseFloat(o.total), 0),
    pendingCount: orders.filter((o) => o.status === 'Pending').length,
    deliveredCount: orders.filter((o) => o.status === 'Delivered').length,
  }), [orders])

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="h-12 w-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl animate-pulse" />
            <div className="h-5 w-56 bg-gray-200 rounded-lg mt-3 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-96 bg-white/60 rounded-full animate-pulse mb-6" />
          <div className="h-96 rounded-2xl bg-white/60 animate-pulse" />
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <>
        <AnimatedBackground />
        <EmptyState />
      </>
    )
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderHeader />
          <OrderStatsRow {...stats} />
          <OrderFilters
            activeFilter={activeFilter}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
          <OrderTable orders={paginatedOrders} />
          <div className="flex flex-col gap-3 md:hidden">
            {paginatedOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>
          <OrderPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </>
  )
}
