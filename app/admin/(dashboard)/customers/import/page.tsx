'use client'

import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Upload, Users, CheckCircle, AlertCircle, Loader2, FileText, X, ArrowRight } from 'lucide-react'

const WIX_FIELD_MAPPING: Record<string, string> = {
  'first name': 'firstName',
  'last name': 'lastName',
  'name': 'name',
  'email': 'email',
  'email address': 'email',
  'phone': 'phone',
  'phone number': 'phone',
  'mobile': 'phone',
  'contact id': 'wixContactId',
  'id': 'wixContactId',
  'labels': 'tags',
  'tags': 'tags',
  'notes': 'notes',
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim())
  return lines.slice(1).map(line => {
    // Handle quoted commas
    const values: string[] = []
    let inQuote = false
    let current = ''
    for (const char of line) {
      if (char === '"') inQuote = !inQuote
      else if (char === ',' && !inQuote) { values.push(current); current = '' }
      else current += char
    }
    values.push(current)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = (values[i] ?? '').trim() })
    return row
  }).filter(r => Object.values(r).some(v => v))
}

export default function WixImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [importResult, setImportResult] = useState<{ created: number; updated: number; skipped: number; errors: string[] } | null>(null)

  const importMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/customers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      return res.json()
    },
    onSuccess: (data) => {
      setImportResult(data.results)
      setStep('done')
    },
    onError: (err: any) => alert(`Import failed: ${err.message}`),
  })

  function handleFile(file: File) {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCsv(text)
      if (parsed.length === 0) { alert('No data rows found. Please check the CSV format.'); return }
      setHeaders(Object.keys(parsed[0]))
      setRows(parsed)
      setStep('preview')
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) handleFile(file)
  }

  const mappedCount = headers.filter(h => WIX_FIELD_MAPPING[h.toLowerCase()]).length
  const validRows = rows.filter(r => {
    const email = r['Email'] ?? r['Email Address'] ?? r['email'] ?? r['email address'] ?? ''
    const firstName = r['First Name'] ?? r['First name'] ?? r['first name'] ?? ''
    const lastName = r['Last Name'] ?? r['Last name'] ?? r['last name'] ?? ''
    const name = r['Name'] ?? r['name'] ?? `${firstName} ${lastName}`.trim()
    return email && name
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-clay">Import from Wix</h1>
        <p className="text-clay-light mt-1">Upload your Wix contacts CSV to import all customer details into the system.</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3">
        {(['Upload CSV', 'Preview Data', 'Done']).map((label, i) => {
          const stepKey = ['upload', 'preview', 'done'][i]
          const isActive = step === stepKey
          const isDone = ['upload', 'preview', 'done'].indexOf(step) > i
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isDone ? 'bg-sage text-white' : isActive ? 'bg-terracotta text-white' : 'bg-parchment text-clay-light'}`}>
                {isDone ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-clay' : 'text-clay-light'}`}>{label}</span>
              {i < 2 && <ArrowRight size={14} className="text-parchment" />}
            </div>
          )
        })}
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div
          className="bg-warm-white rounded-2xl shadow-pottery border-2 border-dashed border-parchment hover:border-terracotta/50 transition-all p-12 text-center cursor-pointer group"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-terracotta/20 transition-all">
            <Upload size={28} className="text-terracotta" />
          </div>
          <h2 className="font-playfair text-xl font-bold text-clay mb-2">Drop your Wix CSV here</h2>
          <p className="text-clay-light text-sm mb-6">or click to browse</p>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

          <div className="mt-6 p-4 bg-cream rounded-xl border border-parchment text-left max-w-md mx-auto">
            <p className="text-xs font-semibold text-clay mb-2 uppercase tracking-wide">How to export from Wix:</p>
            <ol className="text-xs text-clay-light space-y-1 list-decimal list-inside">
              <li>Go to Wix Dashboard → Contacts → All Contacts</li>
              <li>Click <strong>More Actions</strong> → <strong>Export Contacts</strong></li>
              <li>Choose <strong>All contacts</strong> and click <strong>Export</strong></li>
              <li>Download the CSV file and upload it here</li>
            </ol>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['First Name', 'Last Name', 'Email', 'Phone', 'Labels'].map(f => (
              <span key={f} className="px-2 py-1 bg-parchment text-clay-light text-xs rounded-full">{f}</span>
            ))}
            <span className="px-2 py-1 bg-parchment text-clay-light text-xs rounded-full">+ more fields supported</span>
          </div>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-sage" />
                </div>
                <div>
                  <p className="font-semibold text-clay">{fileName}</p>
                  <p className="text-xs text-clay-light">{rows.length} total rows · {validRows.length} importable · {headers.length} columns detected · {mappedCount} fields recognised</p>
                </div>
              </div>
              <button onClick={() => { setStep('upload'); setRows([]); setHeaders([]) }} className="text-clay-light hover:text-clay p-1.5 rounded-lg hover:bg-parchment transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Field mapping */}
            <div className="mt-4 p-3 bg-cream rounded-xl border border-parchment">
              <p className="text-xs font-semibold text-clay mb-2 uppercase tracking-wide">Field Mapping</p>
              <div className="flex flex-wrap gap-2">
                {headers.map(h => {
                  const mapped = WIX_FIELD_MAPPING[h.toLowerCase()]
                  return (
                    <div key={h} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border ${mapped ? 'bg-sage/10 border-sage/20 text-sage' : 'bg-parchment border-parchment text-clay-light'}`}>
                      <span>{h}</span>
                      {mapped && <span className="font-medium">→ {mapped}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {rows.length - validRows.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-amber-700 text-xs bg-amber-50 rounded-xl px-3 py-2">
                <AlertCircle size={14} />
                {rows.length - validRows.length} rows will be skipped (missing email or name)
              </div>
            )}
          </div>

          {/* Preview table */}
          <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 overflow-hidden">
            <div className="bg-cream border-b border-parchment px-5 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-clay">Data Preview (first 20 rows)</p>
              <Users size={16} className="text-clay-light" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-cream border-b border-parchment">
                  <tr>
                    {headers.slice(0, 8).map(h => (
                      <th key={h} className={`text-left px-3 py-2 font-semibold whitespace-nowrap ${WIX_FIELD_MAPPING[h.toLowerCase()] ? 'text-sage' : 'text-clay-light'}`}>{h}</th>
                    ))}
                    {headers.length > 8 && <th className="text-left px-3 py-2 text-clay-light">+{headers.length - 8} more</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment/50">
                  {rows.slice(0, 20).map((row, i) => (
                    <tr key={i} className="hover:bg-cream/50">
                      {headers.slice(0, 8).map(h => (
                        <td key={h} className="px-3 py-2 text-clay-light truncate max-w-[120px]">{row[h] || '—'}</td>
                      ))}
                      {headers.length > 8 && <td className="px-3 py-2 text-clay-light">…</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 20 && <p className="text-xs text-clay-light text-center py-3">Showing 20 of {rows.length} rows</p>}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStep('upload'); setRows([]); setHeaders([]) }} className="btn-secondary flex-1 py-3">
              Choose Different File
            </button>
            <button
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending || validRows.length === 0}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {importMutation.isPending ? (
                <><Loader2 size={16} className="animate-spin" /> Importing...</>
              ) : (
                <><Users size={16} /> Import {validRows.length} Customers</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 'done' && importResult && (
        <div className="bg-warm-white rounded-2xl shadow-pottery border border-parchment/50 p-8 text-center space-y-5">
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-sage" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-clay mb-2">Import Complete!</h2>
            <p className="text-clay-light">Your Wix contacts have been imported successfully.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="bg-sage/10 rounded-xl p-4">
              <p className="text-2xl font-bold text-sage">{importResult.created}</p>
              <p className="text-xs text-clay-light">New Customers</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-700">{importResult.updated}</p>
              <p className="text-xs text-clay-light">Updated</p>
            </div>
            <div className="bg-parchment rounded-xl p-4">
              <p className="text-2xl font-bold text-clay-light">{importResult.skipped}</p>
              <p className="text-xs text-clay-light">Skipped</p>
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="text-left bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> {importResult.errors.length} errors
              </p>
              <ul className="text-xs text-red-600 space-y-1">
                {importResult.errors.slice(0, 10).map((e, i) => <li key={i}>• {e}</li>)}
                {importResult.errors.length > 10 && <li>...and {importResult.errors.length - 10} more</li>}
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep('upload'); setRows([]); setHeaders([]); setImportResult(null) }} className="btn-secondary py-3 px-6">
              Import Another File
            </button>
            <a href="/admin/customers" className="btn-primary py-3 px-6">
              View Customers
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
