'use client'
import { useState, useMemo } from 'react'
import DateFilter, { PeriodKey } from './DateFilter'
import { getOverviewData, BULK_LOSS_ROWS, PACK_LOSS_ROWS, fmtRp, fmtMin } from '@/lib/data'

type PlantKey = 'ALL' | 'POWDER' | 'LIQUID' | 'SEMISOLID'
const PLANTS = [
  { k: 'ALL' as PlantKey, label: 'All plants' },
  { k: 'POWDER' as PlantKey, label: 'Powder' },
  { k: 'LIQUID' as PlantKey, label: 'Liquid' },
  { k: 'SEMISOLID' as PlantKey, label: 'Semisolid' },
]

function csvDownload(filename: string, headers: string[], rows: (string | number)[][]) {
  const lines = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click()
}

function Tag({ pct, good, warn }: { pct: number; good: number; warn?: number }) {
  const isGood = pct >= good
  const isWarn = warn !== undefined ? pct >= warn : false
  const cls = isGood ? 'bg-green-50 text-green-700' : isWarn ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
  return <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${cls}`}>{pct}% of standard</span>
}

export default function OverviewPage() {
  const [plant, setPlant] = useState<PlantKey>('ALL')
  const [period, setPeriod] = useState<PeriodKey>('today')
  const [periodLabel, setPeriodLabel] = useState('Today')
  const [expanded, setExpanded] = useState<'bulk' | 'pack' | null>(null)

  const d = useMemo(() => getOverviewData(plant, period), [plant, period])
  const ltPct = Math.round(d.leadtimeMin / d.leadtimeStd * 100)
  const spPct = Math.round(d.speedPcs / d.speedStd * 100)

  const energies = [
    { icon: 'ti-bolt', bg: '#FEF3C7', tc: '#92400E', label: 'Electricity', val: d.elecKwh, std: d.elecStd, unit: 'kWh', bar: '#F59E0B' },
    { icon: 'ti-droplets', bg: '#E0F2FE', tc: '#075985', label: 'Water', val: d.waterM3, std: d.waterStd, unit: 'm³', bar: '#0EA5E9' },
    { icon: 'ti-wind', bg: '#E0E7FF', tc: '#3730A3', label: 'Compressed Air', val: d.airM3, std: d.airStd, unit: 'm³', bar: '#6366F1' },
    { icon: 'ti-cloud', bg: '#F3E8FF', tc: '#6B21A8', label: 'Steam', val: d.steamKg, std: d.steamStd, unit: 'kg', bar: '#A855F7' },
  ]

  return (
    <div className="flex flex-col min-h-0">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div>
          <div className="text-base font-medium text-gray-900">Overview</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Production performance summary</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500" id="clk-ov" suppressHydrationWarning />
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-[11px] font-medium text-navy hover:bg-gray-50"
            style={{ color: '#1a3a6e' }}>
            <i className="ti ti-download text-xs" />Download PDF
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="flex gap-1.5">
            {PLANTS.map(p => (
              <button key={p.k} onClick={() => { setPlant(p.k); setExpanded(null) }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={plant === p.k ? { backgroundColor: '#1a3a6e', color: '#fff', border: 'none' } : { border: '1px solid #d1d5db', background: '#fff', color: '#374151' }}>
                {p.label}
              </button>
            ))}
          </div>
          <DateFilter value={period} onChange={(p, label) => { setPeriod(p); setPeriodLabel(label); setExpanded(null) }} />
        </div>

        {/* Production metrics */}
        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">Production metrics</div>
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {/* Bulk loss */}
          <div
            onClick={() => setExpanded(expanded === 'bulk' ? null : 'bulk')}
            className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-colors ${expanded === 'bulk' ? 'border-navy rounded-b-none' : 'border-gray-200 hover:border-gray-300'}`}
            style={expanded === 'bulk' ? { borderColor: '#1a3a6e' } : {}}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
                <div className="w-4 h-4 rounded bg-red-50 flex items-center justify-center"><i className="ti ti-droplet-off text-red-600" style={{ fontSize: 10 }} /></div>
                Bulk loss
              </div>
              <i className={`ti ${expanded === 'bulk' ? 'ti-chevron-up' : 'ti-chevron-down'} text-[11px] text-gray-400`} />
            </div>
            <div className="text-2xl font-medium text-gray-900">{d.bulkLossKg.toLocaleString('id-ID')} kg</div>
            <div className="text-[11px] text-gray-400 mt-1">{fmtRp(d.bulkLossRp)}</div>
          </div>

          {/* Pack loss */}
          <div
            onClick={() => setExpanded(expanded === 'pack' ? null : 'pack')}
            className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-colors ${expanded === 'pack' ? 'rounded-b-none' : 'hover:border-gray-300'}`}
            style={expanded === 'pack' ? { borderColor: '#1a3a6e' } : { borderColor: '#e5e7eb' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider">
                <div className="w-4 h-4 rounded bg-red-50 flex items-center justify-center"><i className="ti ti-box-off text-red-600" style={{ fontSize: 10 }} /></div>
                Pack loss
              </div>
              <i className={`ti ${expanded === 'pack' ? 'ti-chevron-up' : 'ti-chevron-down'} text-[11px] text-gray-400`} />
            </div>
            <div className="text-2xl font-medium text-gray-900">{d.packLossPcs.toLocaleString('id-ID')} pcs</div>
            <div className="text-[11px] text-gray-400 mt-1">{fmtRp(d.packLossRp)}</div>
          </div>

          {/* Avg lead time */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: '#EEEDFE' }}><i className="ti ti-clock" style={{ fontSize: 10, color: '#3C3489' }} /></div>
              Avg lead time (mixing)
            </div>
            <div className="text-2xl font-medium text-gray-900">{fmtMin(d.leadtimeMin)}</div>
            <div className="text-[11px] text-gray-500 mb-1.5">Standard: {fmtMin(d.leadtimeStd)}</div>
            <Tag pct={ltPct} good={95} warn={85} />
          </div>

          {/* Avg packing speed */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: '#FAECE7' }}><i className="ti ti-gauge" style={{ fontSize: 10, color: '#712B13' }} /></div>
              Avg packing speed
            </div>
            <div className="text-2xl font-medium text-gray-900">{d.speedPcs.toLocaleString('id-ID')} pcs/hr</div>
            <div className="text-[11px] text-gray-500 mb-1.5">Standard: {d.speedStd.toLocaleString('id-ID')} pcs/hr</div>
            <Tag pct={spPct} good={95} warn={85} />
          </div>

          {/* Bulk output */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: '#EAF3DE' }}><i className="ti ti-droplet" style={{ fontSize: 10, color: '#3B6D11' }} /></div>
              Bulk output
            </div>
            <div className="text-2xl font-medium text-gray-900">{d.outBulkKg.toLocaleString('id-ID')} kg</div>
            <div className="text-[11px] text-gray-500 mt-1">Total mixing output</div>
          </div>

          {/* Packing output */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider mb-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: '#E6F1FB' }}><i className="ti ti-package" style={{ fontSize: 10, color: '#185FA5' }} /></div>
              Packing output
            </div>
            <div className="text-2xl font-medium text-gray-900">{d.outKemasPcs.toLocaleString('id-ID')} pcs</div>
            <div className="text-[11px] text-gray-500 mt-1">Total packing output</div>
          </div>
        </div>

        {/* Drill-down panels */}
        {expanded === 'bulk' && (
          <div className="border rounded-b-xl rounded-tr-xl p-4 mb-3 bg-white" style={{ borderColor: '#1a3a6e', borderTop: 'none' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-900">Bulk Loss — Detail by PO</span>
              <div className="flex items-center gap-2">
                <button onClick={() => csvDownload('bulk_loss.csv', ['PO SFG', 'Material', 'Loss (kg)', 'Reason', 'Value (Rp)'], BULK_LOSS_ROWS.map(r => [r.po, r.material, r.lossKg, r.reason, r.rp]))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 text-[11px] font-medium hover:bg-gray-50" style={{ color: '#1a3a6e' }}>
                  <i className="ti ti-download text-xs" />CSV
                </button>
                <button onClick={() => setExpanded(null)} className="text-gray-400 hover:text-gray-600 px-1"><i className="ti ti-x text-sm" /></button>
              </div>
            </div>
            <table className="w-full text-[11px] border-collapse">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase tracking-wider">PO SFG</th>
                <th className="text-left py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase tracking-wider">Material</th>
                <th className="text-right py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase tracking-wider">Loss</th>
                <th className="text-left py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase tracking-wider">Reason</th>
                <th className="text-right py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase tracking-wider">Value</th>
              </tr></thead>
              <tbody>
                {BULK_LOSS_ROWS.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 px-2 text-gray-700">{r.po}</td>
                    <td className="py-1.5 px-2 text-gray-700 max-w-[160px] truncate">{r.material}</td>
                    <td className="py-1.5 px-2 text-gray-700 text-right">{r.lossKg} kg</td>
                    <td className="py-1.5 px-2"><span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">{r.reason}</span></td>
                    <td className="py-1.5 px-2 text-gray-700 text-right">{fmtRp(r.rp)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-1.5 px-2" colSpan={2}>Total</td>
                  <td className="py-1.5 px-2 text-right">{BULK_LOSS_ROWS.reduce((a, b) => a + b.lossKg, 0).toFixed(1)} kg</td>
                  <td />
                  <td className="py-1.5 px-2 text-right">{fmtRp(BULK_LOSS_ROWS.reduce((a, b) => a + b.rp, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {expanded === 'pack' && (
          <div className="border rounded-b-xl rounded-tr-xl p-4 mb-3 bg-white" style={{ borderColor: '#1a3a6e', borderTop: 'none' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-900">Pack Loss — Detail by Component</span>
              <div className="flex items-center gap-2">
                <button onClick={() => csvDownload('pack_loss.csv', ['Component', 'Supplied', 'Loss (pcs)', 'Reason', 'Unit Cost (Rp)', 'Total Value (Rp)'], PACK_LOSS_ROWS.map(r => [r.component, r.supplied ?? '', r.loss, r.reason, r.unitRp ?? '', r.totalRp]))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 text-[11px] font-medium hover:bg-gray-50" style={{ color: '#1a3a6e' }}>
                  <i className="ti ti-download text-xs" />CSV
                </button>
                <button onClick={() => setExpanded(null)} className="text-gray-400 hover:text-gray-600 px-1"><i className="ti ti-x text-sm" /></button>
              </div>
            </div>
            <table className="w-full text-[11px] border-collapse">
              <thead><tr className="border-b border-gray-100">
                <th className="text-left py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase">Component</th>
                <th className="text-right py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase">Supplied</th>
                <th className="text-right py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase">Loss</th>
                <th className="text-left py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase">Reason</th>
                <th className="text-right py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase">Unit cost</th>
                <th className="text-right py-1.5 px-2 text-[9px] font-medium text-gray-400 uppercase">Total value</th>
              </tr></thead>
              <tbody>
                {PACK_LOSS_ROWS.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 px-2 text-gray-700">{r.component}</td>
                    <td className="py-1.5 px-2 text-gray-700 text-right">{r.supplied?.toLocaleString('id-ID') ?? '—'}</td>
                    <td className="py-1.5 px-2 text-gray-700 text-right">{r.loss.toLocaleString('id-ID')} pcs</td>
                    <td className="py-1.5 px-2"><span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">{r.reason}</span></td>
                    <td className="py-1.5 px-2 text-gray-700 text-right">{r.unitRp ? fmtRp(r.unitRp) + '/pcs' : '—'}</td>
                    <td className="py-1.5 px-2 text-gray-700 text-right">{fmtRp(r.totalRp)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="py-1.5 px-2" colSpan={2}>Total</td>
                  <td className="py-1.5 px-2 text-right">{PACK_LOSS_ROWS.reduce((a, b) => a + b.loss, 0).toLocaleString('id-ID')} pcs</td>
                  <td /><td />
                  <td className="py-1.5 px-2 text-right">{fmtRp(PACK_LOSS_ROWS.reduce((a, b) => a + b.totalRp, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Energy */}
        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2 mt-4">Energy & utilities</div>
        <div className="grid grid-cols-4 gap-2.5">
          {energies.map(e => {
            const na = e.val === 0 && e.std === 0
            const pct = na ? 0 : Math.round(e.val / e.std * 100)
            const barColor = pct > 100 ? '#E24B4A' : e.bar
            return (
              <div key={e.label} className={`bg-white border border-gray-200 rounded-xl p-3 ${na ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                  <div className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0" style={{ background: e.bg }}>
                    <i className={`ti ${e.icon}`} style={{ fontSize: 10, color: e.tc }} />
                  </div>
                  {e.label}
                </div>
                {na ? (
                  <div className="text-sm text-gray-400">N/A</div>
                ) : (
                  <>
                    <div className="text-xl font-medium text-gray-900">{e.val.toLocaleString('id-ID')} <span className="text-xs text-gray-500">{e.unit}</span></div>
                    <div className="h-1 bg-gray-100 rounded-full my-2">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: barColor }} />
                    </div>
                    <div className="text-[10px] text-gray-400">{pct}% of target ({e.std.toLocaleString('id-ID')} {e.unit})</div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-[11px] text-gray-400 text-right mt-4 pt-3 border-t border-gray-100">
          Period: <strong>{periodLabel}</strong> · Plant: <strong>{PLANTS.find(p => p.k === plant)?.label}</strong> · Source: SAP + FRO (dummy)
        </div>
      </div>
    </div>
  )
}
