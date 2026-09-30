import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Package } from 'lucide-react'
import { getApiErrorMessage } from '@/utils/apiError'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { productService } from '@/services/productService'
import { orderService } from '@/services/orderService'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext'

const statusTone = { available: 'success', coming_soon: 'warning', archived: 'neutral' } as const
const statusLabel = { available: 'Available', coming_soon: 'Coming soon', archived: 'Archived' } as const

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { data: product, isLoading, error, refetch } = useFetch(() => productService.getBySlug(slug!), [slug])
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !product) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Product not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState
            icon={<Package className="size-5" aria-hidden />}
            title="Product not found"
            description="This product may have been renamed or is no longer listed."
          />
        )}
      </div>
    )
  }

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.login, { state: { from: { pathname: ROUTES.productDetail(product.slug) } } })
      return
    }
    setOrderError(null)
    setIsOrdering(true)
    try {
      const order = await orderService.create([{ productId: product.id, quantity: 1 }])
      navigate(ROUTES.clientOrders, { state: { justOrderedId: order.id } })
    } catch (err) {
      setOrderError(getApiErrorMessage(err, 'Could not place the order. Please try again.'))
      setIsOrdering(false)
    }
  }

  return (
    <div className="pb-24">
      <section className="border-b border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-app grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to={ROUTES.products} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
              &larr; All Products
            </Link>
            <div className="mt-5 flex items-center gap-2">
              <Badge tone="neutral">{product.category?.name || 'SaaS'}</Badge>
              <Badge tone={statusTone[product.status]}>{statusLabel[product.status]}</Badge>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              {product.description}
            </p>

            <div className="mt-10 border-t border-slate-100 pt-8">
              <h2 className="text-xl font-bold text-slate-900">Core Features &amp; Capabilities</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-sm font-medium text-slate-800">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card hoverable={false} className="h-fit p-8 border-slate-200 bg-white shadow-xs lg:sticky lg:top-28">
            <p className="text-sm font-medium text-slate-500">Subscription pricing</p>
            <p className="mt-1 font-display text-4xl font-bold text-slate-900">
              ${product.price}
              <span className="text-base font-normal text-slate-500">/month</span>
            </p>
            <p className="mt-2 text-xs text-slate-500">Billed monthly. Cancel anytime. SLA guarantee.</p>

            {product.status === 'available' ? (
              <>
                <Button className="mt-6 w-full shadow-md" size="lg" isLoading={isOrdering} onClick={handleOrder}>
                  {isOrdering ? 'Starting order…' : isAuthenticated ? 'Start Order Now' : 'Log in to Subscribe'}
                </Button>
                {orderError && <p className="mt-3 text-center text-xs text-red-600">{orderError}</p>}
                {!orderError && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    {isAuthenticated ? "You'll see this order in your client dashboard." : "You'll need a client account to complete setup."}
                  </p>
                )}
              </>
            ) : (
              <Button className="mt-6 w-full" size="lg" variant="outline" disabled>
                Coming Soon
              </Button>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}
