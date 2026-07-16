import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StockBadge, Pagination, PageSpinner, Toast } from '@/components/ui'
import { productsApi, type Product } from '@/lib/api'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null)

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await productsApi.list({ page, limit: 20, showAll: 'true', ...(search ? { sku: search } : {}) })
      setProducts(res.data)
      setMeta({ total: res.meta.total, page: res.meta.page, pages: res.meta.pages })
    } finally { setLoading(false) }
  }, [search])

  useEffect(() => { load(1) }, [load])

  async function toggleStatus(p: Product) {
    try {
      await productsApi.update(p.id, { status: p.status === 'ON' ? 'OFF' : 'ON' })
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: x.status === 'ON' ? 'OFF' : 'ON' } : x))
    } catch { setToast({ msg: 'Failed to update status', type: 'error' }) }
  }

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await productsApi.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      setToast({ msg: 'Product deleted', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-semibold">Products</h1><p className="text-sm text-gray-500 mt-0.5">{meta.total} total products</p></div>
        <Link to="/admin/products/edit" className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Product</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search by SKU…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">SKU</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Stock</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Visible</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Override</th>
                <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center"><PageSpinner /></td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-gray-700">{p.sku}</td>
                  <td className="px-5 py-3"><p className="font-medium text-gray-900 leading-tight">{p.name}</p>{p.oemNumber && <p className="text-xs text-gray-400">OEM: {p.oemNumber}</p>}</td>
                  <td className="px-4 py-3 font-medium">₹{parseFloat(p.price).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><StockBadge status={p.stockStatus} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(p)} className="flex items-center gap-1 text-xs">
                      {p.status === 'ON' ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-gray-300" />}
                      <span className={p.status === 'ON' ? 'text-green-600' : 'text-gray-400'}>{p.status}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">{p.manualOverride ? <span className="badge-amber">🔒 Locked</span> : <span className="badge-gray">Auto</span>}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/products/edit?id=${p.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit size={15} /></Link>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
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
