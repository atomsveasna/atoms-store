import Link from 'next/link'
import { getAllPosts, CATEGORY_LABELS, CATEGORY_COLORS, type PostCategory } from '@/lib/data/blog'

export const metadata = {
  title: 'Learn',
  description: 'Tutorials, guides, and project examples for Atoms IoT devices.',
}

interface Props {
  searchParams: { category?: string }
}

export const dynamic = 'force-dynamic'

export default async function LearnPage({ searchParams }: Props) {
  const posts    = await getAllPosts()
  const active   = (searchParams.category ?? 'all') as PostCategory | 'all'
  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active)

  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Learn</p>
          <h1 className="text-4xl font-bold text-white mb-4">Tutorials & guides</h1>
          <p className="text-white/40 text-lg max-w-xl">
            Learn how to install, configure, and get the most out of Atoms devices.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/learn"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                active === 'all' ? 'bg-cyan-400 text-[#080d1a]' : 'border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20'
              }`}
            >
              All
            </Link>
            {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map((cat) => (
              <Link
                key={cat}
                href={`/learn?category=${cat}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  active === cat ? CATEGORY_COLORS[cat] : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>

          {/* Posts grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post.slug}
                  href={`/learn/${post.slug}`}
                  className="group flex flex-col border border-white/[0.08] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl overflow-hidden transition-all duration-200"
                >
                  {/* Cover image or placeholder */}
                  <div className="aspect-[16/9] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative overflow-hidden">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover"/>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/15">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        <span className="text-xs">{CATEGORY_LABELS[post.category]}</span>
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category]}`}>
                      {CATEGORY_LABELS[post.category]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h2 className="font-semibold text-white text-base mb-2 group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-white/40 leading-relaxed line-clamp-3 flex-1 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-xs text-white/30">{post.author}</span>
                      <span className="text-xs text-white/20">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-white/30 text-sm mb-2">No posts yet in this category.</p>
              <p className="text-white/20 text-xs">Add your first post from the admin panel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
