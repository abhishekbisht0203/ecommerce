import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, searchProducts, fetchCategories } from '../services/dummyjson'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import type { DummyProduct, SortOption, Filters } from '../types/product'

const ITEMS_PER_PAGE = 20

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<DummyProduct[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [allBrands, setAllBrands] = useState<string[]>([])

  const page = parseInt(searchParams.get('page') || '1', 10)
  const query = searchParams.get('q') || ''
  const sort = (searchParams.get('sort') || '') as SortOption
  const filters: Filters = {
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: parseFloat(searchParams.get('minPrice') || '0'),
    maxPrice: parseFloat(searchParams.get('maxPrice') || '0') || Infinity,
    minRating: parseFloat(searchParams.get('minRating') || '0'),
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const skip = (page - 1) * ITEMS_PER_PAGE
        let data
        if (query) {
          data = await searchProducts(query, ITEMS_PER_PAGE, skip)
        } else if (filters.category) {
          const res = await fetch(`https://dummyjson.com/products/category/${encodeURIComponent(filters.category)}?limit=${ITEMS_PER_PAGE}&skip=${skip}`)
          data = await res.json()
        } else {
          data = await fetchProducts(ITEMS_PER_PAGE, skip)
        }
        if (!cancelled) {
          setProducts(data.products)
          setTotal(data.total)
        }
      } catch {
        if (!cancelled) setError('Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, query, filters.category])

  useEffect(() => {
    fetchCategories().then((cats) => setAllCategories(cats.map((c) => c.slug)))
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))] as string[]
      setAllBrands((prev) => {
        const merged = new Set([...prev, ...brands])
        return [...merged]
      })
    }
  }, [products])

  const sorted = useMemo(() => {
    const arr = [...products]
    switch (sort) {
      case 'price-asc':
        return arr.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return arr.sort((a, b) => b.price - a.price)
      case 'rating':
        return arr.sort((a, b) => b.rating - a.rating)
      case 'name-asc':
        return arr.sort((a, b) => a.title.localeCompare(b.title))
      case 'name-desc':
        return arr.sort((a, b) => b.title.localeCompare(a.title))
      default:
        return arr
    }
  }, [products, sort])

  const filtered = useMemo(() => {
    return sorted.filter((p) => {
      if (filters.brand && p.brand !== filters.brand) return false
      if (filters.minPrice > 0 && p.price < filters.minPrice) return false
      if (filters.maxPrice < Infinity && p.price > filters.maxPrice) return false
      if (filters.minRating > 0 && p.rating < filters.minRating) return false
      if (filters.inStock && p.stock === 0) return false
      if (filters.onSale && p.discountPercentage === 0) return false
      return true
    })
  }, [sorted, filters])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page') params.set('page', '1')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = filters.category || filters.brand || filters.minPrice > 0 || filters.maxPrice < Infinity || filters.minRating > 0 || filters.inStock || filters.onSale

  if (error) {
    return (
      <section className="mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">
          {query ? `Search: "${query}"` : 'Shop'}
        </h1>
        <div className="text-center py-20 text-red-500">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        {query ? `Search: "${query}"` : 'Shop'}
      </h1>

      <div className="container mx-auto mb-6 flex flex-wrap gap-4 items-center justify-center">
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
          ))}
        </select>

        {allBrands.length > 0 && (
          <select
            value={filters.brand}
            onChange={(e) => updateParam('brand', e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="">All Brands</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ''}
          onChange={(e) => updateParam('minPrice', e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white w-24"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice === Infinity ? '' : filters.maxPrice || ''}
          onChange={(e) => updateParam('maxPrice', e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white w-24"
        />

        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
          />
          In Stock
        </label>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => updateParam('onSale', e.target.checked ? 'true' : '')}
          />
          On Sale
        </label>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-red-600 hover:underline">
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No products found</p>
          {query && <p className="mt-2">Try a different search term</p>}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-gray-500 mb-4">{total} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => updateParam('page', String(page - 1))}
              disabled={page <= 1}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => updateParam('page', String(p))}
                  className={`px-3 py-2 rounded-lg text-sm ${p === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => updateParam('page', String(page + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  )
}
