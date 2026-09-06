'use client'

import { useState, useRef } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  Loader2,
  RefreshCw,
  UploadCloud,
  X,
} from 'lucide-react'
import {
  parseCsvText,
  validateAndMapRows,
  downloadSampleCsvTemplate,
} from '@/lib/csvParser'

export default function BulkIngestModal({ isOpen, onClose, sectors = [], onBatchSuccess }) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState('')
  const [parsedRows, setParsedRows] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterTab, setFilterTab] = useState('all') // all, valid, errors
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const processFile = (file) => {
    if (!file) return
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setUploadError('Please upload a valid .csv file.')
      return
    }

    setUploadError('')
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const rawRows = parseCsvText(text)
        if (rawRows.length === 0) {
          setUploadError('The selected CSV file appears to be empty or missing headers.')
          return
        }
        const validated = validateAndMapRows(rawRows, sectors)
        setParsedRows(validated)
      } catch (err) {
        setUploadError('Failed to parse CSV file: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const validRows = parsedRows.filter((r) => r.isValid)
  const invalidRows = parsedRows.filter((r) => !r.isValid)
  const totalPreviewEmissions = validRows
    .reduce((acc, r) => acc + (r.emissions || 0), 0)
    .toFixed(2)

  const displayedRows =
    filterTab === 'valid'
      ? validRows
      : filterTab === 'errors'
      ? invalidRows
      : parsedRows

  const handleConfirmImport = async () => {
    if (validRows.length === 0) return

    setIsProcessing(true)
    setUploadError('')

    try {
      const payload = {
        records: validRows.map((r) => ({
          date: r.date,
          sector: r.sector,
          activityType: r.activityType,
          quantity: r.quantity,
          notes: r.notes || `Bulk ingested from ${fileName}`,
        })),
      }

      const res = await fetch('/api/emissions/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (json.success && Array.isArray(json.data)) {
        onBatchSuccess(json.data)
        onClose()
      } else {
        setUploadError(json.error || 'Failed to complete batch import.')
      }
    } catch (err) {
      setUploadError('Network error during batch import: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFileName('')
    setParsedRows([])
    setUploadError('')
    setFilterTab('all')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Bulk Emissions Ingestion</h3>
              <p className="text-xs text-slate-500">
                Batch-import utility bills, fleet records, and submeter logs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">Need the correct column format?</p>
              <p className="text-[11px] text-slate-500">
                Required headers: Date, Sector, ActivityType, Quantity, Notes
              </p>
            </div>
            <button
              type="button"
              onClick={downloadSampleCsvTemplate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition"
            >
              <Download size={13} />
              Download CSV Template
            </button>
          </div>

          {/* Upload Dropzone */}
          {parsedRows.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <FileSpreadsheet size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag & drop your CSV file here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports standard comma-separated utility and fleet logs (.csv)
              </p>
            </div>
          ) : (
            /* File Loaded Summary Bar */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 font-mono">{fileName}</p>
                    <p className="text-[11px] text-slate-500">
                      {parsedRows.length} total rows parsed · {validRows.length} valid · {invalidRows.length} flagged
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Carbon Impact</span>
                    <p className="text-base font-bold text-emerald-800">
                      +{totalPreviewEmissions} <span className="text-xs font-semibold">tCO₂e</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                  >
                    <RefreshCw size={12} /> Replace File
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`rounded-lg px-3 py-1 font-medium transition ${
                    filterTab === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Rows ({parsedRows.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('valid')}
                  className={`rounded-lg px-3 py-1 font-medium transition ${
                    filterTab === 'valid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  Valid ({validRows.length})
                </button>
                {invalidRows.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterTab('errors')}
                    className={`rounded-lg px-3 py-1 font-medium transition ${
                      filterTab === 'errors'
                        ? 'bg-amber-600 text-white'
                        : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Flagged Errors ({invalidRows.length})
                  </button>
                )}
              </div>

              {/* Preview Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Row</th>
                      <th className="px-3 py-2.5 font-semibold">Date</th>
                      <th className="px-3 py-2.5 font-semibold">Sector</th>
                      <th className="px-3 py-2.5 font-semibold">Source</th>
                      <th className="px-3 py-2.5 font-semibold">Consumption</th>
                      <th className="px-3 py-2.5 font-semibold">Scope</th>
                      <th className="px-3 py-2.5 font-semibold">Emissions</th>
                      <th className="px-4 py-2.5 font-semibold">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedRows.map((row) => (
                      <tr
                        key={row.rowNum}
                        className={row.isValid ? 'hover:bg-slate-50/50' : 'bg-red-50/40 hover:bg-red-50/60'}
                      >
                        <td className="px-4 py-2.5 font-mono text-slate-400">{row.rowNum}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.date}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-800">{row.sector}</td>
                        <td className="px-3 py-2.5 text-slate-600">{row.activityType}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-700">
                          {row.quantity.toLocaleString()} {row.unit}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {row.scope}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-slate-900">
                          {row.emissions.toFixed(2)} t
                        </td>
                        <td className="px-4 py-2.5">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <CheckCircle2 size={13} /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600" title={row.errors.join('; ')}>
                              <AlertCircle size={13} /> {row.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle size={16} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <p className="text-xs text-slate-400">
            {validRows.length > 0 && `${validRows.length} records ready for database ingestion`}
          </p>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={validRows.length === 0 || isProcessing}
              onClick={handleConfirmImport}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Ingesting Batch...
                </>
              ) : (
                <>
                  <FileUp size={14} />
                  Import {validRows.length} Valid Records
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
