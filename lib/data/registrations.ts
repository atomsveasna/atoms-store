export interface DeviceRegistration {
  id: string
  customerName: string
  customerEmail: string
  productSlug: string
  serialNumber?: string
  purchaseDate?: string
  purchaseOrderId?: string
  notes?: string
  createdAt: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function registerDevice(data: {
  customerName: string
  customerEmail: string
  productSlug: string
  serialNumber?: string
  purchaseDate?: string
  purchaseOrderId?: string
  notes?: string
}): Promise<{ success: boolean; error?: string }> {
  if (!supabaseUrl || !anonKey) return { success: false, error: 'Not configured' }
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/product_registrations`, {
      method: 'POST',
      headers: {
        apikey:         anonKey,
        Authorization:  `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({
        customer_name:      data.customerName,
        customer_email:     data.customerEmail,
        product_slug:       data.productSlug,
        serial_number:      data.serialNumber   ?? null,
        purchase_date:      data.purchaseDate   ?? null,
        purchase_order_id:  data.purchaseOrderId ?? null,
        notes:              data.notes          ?? null,
      }),
    })
    if (!res.ok) return { success: false, error: 'Registration failed' }
    return { success: true }
  } catch { return { success: false, error: 'Something went wrong' } }
}

export async function getAllRegistrations(): Promise<DeviceRegistration[]> {
  if (!supabaseUrl || !serviceKey) return []
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/product_registrations?select=*&order=created_at.desc`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    )
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map((r: Record<string, unknown>) => ({
      id:              r.id as string,
      customerName:    r.customer_name as string,
      customerEmail:   r.customer_email as string,
      productSlug:     r.product_slug as string,
      serialNumber:    r.serial_number as string | undefined,
      purchaseDate:    r.purchase_date as string | undefined,
      purchaseOrderId: r.purchase_order_id as string | undefined,
      notes:           r.notes as string | undefined,
      createdAt:       r.created_at as string,
    }))
  } catch { return [] }
}

export async function getRegistrationsByEmail(email: string): Promise<DeviceRegistration[]> {
  if (!supabaseUrl || !serviceKey) return []
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/product_registrations?customer_email=eq.${encodeURIComponent(email)}&order=created_at.desc`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    )
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map((r: Record<string, unknown>) => ({
      id:              r.id as string,
      customerName:    r.customer_name as string,
      customerEmail:   r.customer_email as string,
      productSlug:     r.product_slug as string,
      serialNumber:    r.serial_number as string | undefined,
      purchaseDate:    r.purchase_date as string | undefined,
      purchaseOrderId: r.purchase_order_id as string | undefined,
      notes:           r.notes as string | undefined,
      createdAt:       r.created_at as string,
    }))
  } catch { return [] }
}
