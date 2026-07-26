export interface DummyProduct {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  images: string[]
  thumbnail: string
}

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductsResponse {
  products: DummyProduct[]
  total: number
  skip: number
  limit: number
}

export interface Category {
  slug: string
  name: string
  url: string
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name-asc' | 'name-desc'

export interface Filters {
  category: string
  brand: string
  minPrice: number
  maxPrice: number
  minRating: number
  inStock: boolean
  onSale: boolean
}

export const DEFAULT_FILTERS: Filters = {
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: Infinity,
  minRating: 0,
  inStock: false,
  onSale: false,
}
