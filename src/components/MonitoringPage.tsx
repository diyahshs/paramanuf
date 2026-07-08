'use client'
import { useState } from 'react'
import { MONITORING_DATA, LineOlah, LineKemas, QueueItem, fmtDuration } from '@/lib/data'

const PLANTS = ['POWDER', 'LIQUID', 'SEMISOLID']
type LineStatus = 'running' | 'idle' | 'breakdown' | 'setup'

function statusColor(s: LineStatus) {
  return { running: '#1D9E75', idle: '#EF9F27', breakdown: '#E24B4A', setup: '#378ADD' }[s]
}
function statusLabel(s: LineStatus) {
  return { running: 'Running', idle: 'Idle', breakdown: 'Breakdown', setup: 'Setup' }[s]
}
function statusPillStyle(s: LineStatus) {
  const map = {
    running: { background: '#E1F5EE', color: '#0F6E56' },
    idle: { background: '#FAEEDA', color: '#854F0B' },
    breakdown: { background: '#FCEBEB', color: '#A32D2D' },
    setup: { background: '#E6F1FB', color: '#185FA5' },
  }
  return map[s]
}

function RingProgress({ pct, color }: { pct: number; color: string }) {
  const r = 17, c = 2 * Math.PI * r
  const off = c - (pct / 100) * c
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-[10px] font-medium" style={{ color }}>{pct}%</span>
        <span className="text-[5px] text-gray-400">progress</span>
      </div>
    </div>
  )
}

function IconBox({ status }: { status: LineStatus }) {
  const map = {
    breakdown: { bg: '#FCEBEB', icon: 'ti-tool', color: '#E24B4A' },
    idle: { bg: '#FAEEDA', icon: 'ti-clock-pause', color: '#BA7517' },
    setup: { bg: '#E6F1FB', icon: 'ti-settings', color: '#378ADD' },
    running: { bg: '#E1F5EE', icon: 'ti-player-play', color: '#1D9E75' },
  }
  const s = map[status]
  return (
    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
      <i className={`ti ${s.icon} text-base`} style={{ color: s.color }} />
    </div>
  )
}

function OpChip({ code }: { code: string }) {
  return <span className="text-[8px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{code}</span>
}

function OlahPanel({ line }: { line: LineOlah }) {
  const s = line.status
  const ltPct = line.elapsedMin && line.stdMin ? Math.round(line.elapsedMin / line.stdMin * 100) : null
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="h-1" style={{ background: statusColor(s) }} />
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-900">{line.code}</span>
          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1" style={statusPillStyle(s)}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(s) }} />
            {statusLabel(s)}
          </span>
        </div>
        <div className="flex gap-2">
          {s === 'running' ? <RingProgress pct={line.progress!} color={statusColor(s)} /> : <IconBox status={s} />}
          <div className="flex-1 min-w-0 text-[8px]">
            {s === 'idle' && <div className="flex justify-between mb-0.5"><span className="text-gray-400">Idle</span><span className="font-medium text-gray-700">{fmtDuration(line.idleMin!)}</span></div>}
            {s === 'setup' && <div className="flex justify-between mb-0.5"><span className="text-gray-400">Ready at</span><span className="font-medium text-gray-700">{line.setupEta}</span></div>}
            {(s === 'running' || s === 'breakdown') && <>
              {s === 'breakdown' && <div className="flex justify-between mb-0.5"><span className="text-red-500">Downtime</span><span className="font-medium text-red-600">{fmtDuration(line.downtimeMin!)}</span></div>}
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">PO SFG</span><span className="font-medium text-gray-700 truncate ml-1">{line.po?.replace('PO-SFG-', '')}</span></div>
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">Target</span><span className="font-medium text-gray-700">{line.targetKg?.toLocaleString('id-ID')} kg</span></div>
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">Elapsed</span><span className="font-medium text-gray-700">{fmtDuration(line.elapsedMin!)}</span></div>
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">Std SAP</span><span className="font-medium text-gray-700">{fmtDuration(line.stdMin!)}</span></div>
              {ltPct !== null && <div className="flex justify-between mb-0.5"><span className="text-gray-400">Leadtime</span><span className="font-medium" style={{ color: ltPct > 100 ? '#A32D2D' : '#0F6E56' }}>{ltPct}%</span></div>}
              <div className="flex items-center gap-0.5 mt-1 flex-wrap">{line.operators?.map(op => <OpChip key={op} code={op} />)}</div>
            </>}
            {line.material && <div className="text-[8px] text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100 truncate">{line.material}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function KemasPanel({ line }: { line: LineKemas }) {
  const s = line.status
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="h-1" style={{ background: statusColor(s) }} />
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-900">{line.code}</span>
          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1" style={statusPillStyle(s)}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(s) }} />
            {statusLabel(s)}
          </span>
        </div>
        <div className="flex gap-2">
          {s === 'running' ? <RingProgress pct={line.progress!} color={statusColor(s)} /> : <IconBox status={s} />}
          <div className="flex-1 min-w-0 text-[8px]">
            {s === 'idle' && <div className="flex justify-between mb-0.5"><span className="text-gray-400">Idle</span><span className="font-medium text-gray-700">{fmtDuration(line.idleMin!)}</span></div>}
            {s === 'setup' && <div className="flex justify-between mb-0.5"><span className="text-gray-400">Ready at</span><span className="font-medium text-gray-700">{line.setupEta}</span></div>}
            {(s === 'running' || s === 'breakdown') && <>
              {s === 'breakdown' && <div className="flex justify-between mb-0.5"><span className="text-red-500">Downtime</span><span className="font-medium text-red-600">{fmtDuration(line.downtimeMin!)}</span></div>}
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">PO FG</span><span className="font-medium text-gray-700 truncate ml-1">{line.po?.replace('PO-FG-', '')}</span></div>
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">Target</span><span className="font-medium text-gray-700">{line.targetPcs?.toLocaleString('id-ID')} pcs</span></div>
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">Done</span><span className="font-medium text-gray-700">{line.donePcs?.toLocaleString('id-ID')} pcs</span></div>
              <div className="flex justify-between mb-0.5"><span className="text-gray-400">%</span><span className="font-medium text-gray-700">{line.progress}%</span></div>
              <div className="flex items-center gap-0.5 mt-1 flex-wrap">{line.operators?.map(op => <OpChip key={op} code={op} />)}</div>
            </>}
            {line.material && <div className="text-[8px] text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100 truncate">{line.material}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function QueueBadge({ count, label, onClick }: { count: number; label: string; onClick: () => void }) {
  if (count === 0) return <span className="text-[10px] text-gray-300 bg-gray-100 px-2 py-1 rounded-full">0 {label}</span>
  return (
    <button onClick={onClick} className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
      {count} {label}
    </button>
  )
}

function QueueList({ items, title, onClose }: { items: QueueItem[]; title: string; onClose: () => void }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="ti ti-x text-xs" /></button>
      </div>
      {items.map((it, i) => (
        <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-0">
          <div>
            <div className="text-[11px] font-medium text-gray-800">{it.po}</div>
            <div className="text-[10px] text-gray-500">{it.material}</div>
          </div>
          <div className="text-[10px] text-gray-400 whitespace-nowrap ml-2">Due: {it.due}</div>
        </div>
      ))}
    </div>
  )
}

export default function MonitoringPage() {
  const [plant, setPlant] = useState('POWDER')
  const [zone, setZone] = useState('A')
  const [openQueue, setOpenQueue] = useState<'timbang' | 'olah' | 'kemas' | null>(null)

  const plantData = MONITORING_DATA[plant]
  const zones = Object.keys(plantData)
  const zoneData = plantData[zone]

  function toggleQueue(q: 'timbang' | 'olah' | 'kemas') {
    setOpenQueue(openQueue === q ? null : q)
  }

  return (
    <div className="flex flex-col min-h-0">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div>
          <div className="text-base font-medium text-gray-900">Monitoring</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Real-time production line status</div>
        </div>
        <span className="text-[11px] text-gray-500" suppressHydrationWarning />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Plant tabs */}
        <div className="flex gap-1.5 mb-2">
          {PLANTS.map(p => (
            <button key={p} onClick={() => { setPlant(p); setZone(Object.keys(MONITORING_DATA[p])[0]); setOpenQueue(null) }}
              className="px-4 py-2 rounded-lg text-xs font-medium capitalize transition-colors"
              style={plant === p ? { backgroundColor: '#1a3a6e', color: '#fff', border: 'none' } : { border: '1px solid #d1d5db', background: '#fff', color: '#374151' }}>
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Zone tabs */}
        <div className="flex gap-1.5 mb-1.5">
          {zones.map(z => (
            <button key={z} onClick={() => { setZone(z); setOpenQueue(null) }}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={zone === z ? { backgroundColor: '#B5667A', color: '#fff', border: 'none' } : { border: '1px solid #d1d5db', background: '#fff', color: '#374151' }}>
              Zone {z}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-gray-400 mb-4">{zoneData.desc}</div>

        {/* Queue badges row */}
        <div className="flex gap-2 mb-4">
          <QueueBadge count={zoneData.antriTimbang.length} label="awaiting weighing" onClick={() => toggleQueue('timbang')} />
          <QueueBadge count={zoneData.antriOlah.length} label="awaiting mixing" onClick={() => toggleQueue('olah')} />
          <QueueBadge count={zoneData.antriKemas.length} label="awaiting packing" onClick={() => toggleQueue('kemas')} />
        </div>

        {openQueue === 'timbang' && <QueueList items={zoneData.antriTimbang} title="Awaiting weighing" onClose={() => setOpenQueue(null)} />}
        {openQueue === 'olah' && <QueueList items={zoneData.antriOlah} title="Awaiting mixing" onClose={() => setOpenQueue(null)} />}
        {openQueue === 'kemas' && <QueueList items={zoneData.antriKemas} title="Awaiting packing" onClose={() => setOpenQueue(null)} />}

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Weighing */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#E6F1FB' }}><i className="ti ti-scale" style={{ fontSize: 12, color: '#185FA5' }} /></div>
                <span className="text-xs font-medium text-gray-900">Weighing</span>
                <span className="text-[9px] text-gray-400">{zoneData.timbang.length} active</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {zoneData.timbang.length === 0
                ? <div className="text-[11px] text-gray-400 text-center py-6">No active weighing</div>
                : zoneData.timbang.map(l => <OlahPanel key={l.code} line={l} />)}
            </div>
          </div>

          {/* Mixing */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#EEEDFE' }}><i className="ti ti-flask" style={{ fontSize: 12, color: '#3C3489' }} /></div>
                <span className="text-xs font-medium text-gray-900">Mixing</span>
                <span className="text-[9px] text-gray-400">{zoneData.olah.length} lines</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {zoneData.olah.map(l => <OlahPanel key={l.code} line={l} />)}
            </div>
          </div>

          {/* Packing */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#FAECE7' }}><i className="ti ti-package" style={{ fontSize: 12, color: '#712B13' }} /></div>
                <span className="text-xs font-medium text-gray-900">Packing</span>
                <span className="text-[9px] text-gray-400">{zoneData.kemas.length} lines</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {zoneData.kemas.map(l => <KemasPanel key={l.code} line={l} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
