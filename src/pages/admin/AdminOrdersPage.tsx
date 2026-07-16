import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrderStatusBadge, PayStatusBadge, Pagination, PageSpinner, Toast } from '@/components/ui'
import { ordersApi, type Order } from '@/lib/api'

const ORDER_STATUSES = ['', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const PAY_STATUSES   = ['', 'UNPAID', 'PAID', 'FAILED', 'REFUNDED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 })
  const [search, setSearch] = useState('')
  const [oStatus, setOStatus] = useState('')
  const [pStatus, setPStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null)

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' }
      if (search) params.search = search
      if (oStatus) params.orderStatus = oStatus
      if (pStatus) params.paymentStatus = pStatus
      const res = await ordersApi.list(params)
      setOrders(res.data)
      setMeta({ total: res.meta.total, page: res.meta.page, pages: res.meta.pages })
    } finally { setLoading(false) }
  }, [search, oStatus, pStatus])

  useEffect(() => { load(1) }, [load])

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-semibold">Orders</h1><p className="text-sm text-gray-500 mt-0.5">{meta.total} total orders</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-8 text-sm" placeholder="Search order ID, customer, transaction…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-44" value={oStatus} onChange={e => setOStatus(e.target.value)}>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s || 'All statuses'}</option>)}
        </select>
        <select className="input w-44" value={pStatus} onChange={e => setPStatus(e.target.value)}>
          {PAY_STATUSES.map(s => <option key={s} value={s}>{s || 'All payments'}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Order ID</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Items</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Total</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Order</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Payment</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Date</th>
                <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center"><PageSpinner /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3"><Link to={`/admin/orders/${o.id}`} className="font-mono text-xs font-medium text-blue-600 hover:underline">{o.orderId}</Link></td>
                  <td className="px-4 py-3"><p className="font-medium text-gray-900 text-sm">{(o as any).customer?.name}</p><p className="text-xs text-gray-400">{(o as any).customer?.phone}</p></td>
                  <td className="px-4 py-3 text-gray-600">{(o as any).items?.length ?? 0} item{(o as any).items?.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₹{parseFloat(o.totalPrice).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.orderStatus} /></td>
                  <td className="px-4 py-3"><PayStatusBadge status={o.paymentStatus} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/admin/orders/${o.id}`} className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50">View</Link>
                      <button onClick={() => window.open(ordersApi.invoiceUrl(o.id), '_blank')} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Download Invoice">
                        <FileText size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          <Pagination page={meta.page} pages={meta.pages} onChange={load} />
        </div>
      </div>
    </AdminLayout>
  )
}
