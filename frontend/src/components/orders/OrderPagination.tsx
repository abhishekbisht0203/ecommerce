import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface Props {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function OrderPaginationInner({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }: Props) {
  const getPageNumbers = useCallback(() => {
    const pages: (number | '...')[] = []
    const delta = 1
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }, [currentPage, totalPages])

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6"
    >
      {/* Rows Per Page */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1.5 rounded-lg bg-white/70 backdrop-blur-sm border border-purple-100/50
                     text-gray-700 text-sm font-medium
                     focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
          aria-label="Rows per page"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {/* Page Numbers */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-9 h-9 rounded-xl flex items-center justify-center
                     bg-white/70 backdrop-blur-sm border border-purple-100/50
                     text-gray-500 hover:text-purple-600 hover:border-purple-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
          aria-label="Previous page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </motion.button>

        {pageNumbers.map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200
                ${currentPage === page
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/70 backdrop-blur-sm border border-purple-100/50 text-gray-600 hover:text-purple-600 hover:border-purple-200'
                }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </motion.button>
          )
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-9 h-9 rounded-xl flex items-center justify-center
                     bg-white/70 backdrop-blur-sm border border-purple-100/50
                     text-gray-500 hover:text-purple-600 hover:border-purple-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
          aria-label="Next page"
        >
          <FiChevronRight className="w-4 h-4" />
        </motion.button>
      </nav>
    </motion.div>
  )
}

const OrderPagination = memo(OrderPaginationInner)
export default OrderPagination
