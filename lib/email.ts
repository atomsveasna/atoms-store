/**
 * lib/email.ts
 * Email notifications via Resend API
 * Sends order confirmation, payment confirmation, shipping updates
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL    = process.env.EMAIL_FROM ?? 'orders@atomsiot.com'
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://atomsiot.com'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent')
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: `Atoms <${FROM_EMAIL}>`, to, subject, html }),
    })
    return res.ok
  } catch { return false }
}

// ── Email templates ───────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Atoms</title>
  <style>
    body { margin:0; padding:0; background:#f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width:600px; margin:0 auto; padding:32px 16px; }
    .card { background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
    .header { background:#080d1a; padding:28px 32px; }
    .logo { display:flex; align-items:center; gap:10px; }
    .logo-mark { width:28px; height:28px; background:#00e5ff; border-radius:7px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#080d1a; line-height:1; }
    .logo-text { color:#ffffff; font-size:16px; font-weight:600; letter-spacing:-0.01em; }
    .body { padding:32px; }
    h1 { margin:0 0 8px; font-size:22px; font-weight:700; color:#0a0f1e; letter-spacing:-0.02em; }
    p { margin:0 0 16px; font-size:14px; line-height:1.6; color:#555577; }
    .order-box { background:#f7f8fc; border-radius:12px; padding:20px; margin:20px 0; }
    .order-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eeeef5; font-size:13px; }
    .order-row:last-child { border-bottom:none; }
    .order-label { color:#7b82a0; }
    .order-value { color:#0a0f1e; font-weight:600; }
    .item-row { display:flex; justify-content:space-between; padding:6px 0; font-size:13px; color:#3d4466; }
    .total-row { display:flex; justify-content:space-between; padding:12px 0 0; font-size:15px; font-weight:700; color:#0a0f1e; border-top:2px solid #eeeef5; margin-top:8px; }
    .btn { display:inline-block; padding:12px 24px; background:#00e5ff; color:#080d1a; font-weight:700; font-size:13px; border-radius:10px; text-decoration:none; margin:8px 0; }
    .badge { display:inline-block; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:600; }
    .badge-success { background:#e6f4ea; color:#1e6b3c; }
    .badge-warning { background:#fff3e0; color:#e65100; }
    .badge-info    { background:#e8f0fe; color:#1a56db; }
    .footer { padding:24px 32px; text-align:center; }
    .footer p { font-size:12px; color:#b8bccf; margin:4px 0; }
    .footer a { color:#00b8cc; text-decoration:none; }
    .divider { height:1px; background:#eeeef5; margin:20px 0; }
    .address { font-size:13px; color:#555577; line-height:1.5; }
    .highlight { color:#0a0f1e; font-weight:600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">
          <div class="logo-mark">A</div>
          <div class="logo-text">Atoms</div>
        </div>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <p>Atoms · <a href="${SITE_URL}">atomsiot.com</a> · <a href="mailto:hello@atomsiot.com">hello@atomsiot.com</a></p>
        <p>Phnom Penh, Cambodia</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// ── Order confirmation ─────────────────────────────────────────

export async function sendOrderConfirmation(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: { productName: string; quantity: number; totalPrice: number }[]
  total: number
  currency: string
  shippingAddress: { addressLine1: string; city: string; phone: string }
}): Promise<boolean> {
  if (!order.customerEmail) return false

  const itemsHtml = order.items.map((item) =>
    `<div class="item-row"><span>${item.quantity}× ${item.productName}</span><span>$${item.totalPrice.toFixed(2)}</span></div>`
  ).join('')

  const content = `
    <h1>Order received! 🎉</h1>
    <p>Hi ${order.customerName}, thank you for your order. We've received it and will confirm once payment is verified.</p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order number</span>
        <span class="order-value" style="font-family:monospace;color:#00b8cc;">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Status</span>
        <span class="badge badge-warning">Awaiting payment confirmation</span>
      </div>
    </div>

    <p><strong>Items ordered:</strong></p>
    <div class="order-box">
      ${itemsHtml}
      <div class="total-row"><span>Total</span><span>$${order.total.toFixed(2)}</span></div>
    </div>

    <p><strong>Deliver to:</strong></p>
    <p class="address">${order.shippingAddress.addressLine1}<br>${order.shippingAddress.city}<br>${order.shippingAddress.phone}</p>

    <div class="divider"></div>

    <p><strong>What happens next:</strong></p>
    <p>1. We verify your ABA transfer (1–2 hours during business hours)<br>
       2. You receive a confirmation message<br>
       3. Your order is packed and dispatched<br>
       4. Same or next-day delivery in Phnom Penh</p>

    <p>Questions? Reply to this email or contact us on Telegram.</p>
    <a href="${SITE_URL}/support" class="btn">Visit help center</a>
  `

  return sendEmail({
    to: order.customerEmail,
    subject: `Order confirmed — ${order.orderNumber} | Atoms`,
    html: baseTemplate(content),
  })
}

// ── Payment confirmed ──────────────────────────────────────────

export async function sendPaymentConfirmed(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
}): Promise<boolean> {
  if (!order.customerEmail) return false

  const content = `
    <h1>Payment confirmed ✓</h1>
    <p>Hi ${order.customerName}, great news — we've confirmed your payment for order <span class="highlight" style="font-family:monospace;">${order.orderNumber}</span>.</p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order</span>
        <span class="order-value" style="font-family:monospace;color:#00b8cc;">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Amount</span>
        <span class="order-value">$${order.total.toFixed(2)}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Status</span>
        <span class="badge badge-info">Processing</span>
      </div>
    </div>

    <p>Your order is now being prepared for delivery. We'll send you another update when it ships.</p>
    <a href="${SITE_URL}/account" class="btn">View order status</a>
  `

  return sendEmail({
    to: order.customerEmail,
    subject: `Payment confirmed — ${order.orderNumber} | Atoms`,
    html: baseTemplate(content),
  })
}

// ── Shipped ───────────────────────────────────────────────────

export async function sendOrderShipped(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  shippingAddress: { addressLine1: string; city: string; phone: string }
  notes?: string
}): Promise<boolean> {
  if (!order.customerEmail) return false

  const content = `
    <h1>Your order is on its way! 🚀</h1>
    <p>Hi ${order.customerName}, your order <span class="highlight" style="font-family:monospace;">${order.orderNumber}</span> has been dispatched.</p>

    <div class="order-box">
      <div class="order-row">
        <span class="order-label">Order</span>
        <span class="order-value" style="font-family:monospace;color:#00b8cc;">${order.orderNumber}</span>
      </div>
      <div class="order-row">
        <span class="order-label">Status</span>
        <span class="badge badge-info">Shipped</span>
      </div>
      <div class="order-row">
        <span class="order-label">Deliver to</span>
        <span class="order-value">${order.shippingAddress.city}</span>
      </div>
    </div>

    ${order.notes ? `<p><strong>Delivery note:</strong> ${order.notes}</p>` : ''}
    <p>Our delivery team will contact you at <strong>${order.shippingAddress.phone}</strong> before arriving.</p>
    <p>Expected: same day or next day within Phnom Penh.</p>

    <a href="${SITE_URL}/account" class="btn">View order</a>
  `

  return sendEmail({
    to: order.customerEmail,
    subject: `Your order is on its way — ${order.orderNumber} | Atoms`,
    html: baseTemplate(content),
  })
}

// ── Delivered ─────────────────────────────────────────────────

export async function sendOrderDelivered(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  productSlug?: string
}): Promise<boolean> {
  if (!order.customerEmail) return false

  const content = `
    <h1>Order delivered! ✓</h1>
    <p>Hi ${order.customerName}, your order <span class="highlight" style="font-family:monospace;">${order.orderNumber}</span> has been delivered.</p>

    <p>We hope everything arrived in perfect condition. If you have any issues, contact us and we'll make it right.</p>

    <div class="divider"></div>

    <p><strong>A few things to do next:</strong></p>
    <p>
      📱 <a href="${SITE_URL}/register" style="color:#00b8cc;">Register your device</a> to activate your 12-month warranty<br>
      📖 <a href="${SITE_URL}/docs" style="color:#00b8cc;">Read the quick start guide</a> to get set up in 2 minutes<br>
      ⭐ <a href="${SITE_URL}/products/${order.productSlug ?? ''}" style="color:#00b8cc;">Leave a review</a> — it helps other customers
    </p>

    <a href="${SITE_URL}/register" class="btn">Register device</a>
  `

  return sendEmail({
    to: order.customerEmail,
    subject: `Delivered — ${order.orderNumber} | Atoms`,
    html: baseTemplate(content),
  })
}
