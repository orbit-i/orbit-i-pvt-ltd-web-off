import { Link } from 'react-router-dom'
import { ShoppingBag, PackageCheck, Clock, PlusCircle, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { orderService } from '@/services/orderService'
import { useFetch } from '@/hooks/useFetch'
import { ROUTES } from '@/constants'
import type { Order, OrderStatus } from '@/types'

const statusTone: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  pending: 'warning',
  confirmed: 'primary',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

const columns: DataTableColumn<Order>[] = [
  { header: 'Order ID', render: (o) => <span className="font-semibold text-slate-900">#{o.id.slice(-6)}</span> },
  { header: 'Purchased Deliverables', render: (o) => <span className="font-medium text-slate-700">{o.items.map((i) => i.productName).join(', ')}</span> },
  { header: 'Total Amount', render: (o) => <span className="font-bold text-slate-900">{formatCurrency(o.total, o.currency)}</span> },
  {
    header: 'Fulfillment Status',
    render: (o) => <Badge tone={statusTone[o.status]}>{o.status.replace('_', ' ')}</Badge>,
  },
  { header: 'Order Date', render: (o) => formatDate(o.createdAt) },
]

export function ClientOrdersPage() {
  const { data: orders, isLoading, error, refetch } = useFetch(() => orderService.listMine(), [])
  const list = orders ?? []
  const activeOrders = list.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length
  const completedOrders = list.filter((o) => o.status === 'completed').length
  const totalSpend = list.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Commercial Orders &amp; Software Licenses</h2>
          <p className="mt-1 text-sm text-slate-600">Track delivery status, licenses, and official records of software purchased from ORBIT-I.</p>
        </div>
        <Link
          to={ROUTES.products}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="size-4" />
          Browse Products
        </Link>
      </div>

      {/* KPI Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Orders</p>
            <p className="text-lg font-bold text-slate-900">{list.length}</p>
          </div>
        </Card>
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">In Progress</p>
            <p className="text-lg font-bold text-slate-900">{activeOrders}</p>
          </div>
        </Card>
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <PackageCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Completed</p>
            <p className="text-lg font-bold text-slate-900">{completedOrders}</p>
          </div>
        </Card>
        <Card hoverable={false} className="p-4 bg-white border-slate-200 shadow-xs flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CreditCard className="size-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Volume</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(totalSpend, 'PKR')}</p>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          rows={list}
          keyField={(o) => o.id}
          emptyTitle="No orders placed yet"
          emptyDescription="Orders you place from the products catalog will be tracked and displayed here."
        />
      )}
    </div>
  )
}

