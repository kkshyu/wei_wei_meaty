type OrderProduct = {
  id: number
  order_id: number
  product_id: number
  name: string
  price: number
  ordered_at: Date | null
  completed_at: Date | null
}
type Product = {
  id: number
  name: string
  price: number
  picture_url: string
  description: string
}
type Order = {
  id: number
  sid: string
  paid_at: Date | null
  paid_by: string
  created_at: Date
}
