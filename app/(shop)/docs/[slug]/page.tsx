import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDocBySlug, getDocsByProduct } from '@/lib/data/docs'

interface Props {
  params: { slug: string }
}

const CATEGORY_ORDER = [
  'getting-started',
  'installation',
  'configuration',
  'api',
  'firmware',
  'troubleshooting',
  'downloads',
]

const CATEGORY_LABELS: Record<string, string> = {
  'getting-started':  'Getting started',
  'installation':     'Installation',
  'configuration':    'Configuration',
  'api':              'API reference',
  'firmware':         'Firmware',
  'troubleshooting':  'Troubleshooting',
  'downloads':        'Downloads',
}

export default async function DocPage({ params }: Props) {
  const doc = await getDocBySlug(params.slug)
  if (!doc) notFound()

  // Get sibling docs for sidebar
  const siblings = doc.productSlug
    ? await getDocsByProduct(doc.productSlug)
    : []

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof siblings>>(
    (acc, cat) => {
      const items = siblings.filter((d) => d.category === cat)
      if (items.length > 0) acc[cat] = items
      return acc
    },
    {}
  )

  return (
    <div className="min-h-screen bg-[#080d1a]">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/docs" className="hover:text-white/60 transition-colors">Docs</Link>
          <span>/</span>
          <span className="text-white/60">{doc.title}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto flex gap-10">

          {/* Sidebar */}
          {siblings.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {Object.entries(grouped).map(([cat, docs]) => (
                  <div key={cat}>
                    <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">
                      {CATEGORY_LABELS[cat] ?? cat}
                    </p>
                    <div className="space-y-0.5">
                      {docs.map((d) => (
                        <Link
                          key={d.slug}
                          href={`/docs/${d.slug}`}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                            d.slug === params.slug
                              ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                              : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          {d.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Doc header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] px-2 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 font-medium">
                  {CATEGORY_LABELS[doc.category] ?? doc.category}
                </span>
                <span className="text-xs text-white/20">
                  Updated {new Date(doc.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{doc.title}</h1>
              {doc.description && (
                <p className="text-white/50 text-lg leading-relaxed">{doc.description}</p>
              )}
            </div>

            {/* Doc content — rendered as markdown */}
            <div className="prose-atoms">
              <MarkdownRenderer content={doc.content} />
            </div>

            {/* Tags */}
            {doc.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap gap-2">
                {doc.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-white/30">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom nav */}
            <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between">
              <Link href="/docs" className="text-sm text-white/30 hover:text-white transition-colors">
                ← All docs
              </Link>
              {doc.productSlug && (
                <Link href={`/products/${doc.productSlug}`} className="text-sm text-white/30 hover:text-cyan-400 transition-colors">
                  View product →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Simple markdown renderer ───────────────────────────────────
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-bold text-white mt-6 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 overflow-x-auto my-4">
          <code className="text-sm text-white/80 font-mono">{codeLines.join('\n')}</code>
        </pre>
      )
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-cyan-400/40 pl-4 my-4 text-white/50 text-sm italic">
          {line.slice(2)}
        </blockquote>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [line.slice(2)]
      while (i + 1 < lines.length && (lines[i+1].startsWith('- ') || lines[i+1].startsWith('* '))) {
        i++
        items.push(lines[i].slice(2))
      }
      elements.push(
        <ul key={i} className="my-4 space-y-1.5">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 flex-shrink-0 mt-1.5"/>
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }}/>
            </li>
          ))}
        </ul>
      )
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [line.replace(/^\d+\. /, '')]
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i+1])) {
        i++
        items.push(lines[i].replace(/^\d+\. /, ''))
      }
      elements.push(
        <ol key={i} className="my-4 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm text-white/60">
              <span className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-semibold text-white/30 flex-shrink-0 mt-0.5">{j+1}</span>
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }}/>
            </li>
          ))}
        </ol>
      )
    } else if (line.startsWith('| ')) {
      // Table
      const tableLines: string[] = [line]
      while (i + 1 < lines.length && lines[i+1].startsWith('|')) {
        i++
        tableLines.push(lines[i])
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={i} className="my-4 overflow-x-auto">
          <table className="w-full text-sm">
            {rows.map((row, ri) => {
              const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1)
              return (
                <tr key={ri} className={ri === 0 ? 'border-b border-white/[0.08]' : 'border-b border-white/[0.04]'}>
                  {cells.map((cell, ci) => ri === 0
                    ? <th key={ci} className="text-left px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">{cell.trim()}</th>
                    : <td key={ci} className="px-3 py-2 text-white/60" dangerouslySetInnerHTML={{ __html: renderInline(cell.trim()) }}/>
                  )}
                </tr>
              )
            })}
          </table>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2"/>)
    } else {
      elements.push(
        <p key={i} className="text-sm text-white/60 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />
      )
    }
    i++
  }

  return <div>{elements}</div>
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="font-mono text-cyan-400 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 hover:underline">$1</a>')
    .replace(/⚠️/g, '<span>⚠️</span>')
}
