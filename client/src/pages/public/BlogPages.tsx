import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FileText, Search, ArrowRight, Clock, User, Calendar, ArrowLeft } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { PageLoader } from '@/components/ui/Loader'
import { SEO } from '@/components/seo/SEO'
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/config/seo'
import { ROUTES } from '@/constants'
import { blogService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'

export function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || undefined
  const { data, isLoading, error, refetch } = useFetch(() => blogService.list({ search }), [search])

  return (
    <>
      <SEO title="Engineering Insights | ORBIT-I Private Limited" description="Technical articles and architectural insights on software development, cloud infrastructure, and cybersecurity." path={ROUTES.blog} />
      <div className="pb-24">
        {/* Centered Page Header */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                Engineering &amp; Architecture Insights
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Practical ideas for building reliable digital systems
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                In-depth articles on enterprise software architecture, full-stack security, and cloud scalability written by the senior engineers at ORBIT-I.
              </p>

              {/* Centered Search Bar */}
              <form
                className="mt-8 mx-auto flex max-w-lg items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
                onSubmit={(event) => {
                  event.preventDefault()
                  const value = new FormData(event.currentTarget).get('search')?.toString() || ''
                  setSearchParams(value ? { search: value } : {})
                }}
              >
                <Search className="ml-3 size-5 text-slate-400 shrink-0" />
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search articles by keyword or topic..."
                  className="w-full bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Posts Grid Section */}
        <section className="bg-slate-50/60 py-16 lg:py-20">
          <div className="container-app">
            {isLoading ? (
              <div className="py-16"><PageLoader /></div>
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : !data?.items.length ? (
              <EmptyState icon={<FileText className="size-5" />} title="No articles found" description="Try a different search query." />
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((post) => (
                  <Link to={ROUTES.blogDetail(post.slug)} key={post.id} className="group">
                    <Card className="flex h-full flex-col p-7 bg-white border-slate-200 shadow-xs group-hover:border-blue-300 group-hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <Badge tone="primary" className="text-xs">
                          {post.category?.name || 'Engineering'}
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="size-3" /> 5 min read
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          {post.author?.fullName || 'ORBIT-I Engineering'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                          Read Article <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export function BlogTaxonomyPage({ type }: { type: 'category' | 'tag' }) {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, error, refetch } = useFetch(
    () => blogService.list(type === 'category' ? { category: slug } : { tag: slug }),
    [type, slug]
  )

  return (
    <>
      <SEO title={`${slug} | Engineering Insights | ORBIT-I`} description={`Technical articles categorized under ${slug}.`} path={`/blog/${type}/${slug}`} />
      <div className="pb-24">
        <section className="border-b border-slate-200 bg-white py-14">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <Link to={ROUTES.blog} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="size-4" /> All Insights
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 capitalize">
                {type}: {slug?.replace(/-/g, ' ')}
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-slate-50/60 py-16">
          <div className="container-app">
            {isLoading ? (
              <div className="py-16"><PageLoader /></div>
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : !data?.items.length ? (
              <EmptyState title="No posts found in this taxonomy" />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((post) => (
                  <Link to={ROUTES.blogDetail(post.slug)} key={post.id} className="group">
                    <Card className="h-full p-6 bg-white border-slate-200 group-hover:border-blue-300 transition-all">
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">{post.title}</h2>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error, refetch } = useFetch(() => blogService.getBySlug(slug!), [slug])

  if (isLoading) return <div className="py-24"><PageLoader /></div>
  if (error || !post) return <div className="container-app py-24"><ErrorState onRetry={refetch} /></div>

  return (
    <article className="pb-24">
      <SEO
        title={post.seoTitle || `${post.title} | ORBIT-I Insights`}
        description={post.seoDescription || post.excerpt}
        path={ROUTES.blogDetail(post.slug)}
        canonicalUrl={post.canonicalUrl}
        robots={post.robots}
        image={post.ogImage || post.coverImage}
        noindex={post.robots?.startsWith('noindex')}
        keywords={[post.focusKeyword, ...(post.secondaryKeywords || [])].filter(Boolean).join(',')}
        jsonLd={[
          buildArticleJsonLd(post),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: ROUTES.blog },
            { name: post.title, path: ROUTES.blogDetail(post.slug) },
          ]),
        ]}
      />

      {/* Article Header (Centered & Authoritative) */}
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <Link to={ROUTES.blog} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="size-4" /> Back to Insights
            </Link>

            <div className="flex justify-center">
              <Badge tone="primary" className="text-xs">
                {post.category?.name || 'Engineering'}
              </Badge>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              {post.title}
            </h1>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <User className="size-4 text-blue-600" />
                <span className="font-semibold text-slate-700">{post.author?.fullName || 'ORBIT-I Engineering'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-blue-600" />
                <span>Published on {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-blue-600" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white py-14">
        <div className="container-app">
          <div
            className="prose prose-slate lg:prose-lg mx-auto max-w-3xl leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mx-auto mt-12 max-w-3xl border-t border-slate-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Topic Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Badge key={t.id} tone="neutral" className="text-xs">
                    {t.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}
