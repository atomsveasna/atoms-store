// ── Product Types ─────────────────────────────────────────────

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder' | 'coming_soon'
export type ProductCategory = 'switches' | 'sockets' | 'sensors' | 'accessories' | 'bundles'

export interface ProductSpec {
  label: string
  value: string
  group?: string
}

export interface ProductImage {
  src: string
  alt: string
  type: 'render' | 'photo' | 'diagram'
}

export interface ProductDownload {
  label: string
  filename: string
  url: string
  type: 'manual' | 'quickstart' | 'datasheet' | 'firmware' | 'cad' | 'certification'
  size?: string
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  longDescription?: string
  category: ProductCategory
  status: ProductStatus
  price: number
  currency: string
  sku: string
  images: ProductImage[]
  features: string[]
  specs: ProductSpec[]
  packageContents: string[]
  downloads: ProductDownload[]
  faqs: ProductFAQ[]
  relatedSlugs: string[]
  docSlug?: string
  worksWithPlatforms: string[]
  firmwareVersion?: string
  revisionHistory?: { version: string; date: string; notes: string }[]
  isNew?: boolean
  isFeatured?: boolean
  createdAt: string
  updatedAt: string
}

// ── Order Types ───────────────────────────────────────────────

export type OrderStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  province?: string
  country: string
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  total: number
  currency: string
  paymentMethod: 'aba_transfer' | 'cash_on_delivery'
  paymentProofUrl?: string
  status: OrderStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

// ── Cart Types ────────────────────────────────────────────────

export interface CartItem {
  productId: string
  slug: string
  name: string
  sku: string
  price: number
  quantity: number
  image?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

// ── Docs Types ────────────────────────────────────────────────

export type DocCategory =
  | 'getting-started'
  | 'installation'
  | 'configuration'
  | 'api'
  | 'firmware'
  | 'troubleshooting'
  | 'downloads'

export interface DocMeta {
  title: string
  description?: string
  category: DocCategory
  productSlug?: string
  order: number
  lastUpdated: string
  tags?: string[]
}

export interface DocPage {
  slug: string[]
  meta: DocMeta
  content: string
}

// ── Support Types ─────────────────────────────────────────────

export type SupportCategory =
  | 'pre-sales'
  | 'installation'
  | 'firmware'
  | 'network'
  | 'hardware'
  | 'warranty'
  | 'other'

export interface SupportRequest {
  name: string
  email: string
  phone?: string
  orderId?: string
  productSlug?: string
  category: SupportCategory
  subject: string
  message: string
}
