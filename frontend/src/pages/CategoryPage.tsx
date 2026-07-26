import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductsByCategory, fetchCategories } from '../services/dummyjson'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import type { DummyProduct, Category } from '../types/product'

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [products, setProducts] = useState<DummyProduct[]>([])
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [allCategories, setAllCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories().then(setAllCategories)
  }, [])

  useEffect(() => {
    if (category) {
      const found = allCategories.find((c) => c.slug === category)
      if (found) setCategoryInfo(found)
    }
  }, [category, allCategories])

  useEffect(() => {
    if (!category) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchProductsByCategory(category, 194, 0)
        if (!cancelled) setProducts(data.products)
      } catch {
        if (!cancelled) setError('Failed to load category products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [category])

  const title = categoryInfo?.name || (category ? category.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Category')

  if (error) {
    return (
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
        <div className="text-center py-20 text-red-500">
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No products found in this category</p>
          <Link to="/product" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Browse all products
          </Link>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-gray-500 mb-4">{products.length} products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
