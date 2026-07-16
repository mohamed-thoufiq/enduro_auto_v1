import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, GripVertical, Globe, Eye, EyeOff } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageSpinner, Toast } from '@/components/ui'
import { brandsApi, type Brand } from '@/lib/api'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', websiteUrl: '' })
  const [logo, setLogo] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { brandsApi.list(true).then(setBrands).finally(() => setLoading(false)) }, [])

  async function handleAdd() {
    if (!form.name || !logo) { setToast({ msg: 'Brand name and logo required', type: 'error' }); return }
    const fd = new FormData()
    fd.append('name', form.name); fd.append('logo', logo)
    if (form.websiteUrl) fd.append('websiteUrl', form.websiteUrl)
    fd.append('sortOrder', String(brands.length))
    const res = await brandsApi.create(fd)
    if (res.error) { setToast({ msg: res.error, type: 'error' }); return }
    setBrands(prev => [...prev, res])
    setForm({ name: '', websiteUrl: '' }); setLogo(null); setAdding(false)
    setToast({ msg: 'Brand added', type: 'success' })
  }

  async function toggleActive(brand: Brand) {
    const fd = new FormData(); fd.append('isActive', String(!brand.isActive))
    await brandsApi.update(brand.id, fd)
    setBrands(prev => prev.map(b => b.id === brand.id ? { ...b, isActive: !b.isActive } : b))
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this brand?')) return
    await brandsApi.delete(id)
    setBrands(prev => prev.filter(b => b.id !== id))
    setToast({ msg: 'Brand deleted', type: 'success' })
  }

  return (
    <AdminLayout>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-semibold">Partner Brands</h1><p className="text-sm text-gray-500 mt-0.5">Manage logos shown in the homepage carousel</p></div>
        <button onClick={() => setAdding(o => !o)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Brand</button>
      </div>
      {adding && (
        <div className="card mb-6 space-y-4">
          <h2 className="font-medium text-gray-900">New Brand</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Brand Name *</label><input className="input" placeholder="e.g. Bosch" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="label">Website URL</label><input className="input" placeholder="https://bosch.com" value={form.websiteUrl} onChange={e => setForm(p => ({ ...p, websiteUrl: e.target.value }))} /></div>
          </div>
          <div>
            <label className="label">Logo Image *</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-gray-50 transition-colors">
              {logo ? (
                <div className="flex items-center gap-3">
                  <img src={URL.createObjectURL(logo)} alt="" className="w-16 h-10 object-contain" />
                  <p className="text-sm text-gray-600">{logo.name}</p>
                </div>
              ) : <p className="text-sm text-gray-400">Click to upload logo (PNG, SVG, WebP)</p>}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setLogo(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary">Save Brand</button>
            <button onClick={() => setAdding(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
      {loading ? <PageSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {brands.length === 0 ? (
            <p className="py-16 text-center text-gray-400">No brands yet. Add your first partner brand.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium w-8"></th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Logo</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Brand</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Website</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Visible</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {brands.map(brand => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3"><GripVertical size={14} className="text-gray-300 cursor-grab" /></td>
                    <td className="px-4 py-3">
                      <div className="w-16 h-10 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{brand.name}</td>
                    <td className="px-4 py-3">
                      {brand.websiteUrl ? <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline text-xs"><Globe size={12} /> Visit</a> : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(brand)} className="flex items-center gap-1 text-xs">
                        {brand.isActive ? <><Eye size={14} className="text-green-500" /><span className="text-green-600">Visible</span></> : <><EyeOff size={14} className="text-gray-300" /><span className="text-gray-400">Hidden</span></>}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(brand.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
