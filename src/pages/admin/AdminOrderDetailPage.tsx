import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrderStatusBadge, PayStatusBadge, PageSpinner, Toast } from '@/components/ui'
import { ordersApi, type Order } from '@/lib/api'
import { ArrowLeft, FileText } from 'lucide-react'

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const PAY_STATUSES   = ['UNPAID', 'PAID', 'FAILED', 'REFUNDED']

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null)

  useEffect(() => {
    if (!id) return
    ordersApi.get(Number(id)).then(setOrder).finally(() => setLoading(false))
  }, [id])

  async function updateField(field: string, value: string) {
    if (!order) return
    setSaving(true)
    try {
      const updated = await ordersApi.update(order.id, { [field]: value } as any)
      setOrder(updated)
      setToast({ msg: 'Order updated', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' })
    } finally { setSaving(false) }
  }

  if (loading) return <AdminLayout><PageSpinner /></AdminLayout>
  if (!order) return <AdminLayout><p className="text-gray-400">Order not found</p></AdminLayout>

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/orders" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{order.orderId}</h1>
          <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => window.open(ordersApi.invoiceUrl(order.id), '_blank')} className="btn-secondary flex items-center gap-2"><FileText size={15} /> Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="divide-y divide-gray-50">
              {order.items.map(item => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  {item.product?.imageUrls?.[0] && <img src={item.product.imageUrls[0]} alt="" className="w-14 h-14 object-contain bg-gray-50 rounded-xl border p-1" />}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.product?.name || item.skuSnapshot}</p>
                    <p className="text-xs text-gray-400">SKU: {item.skuSnapshot} · Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(parseFloat(item.priceAtPurchase) * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{(parseFloat(order.totalPrice) - parseFloat(order.taxAmount)).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{parseFloat(order.taxAmount).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base"><span>Total</span><span>₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <address className="not-italic text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.customer?.name}</p>
              <p>{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country || 'India'}</p>
            </address>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-900">Status</h2>
            <div>
              <label className="label">Order Status</label>
              <select className="input" value={order.orderStatus} onChange={e => updateField('orderStatus', e.target.value)} disabled={saving}>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Payment Status</label>
              <select className="input" value={order.paymentStatus} onChange={e => updateField('paymentStatus', e.target.value)} disabled={saving}>
                {PAY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              <OrderStatusBadge status={order.orderStatus} />
              <PayStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          <div className="card space-y-3 text-sm">
            <h2 className="font-semibold text-gray-900">Customer</h2>
            <p className="text-gray-700"><span className="text-gray-400">Name: </span>{order.customer?.name}</p>
            <p className="text-gray-700"><span className="text-gray-400">Email: </span>{order.customer?.email}</p>
            <p className="text-gray-700"><span className="text-gray-400">Phone: </span>{order.customer?.phone}</p>
            {order.paymentMethod && <p className="text-gray-700"><span className="text-gray-400">Method: </span>{order.paymentMethod}</p>}
            {order.transactionId && <p className="text-gray-700 break-all"><span className="text-gray-400">Txn ID: </span>{order.transactionId}</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
