import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'

const statusTone = { available: 'success', coming_soon: 'warning', archived: 'neutral' } as const
const statusLabel = { available: 'Active', coming_soon: 'Coming Soon', archived: 'Archived' } as const

export function ProductsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const { data: categories } = useFetch(() => categoryService.list(), [])
  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useFetch(
    () =>
      productService.list({
        search: query || undefined,
        category: category === 'all' ? undefined : category,
      }),
    [query, category]
  )

  const products = result?.items ?? []

  return (
    <>
      <SEO {...PAGE_SEO.products} />
      <div className="pb-24">
        {/* Centered Page Header */}
        <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-xs">
                Proprietary SaaS Solutions
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                Software products built and maintained by ORBIT-I
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
                Alongside custom client engineering, we build internal SaaS products designed to remove operational friction for modern businesses.
              </p>

              {/* Centered Search */}
              <div className="mt-8 mx-auto flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
                <Search className="ml-3 size-4 text-slate-400 shrink-0" aria-hidden />
                <input
                  placeholder="Search products by keyword..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Products Grid */}
        <section className="bg-slate-50/60 py-16 lg:py-20">
          <div className="container-app">
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                <button
                  onClick={() => setCategory('all')}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    category === 'all'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                  }`}
                >
                  All Products
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                      category === c.id
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="py-16"><PageLoader /></div>
            ) : error ? (
              <div className="py-16"><ErrorState onRetry={refetch} /></div>
            ) : products.length === 0 ? (
              <div className="py-16">
                <EmptyState
                  icon={<Package className="size-5" aria-hidden />}
                  title="No products match your search"
                  description="Try a different keyword or clear the category filter."
                />
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link key={product.id} to={ROUTES.productDetail(product.slug)} className="group">
                    <Card className="flex h-full flex-col p-7 bg-white border-slate-200 shadow-xs group-hover:border-blue-300 group-hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <Badge tone="neutral" className="text-xs">
                          {product.category?.name || 'SaaS'}
                        </Badge>
                        <Badge tone={statusTone[product.status]} className="text-xs">
                          {statusLabel[product.status]}
                        </Badge>
                      </div>

                      <h3 className="mt-4 font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {product.shortDescription}
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-display text-xl font-bold text-slate-900">
                          ${product.price}
                          <span className="text-xs font-normal text-slate-500">/mo</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                          View Specs <ArrowRight className="size-3" />
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
