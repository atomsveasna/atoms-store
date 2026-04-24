import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/data/blog'

interface Props {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# '))       elements.push(<h1 key={i} className="text-3xl font-bold text-white mt-10 mb-4 first:mt-0">{line.slice(2)}</h1>)
    else if (line.startsWith('## ')) elements.push(<h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(3)}</h2>)
    else if (line.startsWith('### '))elements.push(<h3 key={i} className="text-base font-bold text-white mt-6 mb-2">{line.slice(4)}</h3>)
    else if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(
        <pre key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 overflow-x-auto my-5">
          <code className="text-sm text-white/80 font-mono leading-relaxed">{codeLines.join('\n')}</code>
        </pre>
      )
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-cyan-400/40 pl-5 my-5 text-white/50 text-sm italic leading-relaxed">
          {line.slice(2)}
        </blockquote>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [line.slice(2)]
      while (i + 1 < lines.length && (lines[i+1].startsWith('- ') || lines[i+1].startsWith('* '))) { i++; items.push(lines[i].slice(2)) }
      elements.push(
        <ul key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-sm text-white/60 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 flex-shrink-0 mt-2"/>
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }}/>
            </li>
          ))}
        </ul>
      )
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [line.replace(/^\d+\. /, '')]
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i+1])) { i++; items.push(lines[i].replace(/^\d+\. /, '')) }
      elements.push(
        <ol key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm text-white/60 leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-[11px] font-bold text-cyan-400 flex-shrink-0 mt-0.5">{j+1}</span>
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }}/>
            </li>
          ))}
        </ol>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2"/>)
    } else {
      elements.push(
        <p key={i} className="text-sm text-white/60 leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />
      )
    }
    i++
  }
  return <div className="max-w-none">{elements}</div>
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="font-mono text-cyan-400 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 hover:underline">$1</a>')
}

export default async function LearnPostPage({ params }: Props) {
  const post    = await getPostBySlug(params.slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post)

  return (
    <div className="min-h-screen bg-[#080d1a]">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-white/60 transition-colors">Learn</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Post header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category]}`}>
                {CATEGORY_LABELS[post.category]}
              </span>
              {post.productSlug && (
                <Link href={`/products/${post.productSlug}`} className="text-xs text-white/30 hover:text-cyan-400 transition-colors">
                  {post.productSlug} →
                </Link>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">{post.title}</h1>
            <p className="text-lg text-white/50 leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-white/30">
              <span>{post.author}</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Cover image */}
          {post.coverImage && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.07] mb-10 aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover"/>
            </div>
          )}

          {/* Content */}
          <div className="mb-12">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t border-white/[0.06]">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-white/30">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Related posts */}
          {related.length > 0 && (
            <div className="pt-8 border-t border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-5">Related posts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/learn/${r.slug}`} className="p-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[r.category]} mb-2 inline-block`}>
                      {CATEGORY_LABELS[r.category]}
                    </span>
                    <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors line-clamp-2">{r.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <Link href="/learn" className="text-sm text-white/30 hover:text-white transition-colors">← Back to all posts</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
