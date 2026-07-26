import type { DummyProduct, ProductsResponse, Category } from '../types/product'

const BASE_URL = 'https://dummyjson.com'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchAllProducts(): Promise<DummyProduct[]> {
  const data = await fetchJson<ProductsResponse>(`${BASE_URL}/products?limit=194`)
  return data.products
}

export async function fetchProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>(`${BASE_URL}/products?limit=${limit}&skip=${skip}`)
}

export async function fetchProduct(id: number): Promise<DummyProduct> {
  return fetchJson<DummyProduct>(`${BASE_URL}/products/${id}`)
}

export async function searchProducts(query: string, limit = 20, skip = 0): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  )
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`${BASE_URL}/products/categories`)
}

export async function fetchProductsByCategory(
  category: string,
  limit = 20,
  skip = 0
): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  )
}
