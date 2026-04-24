import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const formData = await req.formData()
  const file        = formData.get('file') as File
  const productSlug = formData.get('productSlug') as string
  const imageType   = formData.get('type') as string ?? 'photo'
  const alt         = formData.get('alt') as string ?? file.name

  if (!file || !productSlug) {
    return NextResponse.json({ error: 'Missing file or productSlug' }, { status: 400 })
  }

  // Validate file type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, or WebP.' }, { status: 400 })
  }

  // Build path: product-images/product-slug/timestamp-filename
  const ext      = file.name.split('.').pop()
  const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase()}`
  const path     = `${productSlug}/${filename}`

  // Upload to Supabase Storage
  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadRes = await fetch(
    `${supabaseUrl}/storage/v1/object/product-images/${path}`,
    {
      method: 'POST',
      headers: {
        apikey:          serviceKey,
        Authorization:   `Bearer ${serviceKey}`,
        'Content-Type':  file.type,
        'x-upsert':      'true',
      },
      body: buffer,
    }
  )

  if (!uploadRes.ok) {
    const err = await uploadRes.json()
    return NextResponse.json({ error: err.message ?? 'Upload failed' }, { status: 400 })
  }

  // Public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${path}`

  // Save to product_images table
  const dbRes = await fetch(`${supabaseUrl}/rest/v1/product_images`, {
    method: 'POST',
    headers: {
      apikey:         serviceKey,
      Authorization:  `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer:         'return=representation',
    },
    body: JSON.stringify({
      product_id:  null, // will link by slug below
      src:         publicUrl,
      alt,
      type:        imageType,
      sort_order:  0,
    }),
  })

  // Also update the product's images array in Supabase
  // First get the product id
  const prodRes = await fetch(
    `${supabaseUrl}/rest/v1/products?slug=eq.${productSlug}&select=id`,
    {
      headers: {
        apikey:        serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  )
  const products = await prodRes.json()

  if (products.length > 0) {
    const productId = products[0].id
    // Update product_images with correct product_id
    const imgData = await dbRes.json()
    if (imgData.length > 0) {
      await fetch(`${supabaseUrl}/rest/v1/product_images?id=eq.${imgData[0].id}`, {
        method: 'PATCH',
        headers: {
          apikey:         serviceKey,
          Authorization:  `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      })
    }
  }

  return NextResponse.json({ success: true, url: publicUrl, path })
}
