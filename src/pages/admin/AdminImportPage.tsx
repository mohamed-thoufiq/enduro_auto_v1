import { useState, useRef } from 'react'
import { Upload, Download, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { importApi } from '@/lib/api'

type ImportResult = { success: boolean; duration_ms: number; total_rows: number; imported: number; skipped: number; overriddenSkipped: number; errors: { row: number; sku: string; error: string }[] }
type ImageResult = { success: boolean; total: number; linked: number; notFound: { filename: string; sku: string }[]; errors: { filename: string; error: string }[] }

export default function AdminImportPage() {
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [excelResult, setExcelResult] = useState<ImportResult | null>(null)
  const [excelLoading, setExcelLoading] = useState(false)
  const excelRef = useRef<HTMLInputElement>(null)

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageResult, setImageResult] = useState<ImageResult | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)

  const [dragExcel, setDragExcel] = useState(false)
  const [dragImage, setDragImage] = useState(false)

  async function handleExcelUpload() {
    if (!excelFile) return
    setExcelLoading(true); setExcelResult(null)
    const fd = new FormData(); fd.append('file', excelFile)
    const res = await importApi.excel(fd)
    setExcelResult(res); setExcelLoading(false)
  }

  async function handleImageUpload() {
    if (!imageFiles.length) return
    setImageLoading(true); setImageResult(null)
    const fd = new FormData(); imageFiles.forEach(f => fd.append('images', f))
    const res = await importApi.images(fd)
    setImageResult(res); setImageLoading(false)
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Import</h1>
        <p className="text-sm text-gray-500 mt-1">Bulk import products via Excel, then batch-link product images by SKU.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><FileSpreadsheet size={18} className="text-green-600" /> Excel Import</h2>
              <p className="text-xs text-gray-400 mt-0.5">Upload .xlsx file to bulk-import products</p>
            </div>
            <a href={importApi.templateUrl()} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"><Download size={13} /> Template</a>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragExcel(true) }}
            onDragLeave={() => setDragExcel(false)}
            onDrop={e => { e.preventDefault(); setDragExcel(false); const f = e.dataTransfer.files[0]; if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) setExcelFile(f) }}
            onClick={() => excelRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragExcel ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            {excelFile ? <><p className="text-sm font-medium text-gray-900">{excelFile.name}</p><p className="text-xs text-gray-400 mt-0.5">{(excelFile.size / 1024).toFixed(0)} KB</p></>
              : <><p className="text-sm text-gray-500">Drag & drop your .xlsx file here</p><p className="text-xs text-gray-400 mt-1">or click to browse</p></>}
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e => setExcelFile(e.target.files?.[0] || null)} />
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Expected columns</p>
            <div className="flex flex-wrap gap-1.5">
              {['SKU*', 'Name*', 'Price*', 'OEM', 'Description', 'StockStatus', 'Make', 'Model', 'YearFrom', 'YearTo', 'FitmentNotes'].map(c => (
                <span key={c} className={`text-xs px-2 py-0.5 rounded font-mono ${c.includes('*') ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{c}</span>
              ))}
            </div>
          </div>
          <button onClick={handleExcelUpload} disabled={!excelFile || excelLoading} className="btn-primary w-full justify-center flex">
            {excelLoading ? 'Importing…' : 'Import Products'}
          </button>
          {excelResult && (
            <div className={`rounded-xl p-4 text-sm space-y-2 ${excelResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 font-semibold">
                {excelResult.success ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-red-500" />}
                Import complete — {excelResult.duration_ms}ms
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white rounded p-2 text-center border border-green-200"><p className="font-bold text-green-700 text-lg">{excelResult.imported}</p><p className="text-gray-500">Imported</p></div>
                <div className="bg-white rounded p-2 text-center border border-amber-200"><p className="font-bold text-amber-600 text-lg">{excelResult.overriddenSkipped}</p><p className="text-gray-500">Locked</p></div>
                <div className="bg-white rounded p-2 text-center border border-red-200"><p className="font-bold text-red-500 text-lg">{excelResult.errors.length}</p><p className="text-gray-500">Errors</p></div>
              </div>
              {excelResult.errors.length > 0 && (
                <div className="bg-white rounded-lg p-3 max-h-40 overflow-y-auto space-y-1 border border-red-100">
                  {excelResult.errors.map((e, i) => <p key={i} className="text-xs text-red-600">Row {e.row} ({e.sku || '?'}): {e.error}</p>)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card space-y-5">
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Upload size={18} className="text-purple-600" /> SKU Image Linker</h2>
            <p className="text-xs text-gray-400 mt-0.5">Images auto-link to products if filename matches SKU (e.g. <code className="bg-gray-100 px-1 rounded">TR-500.jpg</code>)</p>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragImage(true) }}
            onDragLeave={() => setDragImage(false)}
            onDrop={e => { e.preventDefault(); setDragImage(false); const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')); setImageFiles(files) }}
            onClick={() => imageRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragImage ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}>
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            {imageFiles.length > 0
              ? <><p className="text-sm font-medium text-gray-900">{imageFiles.length} image{imageFiles.length !== 1 ? 's' : ''} selected</p><p className="text-xs text-gray-400 mt-0.5">{imageFiles.slice(0, 3).map(f => f.name).join(', ')}{imageFiles.length > 3 ? '…' : ''}</p></>
              : <><p className="text-sm text-gray-500">Drag & drop images here</p><p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — up to 100 files</p></>}
            <input ref={imageRef} type="file" accept="image/*" multiple className="hidden" onChange={e => setImageFiles(Array.from(e.target.files || []))} />
          </div>
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto">
              {imageFiles.map((f, i) => <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden" title={f.name}><img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" /></div>)}
            </div>
          )}
          <button onClick={handleImageUpload} disabled={!imageFiles.length || imageLoading} className="btn-primary w-full justify-center flex" style={{ background: '#7C3AED' }}>
            {imageLoading ? 'Linking…' : 'Link Images to SKUs'}
          </button>
          {imageResult && (
            <div className="rounded-xl p-4 text-sm space-y-3 bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 font-semibold text-purple-800"><CheckCircle size={16} className="text-purple-600" />{imageResult.linked} of {imageResult.total} images linked</div>
              {imageResult.notFound.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">No matching SKU found:</p>
                  <div className="bg-white rounded-lg p-2 max-h-28 overflow-y-auto space-y-0.5 border border-purple-100">
                    {imageResult.notFound.map((n, i) => <p key={i} className="text-xs text-gray-500 font-mono">{n.filename} → SKU "{n.sku}" not found</p>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
