export type Product = {
  id: string
  name: string
  description: string | null
  base_price: number
  sale_price: number | null
  is_on_sale: boolean
  image_url: string | null
  created_at: string
}

export type ProductFormData = {
  name: string
  description: string
  base_price: number
  sale_price: number | null
  is_on_sale: boolean
  image_url: string
}
