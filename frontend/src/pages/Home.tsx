import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchAllProducts, fetchCategories } from '../services/dummyjson'
import HeroSlider from '../components/HeroSlider'
import CategoryPills from '../components/CategoryPills'
import ProductSlider from '../components/ProductSlider'
import { ProductGridSkeleton } from '../components/Skeleton'
import { fadeIn, staggerContainer } from '../lib/animation'
import type { DummyProduct, Category } from '../types/product'

export default function Home() {
  const [products, setProducts] = useState<DummyProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [prods, cats] = await Promise.all([fetchAllProducts(), fetchCategories()])
        if (!cancelled) {
          setProducts(prods)
          setCategories(cats)
        }
      } catch {
        if (!cancelled) setError('Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const dealsOfDay = useMemo(
    () => [...products].sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 12),
    [products]
  )

  const featured = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 12),
    [products]
  )

  const newArrivals = useMemo(
    () => [...products].sort((a, b) => (b.meta?.createdAt > a.meta?.createdAt ? 1 : -1)).slice(0, 12),
    [products]
  )

  const trending = useMemo(
    () => [...products].sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)).slice(0, 12),
    [products]
  )

  const bestSellers = useMemo(
    () => products.filter((p) => p.stock > 20).slice(0, 12),
    [products]
  )

  const electronics = useMemo(
    () => products.filter((p) => ['smartphones', 'laptops', 'tablets', 'mobile-accessories'].includes(p.category)).slice(0, 12),
    [products]
  )

  const fashion = useMemo(
    () => products.filter((p) => ['tops', 'mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'womens-bags'].includes(p.category)).slice(0, 12),
    [products]
  )

  const homeLiving = useMemo(
    () => products.filter((p) => ['furniture', 'home-decoration', 'kitchen-accessories', 'groceries'].includes(p.category)).slice(0, 12),
    [products]
  )

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-10">
        <div className="h-56 md:h-[65vh] bg-gray-200 rounded-2xl" />
        <div className="flex gap-3 px-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="shrink-0 w-24 h-10 bg-gray-200 rounded-full" />
          ))}
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <HeroSlider products={products} />

      <motion.div variants={fadeIn} className="mb-8">
        <CategoryPills categories={categories} />
      </motion.div>

      {dealsOfDay.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Deals of the Day"
            icon="🔥"
            products={dealsOfDay}
            viewAllLink="/product?sort=discount"
          />
        </motion.div>
      )}

      {featured.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Featured Products"
            icon="⭐"
            products={featured}
            viewAllLink="/product?sort=rating"
          />
        </motion.div>
      )}

      {newArrivals.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="New Arrivals"
            icon="🆕"
            products={newArrivals}
            viewAllLink="/product"
          />
        </motion.div>
      )}

      {trending.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Trending Now"
            icon="🔥"
            products={trending}
            viewAllLink="/product?sort=rating"
          />
        </motion.div>
      )}

      {bestSellers.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Best Sellers"
            icon="🏆"
            products={bestSellers}
            viewAllLink="/product"
          />
        </motion.div>
      )}

      {electronics.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Electronics"
            icon="💻"
            products={electronics}
            viewAllLink="/category/smartphones"
          />
        </motion.div>
      )}

      {fashion.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Fashion"
            icon="👕"
            products={fashion}
            viewAllLink="/category/tops"
          />
        </motion.div>
      )}

      {homeLiving.length > 0 && (
        <motion.div variants={fadeIn}>
          <ProductSlider
            title="Home & Living"
            icon="🏠"
            products={homeLiving}
            viewAllLink="/category/home-decoration"
          />
        </motion.div>
      )}

      <motion.div variants={fadeIn} className="text-center mt-4 mb-10">
        <Link
          to="/product"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105"
        >
          View All Products
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  )
}
