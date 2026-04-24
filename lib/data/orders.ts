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
  customerEmail?: string
  customerPhone: string
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  total: number
  currency: string
  paymentMethod: string
  status: OrderStatus
  notes?: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function mapRow(row: Record<string, unknown>): Order {
  return {
    id:              row.id as string,
    orderNumber:     row.order_number as string,
    customerName:    row.customer_name as string,
    customerEmail:   row.customer_email as string | undefined,
    customerPhone:   row.customer_phone as string,
    shippingAddress: row.shipping_address as ShippingAddress,
    subtotal:        Number(row.subtotal),
    shippingFee:     Number(row.shipping_fee),
    total:           Number(row.total),
    currency:        row.currency as string,
    paymentMethod:   row.payment_method as string,
    status:          row.status as OrderStatus,
    notes:           row.notes as string | undefined,
    items:           (row.items as OrderItem[]) ?? [],
    createdAt:       row.created_at as string,
    updatedAt:       row.updated_at as string,
  }
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey:         serviceKey!,
      Authorization:  `Bearer ${serviceKey!}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  return res.status === 204 ? null : res.json()
}

export async function getAllOrders(): Promise<Order[]> {
  if (!supabaseUrl || !serviceKey) return []
  try {
    const rows = await adminFetch('orders?select=*&order=created_at.desc')
    return rows.map(mapRow)
  } catch { return [] }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  if (!supabaseUrl || !serviceKey) return false
  try {
    await adminFetch(`orders?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    })
    return true
  } catch { return false }
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> {
  if (!supabaseUrl || !anonKey) return null
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey:         anonKey,
        Authorization:  `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer:         'return=representation',
      },
      body: JSON.stringify({
        order_number:     order.orderNumber,
        customer_name:    order.customerName,
        customer_email:   order.customerEmail ?? null,
        customer_phone:   order.customerPhone,
        shipping_address: order.shippingAddress,
        subtotal:         order.subtotal,
        shipping_fee:     order.shippingFee,
        total:            order.total,
        currency:         order.currency,
        payment_method:   order.paymentMethod,
        status:           order.status,
        notes:            order.notes ?? null,
        items:            order.items,
      }),
    })
    const rows = await res.json()
    return rows.length > 0 ? mapRow(rows[0]) : null
  } catch { return null }
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment:   'Pending payment',
  payment_submitted: 'Payment submitted',
  payment_confirmed: 'Payment confirmed',
  processing:        'Processing',
  shipped:           'Shipped',
  delivered:         'Delivered',
  cancelled:         'Cancelled',
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment:   'bg-white/[0.05] text-white/40 border-white/10',
  payment_submitted: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  payment_confirmed: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  processing:        'bg-purple-400/10 text-purple-400 border-purple-400/20',
  shipped:           'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  delivered:         'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  cancelled:         'bg-red-400/10 text-red-400 border-red-400/20',
}
