import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, ListChecks } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageSpinner, Toast } from '@/components/ui'
import { productsApi, type Product, type FitmentInput } from '@/lib/api'

const EMPTY_FITMENT: FitmentInput = { make: '', model: '', yearFrom: '', yearTo: '', notes: '' }

export default function AdminProductEditPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = Number(searchParams.get('id'))

  const [product, setProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<Partial<Product>>({})
  const [newFit, setNewFit] = useState<FitmentInput>(EMPTY_FITMENT)
  const [newFeature, setNewFeature] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    productsApi.get(id).then(p => { setProduct(p); setForm(p) }).finally(() => setLoading(false))
  }, [id])

  function patch(field: string, value: unknown) { setForm(prev => ({ ...prev, [field]: value })) }

  function addFeature() {
    if (!newFeature.trim()) return
    patch('features', [...(form.features || []), newFeature.trim()])
    setNewFeature('')
  }

  function removeFeature(index: number) {
    patch('features', (form.features || []).filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await productsApi.update(id, { ...form, manualOverride: true })
      setProduct(res.data); setForm(res.data)
      setToast({ msg: 'Product saved successfully', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' })
    } finally { setSaving(false) }
  }

  async function handleAddFitment() {
    if (!newFit.make || !newFit.model || !newFit.yearFrom || !newFit.yearTo) {
      setToast({ msg: 'Fill all fitment fields', type: 'error' }); return
    }
    try {
      await productsApi.addFitment(id, newFit)
      const updated = await productsApi.get(id)
      setProduct(updated); setForm(updated); setNewFit(EMPTY_FITMENT)
      setToast({ msg: 'Fitment added', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  async function handleDeleteFitment(fitmentId: number) {
    try {
      await productsApi.deleteFitment(id, fitmentId)
      setForm(prev => ({ ...prev, fitments: prev.fitments?.filter(f => f.id !== fitmentId) }))
      setToast({ msg: 'Fitment removed', type: 'success' })
    } catch (e: any) { setToast({ msg: e.message, type: 'error' }) }
  }

  if (loading) return <AdminLayout><PageSpinner /></AdminLayout>

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{id ? 'Edit Product' : 'New Product'}</h1>
          {product && <p className="text-sm text-gray-400 font-mono">{product.sku}</p>}
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary ml-auto">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6">
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-medium text-gray-900 pb-2 border-b border-gray-100">Core Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">SKU <span className="text-red-400">*</span></label><input className="input" value={form.sku ?? ''} onChange={e => patch('sku', e.target.value)} /></div>
              <div><label className="label">OEM Number</label><input className="input" value={form.oemNumber ?? ''} onChange={e => patch('oemNumber', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className="label">Product Name <span className="text-red-400">*</span></label><input className="input" value={form.name ?? ''} onChange={e => patch('name', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className="label">Description</label><textarea className="input min-h-[100px] resize-y" value={form.description ?? ''} onChange={e => patch('description', e.target.value)} /></div>
              <div><label className="label">Price (₹) <span className="text-red-400">*</span></label><input type="number" step="0.01" min="0" className="input" value={form.price ?? ''} onChange={e => patch('price', e.target.value)} /></div>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <ListChecks size={18} className="text-red-600" />
              <h2 className="font-medium text-gray-900">Technical Specifications</h2>
            </div>
            <p className="text-xs text-gray-400">Add key selling points (e.g., "High-Flow Design", "OEM Certified").</p>
            <div className="flex gap-2">
              <input type="text" placeholder="Type a feature and press enter..." className="input flex-1" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
              <button type="button" onClick={addFeature} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"><Plus size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(form.features ?? []).map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <span className="text-sm font-medium text-gray-700">{feat}</span>
                  <button type="button" onClick={() => removeFeature(idx)} className="text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              ))}
              {(form.features?.length ?? 0) === 0 && (
                <div className="col-span-full py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-xs text-gray-400">No technical specs added yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="font-medium text-gray-900 mb-4">Fitment / Compatibility</h2>
            <table className="w-full text-sm mb-4">
              <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100"><th className="pb-2 pr-3">Make</th><th className="pb-2 pr-3">Model</th><th className="pb-2 pr-3">Years</th><th className="pb-2 pr-3">Notes</th><th className="pb-2"></th></tr></thead>
              <tbody>
                {(form.fitments ?? []).map(f => (
                  <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 pr-3 font-medium">{f.model.make.name}</td>
                    <td className="py-2.5 pr-3">{f.model.name}</td>
                    <td className="py-2.5 pr-3 text-gray-600">{f.yearRange.yearFrom}–{f.yearRange.yearTo}</td>
                    <td className="py-2.5 pr-3 text-gray-400 text-xs">{f.notes || '—'}</td>
                    <td className="py-2.5 text-right"><button onClick={() => handleDeleteFitment(f.id)} className="p-1 rounded hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-gray-500 mb-2">Add compatibility</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(['make', 'model', 'yearFrom', 'yearTo', 'notes'] as (keyof FitmentInput)[]).map(field => (
                  <div key={field}>
                    <label className="text-xs text-gray-500 block mb-1">{field}</label>
                    <input className="input text-xs py-1.5" placeholder={field} value={newFit[field]} onChange={e => setNewFit(prev => ({ ...prev, [field]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <button onClick={handleAddFitment} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"><Plus size={13} /> Add fitment</button>
            </div>
          </div>

          <div className="card">
            <h2 className="font-medium text-gray-900 mb-3">Product Images</h2>
            {(form.imageUrls ?? []).length === 0 ? (
              <p className="text-sm text-gray-400">No images. Upload via <a href="/admin/import" className="text-blue-600 underline">SKU image linker</a> (filename must match SKU).</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {(form.imageUrls ?? []).map((url, i) => (
                  <div key={i} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => patch('imageUrls', (form.imageUrls ?? []).filter((_, j) => j !== i))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-medium text-gray-900 pb-2 border-b border-gray-100">Visibility</h2>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status ?? 'ON'} onChange={e => patch('status', e.target.value)}>
                <option value="ON">On (Visible in shop)</option>
                <option value="OFF">Off (Hidden)</option>
              </select>
            </div>
            <div>
              <label className="label">Stock status</label>
              <select className="input" value={form.stockStatus ?? 'IN_STOCK'} onChange={e => patch('stockStatus', e.target.value)}>
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="BACKORDER">Backorder</option>
              </select>
            </div>
          </div>
          <div className="card space-y-4">
            <h2 className="font-medium text-gray-900 pb-2 border-b border-gray-100">Import protection</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.manualOverride ?? false} onChange={e => patch('manualOverride', e.target.checked)} className="mt-0.5 rounded" />
              <div>
                <p className="text-sm font-medium text-gray-700">Lock from Excel imports</p>
                <p className="text-xs text-gray-400 mt-0.5">When on, Excel re-imports will only update stock status, never overwrite your manual edits.</p>
              </div>
            </label>
          </div>
          <div className="card">
            <h2 className="font-medium text-gray-900 pb-2 border-b border-gray-100 mb-3">Info</h2>
            <div className="space-y-2 text-xs text-gray-400">
              <p>ID: {product?.id}</p>
              <p>Created: {product?.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN') : '—'}</p>
              <p>Last updated: {product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-IN') : '—'}</p>
              <p>Fitments: {form.fitments?.length ?? 0}</p>
              <p>Features: {form.features?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
