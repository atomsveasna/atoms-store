/**
 * lib/data/blog.ts
 * Supabase-backed blog/tutorial posts
 */

export type PostCategory = 'tutorial' | 'news' | 'guide' | 'update' | 'project'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: PostCategory
  tags: string[]
  author: string
  coverImage?: string
  productSlug?: string
  isPublished: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function mapRow(row: Record<string, unknown>): BlogPost {
  return {
    id:           row.id as string,
    slug:         row.slug as string,
    title:        row.title as string,
    excerpt:      row.excerpt as string,
    content:      row.content as string,
    category:     row.category as PostCategory,
    tags:         (row.tags as string[]) ?? [],
    author:       row.author as string,
    coverImage:   row.cover_image as string | undefined,
    productSlug:  row.product_slug as string | undefined,
    isPublished:  row.is_published as boolean,
    publishedAt:  row.published_at as string,
    createdAt:    row.created_at as string,
    updatedAt:    row.updated_at as string,
  }
}

async function fetch_(path: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey:        anonKey!,
      Authorization: `Bearer ${anonKey!}`,
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  return res.json()
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

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!supabaseUrl || !anonKey) return []
  try {
    const rows = await fetch_('blog_posts?select=*&is_published=eq.true&order=published_at.desc')
    return rows.map(mapRow)
  } catch { return [] }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabaseUrl || !anonKey) return null
  try {
    const rows = await fetch_(`blog_posts?select=*&slug=eq.${slug}&limit=1`)
    return rows.length > 0 ? mapRow(rows[0]) : null
  } catch { return null }
}

export async function getPostsByCategory(category: PostCategory): Promise<BlogPost[]> {
  if (!supabaseUrl || !anonKey) return []
  try {
    const rows = await fetch_(`blog_posts?select=*&category=eq.${category}&is_published=eq.true&order=published_at.desc`)
    return rows.map(mapRow)
  } catch { return [] }
}

export async function getRelatedPosts(post: BlogPost): Promise<BlogPost[]> {
  const all = await getAllPosts()
  return all
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.productSlug === post.productSlug))
    .slice(0, 3)
}

export async function createPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost | null> {
  if (!supabaseUrl || !serviceKey) return null
  try {
    const rows = await adminFetch('blog_posts', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        slug:         data.slug,
        title:        data.title,
        excerpt:      data.excerpt,
        content:      data.content,
        category:     data.category,
        tags:         data.tags,
        author:       data.author,
        cover_image:  data.coverImage ?? null,
        product_slug: data.productSlug ?? null,
        is_published: data.isPublished,
        published_at: data.isPublished ? new Date().toISOString() : null,
      }),
    })
    return rows?.length > 0 ? mapRow(rows[0]) : null
  } catch { return null }
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  tutorial: 'Tutorial',
  news:     'News',
  guide:    'Guide',
  update:   'Update',
  project:  'Project',
}

export const CATEGORY_COLORS: Record<PostCategory, string> = {
  tutorial: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
  news:     'bg-blue-400/10 text-blue-400 border-blue-400/20',
  guide:    'bg-purple-400/10 text-purple-400 border-purple-400/20',
  update:   'bg-amber-400/10 text-amber-400 border-amber-400/20',
  project:  'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
}
