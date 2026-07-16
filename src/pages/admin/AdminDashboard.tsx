import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, ArrowRight } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatCard, PageSpinner } from '@/components/ui'
import { ordersApi, productsApi, type OrderStats, type Order } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [productCount, setProductCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ordersApi.stats(),
      ordersApi.list({ limit: '5' }),
      productsApi.list({ limit: '1', showAll: 'true' }),
    ]).then(([s, o, p]) => {
      setStats(s); setRecentOrders(o.data); setProductCount(p.meta.total)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <AdminLayout><PageSpinner /></AdminLayout>

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={productCount.toLocaleString()} sub="in catalogue" />
        <StatCard label="Total Orders" value={stats?.totalOrders.toLocaleString() || '0'} sub="all time" />
        <StatCard label="Pending Orders" value={stats?.pendingOrders.toLocaleString() || '0'} sub="awaiting action" />
        <StatCard label="Revenue (Paid)" value={`₹${parseFloat(stats?.totalRevenue as any || '0').toLocaleString('en-IN', { minimumFractionDigits: 0 })}`} sub="total collected" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/admin/import', label: 'Import Excel', desc: 'Bulk upload products', icon: Package, color: 'bg-purple-50 text-purple-600' },
          { href: '/admin/products', label: 'Manage Products', desc: 'Edit prices & fitments', icon: Package, color: 'bg-blue-50 text-blue-600' },
          { href: '/admin/orders', label: 'View Orders', desc: 'Track & update orders', icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
        ].map(({ href, label, desc, icon: Icon, color }) => (
          <Link key={href} to={href} className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={18} /></div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ArrowRight size={15} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentOrders.length === 0 && <p className="px-6 py-8 text-center text-sm text-gray-400">No orders yet</p>}
          {recentOrders.map(order => (
            <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
                <p className="text-xs text-gray-400">{order.customer?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">₹{parseFloat(order.totalPrice).toLocaleString('en-IN')}</p>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'UNPAID' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>{order.paymentStatus}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
