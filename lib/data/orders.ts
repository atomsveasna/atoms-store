/**
 * lib/data/orders.ts
 *
 * ALL order data access goes through this file.
 *
 * Phase 0: lightweight in-memory or direct Supabase REST calls
 * Phase 1: full Prisma integration
 */

import type { Order } from '@/types'
import { generateOrderNumber } from '@/lib/utils'

export type CreateOrderInput = Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>

// ── Create ────────────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // Phase 0: POST to Supabase REST or your own API route
  // Phase 1: return prisma.order.create({ data: { ...input, orderNumber: generateOrderNumber() } })

  const order: Order = {
    ...input,
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // TODO Phase 0: persist via API route + send Telegram notification
  return order
}

// ── Read ──────────────────────────────────────────────────────

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  // Phase 1: return prisma.order.findUnique({ where: { orderNumber } })
  return null
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  // Phase 1: return prisma.order.findMany({ where: { customerEmail: email } })
  return []
}
