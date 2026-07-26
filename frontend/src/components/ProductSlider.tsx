import { useRef, useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import type { DummyProduct } from '../types/product'

interface Props {
  title: string
  icon?: string
  products: DummyProduct[]
  viewAllLink?: string
}

function ProductSliderInner({ title, icon, products, viewAllLink }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [products])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (products.length === 0) return null

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5 px-1">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2"
        >
          {icon && <span>{icon}</span>}
          {title}
        </motion.h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-sm text-[#E53E3E] hover:text-black font-medium transition-colors hidden sm:block"
            >
              View All
            </Link>
          )}
          <div className="flex gap-1">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll right"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, i) => (
          <div key={product.id} className="min-w-[230px] sm:min-w-[250px] md:min-w-[270px] max-w-[270px] snap-start">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>

      {viewAllLink && (
        <div className="text-center mt-4 sm:hidden">
          <Link
            to={viewAllLink}
            className="inline-block text-sm text-[#E53E3E] font-medium hover:text-black transition-colors"
          >
            View All {title} &rarr;
          </Link>
        </div>
      )}
    </section>
  )
}

const ProductSlider = memo(ProductSliderInner)
export default ProductSlider
