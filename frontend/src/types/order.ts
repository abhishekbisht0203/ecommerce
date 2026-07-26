export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface Order {
  id: number
  product: string
  quantity: number
  total: string
  status: OrderStatus
}
