// src/components/debug/DebugOverlay.tsx
import { useState, useEffect, useCallback, useRef } from 'react'

type LogEntry = { ts: number; type: 'api'|'query'|'error'|'info'; label: string; duration: number|null; payload: unknown }
declare global { interface Window { __debug?: { log: (e: Omit<LogEntry,'ts'>) => void; clear: () => void } } }

export function DebugOverlay() {
  if (import.meta.env.MODE !== 'development') return null
  return <DebugInner />
}

function DebugInner() {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<LogEntry|null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const addEntry = useCallback((e: Omit<LogEntry,'ts'>) => {
    setEntries(prev => [...prev.slice(-299), { ...e, ts: Date.now() }])
  }, [])

  useEffect(() => {
    window.__debug = { log: addEntry, clear: () => setEntries([]) }
    return () => { delete window.__debug }
  }, [addEntry])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.ctrlKey && e.shiftKey && e.key === 'D') setOpen(o => !o) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries, open])

  const visible = entries.filter(e => filter === 'all' || e.type === filter)
  const typeColor = (t: string) => ({ api:'#60A5FA', query:'#34D399', error:'#F87171', info:'#FBBF24' }[t] || '#94A3B8')

  return (
    <>
      <button onClick={() => setOpen(o => !o)}
        style={{ position:'fixed', bottom:80, right:16, zIndex:9998, width:32, height:32, borderRadius:'50%', background: open ? '#1E3A5F' : '#1F2937', color:'#60A5FA', fontSize:11, fontWeight:700, border:'1px solid #374151', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace' }}
        title="Debug overlay (Ctrl+Shift+D)">{open ? '×' : 'D'}</button>
      {open && (
        <div style={{ position:'fixed', bottom:120, right:16, zIndex:9999, width:500, height:440, background:'#0F172A', borderRadius:10, border:'1px solid #1E293B', display:'flex', flexDirection:'column', fontFamily:'monospace', fontSize:11, color:'#CBD5E1' }}>
          <div style={{ padding:'8px 12px', borderBottom:'1px solid #1E293B', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'#60A5FA', fontWeight:700, fontSize:12 }}>◉ DEBUG</span>
            <span style={{ color:'#475569', fontSize:10 }}>{entries.length} entries</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
              {['all','api','query','error'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding:'2px 7px', borderRadius:4, fontSize:10, cursor:'pointer', background: filter===f ? '#1E3A5F' : 'transparent', border:`1px solid ${filter===f ? '#60A5FA' : '#1E293B'}`, color: filter===f ? '#60A5FA' : '#475569' }}>{f}</button>
              ))}
              <button onClick={() => setEntries([])} style={{ padding:'2px 7px', borderRadius:4, fontSize:10, cursor:'pointer', background:'transparent', border:'1px solid #1E293B', color:'#475569' }}>clear</button>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
            {visible.length === 0 && <div style={{ padding:20, color:'#334155', textAlign:'center' }}>Make API calls to see logs here</div>}
            {visible.map((e, i) => (
              <div key={i} onClick={() => setSelected(selected?.ts === e.ts ? null : e)}
                style={{ padding:'4px 12px', cursor:'pointer', background: selected?.ts === e.ts ? '#1E293B' : 'transparent', borderLeft:`2px solid ${typeColor(e.type)}`, marginLeft:4, marginBottom:1 }}>
                <div style={{ display:'flex', justifyBetween:'space-between' }}>
                  <span style={{ color:typeColor(e.type), marginRight:8 }}>[{e.type}]</span>
                  <span style={{ flex:1, color:'#CBD5E1', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.label}</span>
                  {e.duration != null && <span style={{ color: e.duration > 500 ? '#F87171' : '#34D399', marginLeft:8 }}>{e.duration}ms</span>}
                </div>
                {selected?.ts === e.ts && e.payload && (
                  /* CHANGED: Safely stringified the unknown payload as standard ReactNode string structure */
                  <pre style={{ margin:'4px 0 2px', color:'#94A3B8', fontSize:10, whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
                    {JSON.stringify(e.payload as any, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding:'4px 12px', borderTop:'1px solid #1E293B', color:'#334155', fontSize:9 }}>Ctrl+Shift+D to toggle  •  Click entry to expand JSON</div>
        </div>
      )}
    </>
  )
}