import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getAllProductSlugs } from '@/lib/data/products'
import { getReviewsByProduct, calcStats } from '@/lib/data/reviews'
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
  const [product, reviews] = await Promise.all([
    getProductBySlug(params.slug),
    getReviewsByProduct(params.slug),
  ])
  if (!product) notFound()
  const reviewStats = calcStats(reviews)
  return <ProductDetailClient product={product} reviews={reviews} reviewStats={reviewStats}/>
}
