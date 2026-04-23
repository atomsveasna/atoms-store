import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getAllProductSlugs } from '@/lib/data/products'
import ProductDetailClient from '@/components/product/ProductDetailClient'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllProductSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, type: 'website' },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
