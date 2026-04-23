import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── Class name utility ────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Price formatting ──────────────────────────────────────────
export function formatPrice(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// ── Order number generation ───────────────────────────────────
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `ATM-${year}${month}${day}-${random}`
}

// ── Slug utilities ────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ── Date formatting ───────────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

// ── Product status display ────────────────────────────────────
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
    preorder: 'Pre-Order',
    coming_soon: 'Coming Soon',
  }
  return labels[status] ?? status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_stock: 'badge-stock',
    low_stock: 'badge-pre',
    out_of_stock: 'badge-soon',
    preorder: 'badge-pre',
    coming_soon: 'badge-soon',
  }
  return colors[status] ?? 'badge-soon'
}
