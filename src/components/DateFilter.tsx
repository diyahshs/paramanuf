'use client'
import { useState, useEffect, useRef } from 'react'

export type PeriodKey = 'today' | 'yesterday' | 'prev_week' | 'prev_7' | 'prev_30' | 'prev_month' | 'prev_3m' | 'prev_12m' | 'fixed' | 'relative'

interface DateFilterProps {
  value: PeriodKey
  onChange: (period: PeriodKey, label: string) => void
}

const QUICK_OPTIONS = [
  { k: 'today', label: 'Today' },
  { k: 'yesterday', label: 'Yesterday' },
  { k: 'prev_week', label: 'Previous week' },
  { k: 'prev_7', label: 'Previous 7 days' },
  { k: 'prev_30', label: 'Previous 30 days' },
  null,
  { k: 'prev_month', label: 'Previous month' },
  { k: 'prev_3m', label: 'Previous 3 months' },
  { k: 'prev_12m', label: 'Previous 12 months' },
]

export default function DateFilter({ value, onChange }: DateFilterProps) {
  const [open, setOpen] = useState(false)
  const [subMode, setSubMode] = useState<'none' | 'fixed' | 'relative'>('none')
  const [relTab, setRelTab] = useState<'last' | 'this'>('last')
  const [relN, setRelN] = useState('7')
  const [relUnit, setRelUnit] = useState('days')
  const [thisUnit, setThisUnit] = useState('month')
  const [fixedFrom, setFixedFrom] = useState('')
  const [fixedTo, setFixedTo] = useState('')
  const [displayLabel, setDisplayLabel] = useState('Today')
  const ref = useRef<HTMLDivElement>(null)

  // click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSubMode('none')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const NOW = new Date(2026, 6, 4)
  function fmt(d: Date) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }

  function getRelPreview() {
    if (relTab === 'last') {
      const n = parseInt(relN) || 1
      const end = new Date(NOW), start = new Date(NOW)
      if (relUnit === 'days') start.setDate(start.getDate() - n)
      else if (relUnit === 'weeks') start.setDate(start.getDate() - n * 7)
      else if (relUnit === 'months') start.setMonth(start.getMonth() - n)
      else if (relUnit === 'quarters') start.setMonth(start.getMonth() - n * 3)
      else if (relUnit === 'years') start.setFullYear(start.getFullYear() - n)
      return `Past ${n} ${relUnit} (${fmt(start)} – ${fmt(end)})`
    } else {
      let start: Date, end: Date
      if (thisUnit === 'week') {
        const day = NOW.getDay()
        start = new Date(NOW); start.setDate(NOW.getDate() - day + 1)
        end = new Date(start); end.setDate(start.getDate() + 6)
      } else if (thisUnit === 'month') {
        start = new Date(NOW.getFullYear(), NOW.getMonth(), 1)
        end = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 0)
      } else if (thisUnit === 'quarter') {
        const q = Math.floor(NOW.getMonth() / 3)
        start = new Date(NOW.getFullYear(), q * 3, 1)
        end = new Date(NOW.getFullYear(), q * 3 + 3, 0)
      } else {
        start = new Date(NOW.getFullYear(), 0, 1)
        end = new Date(NOW.getFullYear(), 11, 31)
      }
      return `This ${thisUnit} (${fmt(start!)} – ${fmt(end!)})`
    }
  }

  function applyQuick(k: string, label: string) {
    setDisplayLabel(label)
    setSubMode('none')
    setOpen(false)
    onChange(k as PeriodKey, label)
  }

  function applyFixed() {
    if (!fixedFrom || !fixedTo) return
    const label = `${fixedFrom} → ${fixedTo}`
    setDisplayLabel(label)
    setOpen(false)
    setSubMode('none')
    onChange('fixed', label)
  }

  function applyRelative() {
    const label = getRelPreview()
    setDisplayLabel(label)
    setOpen(false)
    setSubMode('none')
    onChange('relative', label)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); setSubMode('none') }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
      >
        <i className="ti ti-calendar text-sm" />
        {displayLabel}
        <i className="ti ti-chevron-down text-[10px]" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] bg-white border border-gray-200 rounded-xl p-1.5 w-64 z-50 shadow-xl">
          {/* Quick options */}
          {QUICK_OPTIONS.map((opt, i) =>
            !opt ? <div key={i} className="h-px bg-gray-100 my-1" /> : (
              <button
                key={opt.k}
                onClick={() => applyQuick(opt.k, opt.label)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 transition-colors"
                style={value === opt.k && subMode === 'none' ? { backgroundColor: '#1a3a6e', color: '#fff' } : { color: '#111' }}
              >
                {opt.label}
              </button>
            )
          )}

          <div className="h-px bg-gray-100 my-1" />

          {/* Fixed date range */}
          <button
            onClick={() => setSubMode(subMode === 'fixed' ? 'none' : 'fixed')}
            className="w-full text-left px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 flex items-center justify-between"
            style={subMode === 'fixed' ? { backgroundColor: '#f3f4f6', fontWeight: 500 } : { color: '#111' }}
          >
            Fixed date range…
            <i className="ti ti-chevron-right text-[11px] text-gray-400" />
          </button>
          {subMode === 'fixed' && (
            <div className="bg-gray-50 rounded-lg p-2.5 mt-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
                <span className="w-8">From</span>
                <input type="date" value={fixedFrom} onChange={e => setFixedFrom(e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-md px-2 h-7 bg-white" />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="w-8">To</span>
                <input type="date" value={fixedTo} onChange={e => setFixedTo(e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-md px-2 h-7 bg-white" />
              </div>
              <button onClick={applyFixed}
                className="w-full text-xs font-medium py-1.5 rounded-md text-white"
                style={{ backgroundColor: '#1a3a6e' }}>
                Apply
              </button>
            </div>
          )}

          {/* Relative date range */}
          <button
            onClick={() => setSubMode(subMode === 'relative' ? 'none' : 'relative')}
            className="w-full text-left px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 flex items-center justify-between mt-0.5"
            style={subMode === 'relative' ? { backgroundColor: '#f3f4f6', fontWeight: 500 } : { color: '#111' }}
          >
            Relative date range…
            <i className="ti ti-chevron-right text-[11px] text-gray-400" />
          </button>
          {subMode === 'relative' && (
            <div className="bg-gray-50 rounded-lg p-2.5 mt-1">
              {/* Last / This tabs */}
              <div className="flex gap-1 mb-2.5">
                {(['last', 'this'] as const).map(t => (
                  <button key={t} onClick={() => setRelTab(t)}
                    className="flex-1 text-center text-xs font-medium py-1 rounded-md capitalize transition-colors"
                    style={relTab === t ? { backgroundColor: '#1a3a6e', color: '#fff' } : { color: '#6b7280', background: 'transparent' }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {relTab === 'last' ? (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs text-gray-500 w-7">Last</span>
                  <input type="number" value={relN} min="1" onChange={e => setRelN(e.target.value)}
                    className="w-12 text-xs border border-gray-300 rounded-md px-1.5 h-7 bg-white" />
                  <select value={relUnit} onChange={e => setRelUnit(e.target.value)}
                    className="flex-1 text-xs border border-gray-300 rounded-md px-1.5 h-7 bg-white">
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                    <option value="quarters">quarters</option>
                    <option value="years">years</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs text-gray-500 w-7">This</span>
                  <select value={thisUnit} onChange={e => setThisUnit(e.target.value)}
                    className="flex-1 text-xs border border-gray-300 rounded-md px-1.5 h-7 bg-white">
                    <option value="week">week</option>
                    <option value="month">month</option>
                    <option value="quarter">quarter</option>
                    <option value="year">year</option>
                  </select>
                </div>
              )}
              <div className="text-[10px] text-gray-400 text-center mb-2">{getRelPreview()}</div>
              <button onClick={applyRelative}
                className="w-full text-xs font-medium py-1.5 rounded-md text-white"
                style={{ backgroundColor: '#1a3a6e' }}>
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
