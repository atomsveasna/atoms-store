import { getAllProducts } from '@/lib/data/products'
import { getAllPosts } from '@/lib/data/blog'
import { getAllBundles } from '@/lib/data/bundles'

export default async function sitemap() {
  const base     = 'https://atomsiot.com'
  const products = await getAllProducts()
  const posts    = await getAllPosts()

  const staticPages = [
    { url: base,              lastModified: new Date(), priority: 1.0 },
    { url: `${base}/shop`,    lastModified: new Date(), priority: 0.9 },
    { url: `${base}/docs`,    lastModified: new Date(), priority: 0.8 },
    { url: `${base}/learn`,   lastModified: new Date(), priority: 0.8 },
    { url: `${base}/about`,   lastModified: new Date(), priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/support`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/support/shipping`, lastModified: new Date(), priority: 0.4 },
    { url: `${base}/support/warranty`, lastModified: new Date(), priority: 0.4 },
    { url: `${base}/support/returns`,  lastModified: new Date(), priority: 0.4 },
  ]

  const productPages = products.map((p) => ({
    url:          `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    priority:     0.9,
  }))

  const postPages = posts.map((p) => ({
    url:          `${base}/learn/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    priority:     0.7,
  }))

  return [...staticPages, ...productPages, ...postPages]
}
