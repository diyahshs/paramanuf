// lib/data.ts — Dummy data layer
// Replace this with real API calls to SAP/FRO/MES when integrating

export type PlantKey = 'ALL' | 'POWDER' | 'LIQUID' | 'SEMISOLID'
export type PeriodKey = 'today' | 'yesterday' | 'prev_week' | 'prev_7' | 'prev_30' | 'prev_month' | 'prev_3m' | 'prev_12m' | 'fixed' | 'relative'
export type LineStatus = 'running' | 'idle' | 'breakdown' | 'setup'

// ─── Overview Metrics ────────────────────────────────────────────────
const BASE_METRICS: Record<PlantKey, OverviewMetrics> = {
  ALL:      { bulkLossKg: 142.5, bulkLossRp: 14250000, packLossPcs: 3820, packLossRp: 9550000, leadtimeMin: 438, leadtimeStd: 480, speedPcs: 4820, speedStd: 5200, outBulkKg: 18420, outKemasPcs: 284600, elecKwh: 8420, elecStd: 9000, waterM3: 142, waterStd: 160, airM3: 3200, airStd: 3500, steamKg: 580, steamStd: 620 },
  POWDER:   { bulkLossKg: 48.2, bulkLossRp: 4820000, packLossPcs: 1540, packLossRp: 3850000, leadtimeMin: 462, leadtimeStd: 480, speedPcs: 4200, speedStd: 4800, outBulkKg: 5680, outKemasPcs: 96400, elecKwh: 2840, elecStd: 3000, waterM3: 38, waterStd: 45, airM3: 1100, airStd: 1200, steamKg: 0, steamStd: 0 },
  LIQUID:   { bulkLossKg: 62.1, bulkLossRp: 6210000, packLossPcs: 1320, packLossRp: 3300000, leadtimeMin: 421, leadtimeStd: 480, speedPcs: 5400, speedStd: 5800, outBulkKg: 8900, outKemasPcs: 132800, elecKwh: 3200, elecStd: 3400, waterM3: 88, waterStd: 95, airM3: 1400, airStd: 1500, steamKg: 380, steamStd: 400 },
  SEMISOLID:{ bulkLossKg: 32.2, bulkLossRp: 3220000, packLossPcs: 960, packLossRp: 2400000, leadtimeMin: 451, leadtimeStd: 480, speedPcs: 4860, speedStd: 5200, outBulkKg: 3840, outKemasPcs: 55400, elecKwh: 2380, elecStd: 2600, waterM3: 16, waterStd: 20, airM3: 700, airStd: 800, steamKg: 200, steamStd: 220 },
}

const PERIOD_SCALE: Record<string, number> = {
  today: 0.12, yesterday: 0.11, prev_week: 0.75, prev_7: 0.7,
  prev_30: 1, prev_month: 0.95, prev_3m: 2.8, prev_12m: 11.2,
  fixed: 1, relative: 1,
}

export interface OverviewMetrics {
  bulkLossKg: number; bulkLossRp: number
  packLossPcs: number; packLossRp: number
  leadtimeMin: number; leadtimeStd: number
  speedPcs: number; speedStd: number
  outBulkKg: number; outKemasPcs: number
  elecKwh: number; elecStd: number
  waterM3: number; waterStd: number
  airM3: number; airStd: number
  steamKg: number; steamStd: number
}

export function getOverviewData(plant: PlantKey, period: PeriodKey): OverviewMetrics {
  const b = BASE_METRICS[plant]
  const s = PERIOD_SCALE[period] ?? 1
  const j = () => 0.9 + Math.random() * 0.2
  return {
    bulkLossKg: parseFloat((b.bulkLossKg * s * j()).toFixed(1)),
    bulkLossRp: Math.round(b.bulkLossRp * s * j()),
    packLossPcs: Math.round(b.packLossPcs * s * j()),
    packLossRp: Math.round(b.packLossRp * s * j()),
    leadtimeMin: Math.round(b.leadtimeMin * (0.95 + Math.random() * 0.1)),
    leadtimeStd: b.leadtimeStd,
    speedPcs: Math.round(b.speedPcs * (0.9 + Math.random() * 0.2)),
    speedStd: b.speedStd,
    outBulkKg: Math.round(b.outBulkKg * s * j()),
    outKemasPcs: Math.round(b.outKemasPcs * s * j()),
    elecKwh: Math.round(b.elecKwh * s * j()),
    elecStd: Math.round(b.elecStd * s),
    waterM3: parseFloat((b.waterM3 * s * j()).toFixed(1)),
    waterStd: parseFloat((b.waterStd * s).toFixed(1)),
    airM3: Math.round(b.airM3 * s * j()),
    airStd: Math.round(b.airStd * s),
    steamKg: Math.round(b.steamKg * s * j()),
    steamStd: Math.round(b.steamStd * s),
  }
}

// ─── Bulk Loss Detail ────────────────────────────────────────────────
export interface BulkLossRow {
  po: string; material: string; lossKg: number; reason: string; rp: number
}
export const BULK_LOSS_ROWS: BulkLossRow[] = [
  { po: 'PO-SFG-240000000487', material: 'WD LIGHTENING PF LGHT FEEL 11C 12G', lossKg: 18.4, reason: 'Residue in tank', rp: 1840000 },
  { po: 'PO-SFG-240000000490', material: 'OMG COVERLAST TWC 21W 12G R', lossKg: 12.1, reason: 'Transfer spillage', rp: 1210000 },
  { po: 'PO-SFG-300000011090', material: 'FACEWASH KAFH 100ML', lossKg: 24.8, reason: 'Mixing volatilisation', rp: 2480000 },
  { po: 'PO-SFG-300000011092', material: 'BODY LOTION GLOW 200ML', lossKg: 15.3, reason: 'Pipe residue', rp: 1530000 },
  { po: 'PO-SFG-400000022060', material: 'CREAM HIDROKORTISON 1% 10G', lossKg: 8.9, reason: 'Filling spillage', rp: 890000 },
  { po: 'PO-SFG-400000022071', material: 'BALM OTOT PEGAL 30G', lossKg: 11.2, reason: 'Mixer residue', rp: 1120000 },
  { po: 'Others (12 POs)', material: '—', lossKg: 51.8, reason: 'Various', rp: 5180000 },
]

// ─── Pack Loss Detail ────────────────────────────────────────────────
export interface PackLossRow {
  component: string; supplied: number | null; loss: number; reason: string; unitRp: number | null; totalRp: number
}
export const PACK_LOSS_ROWS: PackLossRow[] = [
  { component: 'Primary tube', supplied: 32000, loss: 480, reason: 'Dented during filling', unitRp: 2500, totalRp: 1200000 },
  { component: 'Secondary box', supplied: 32000, loss: 320, reason: 'Misprinted label', unitRp: 1800, totalRp: 576000 },
  { component: 'Sachet foil', supplied: 48000, loss: 680, reason: 'Seal failure', unitRp: 800, totalRp: 544000 },
  { component: 'Bottle 60ml', supplied: 15000, loss: 210, reason: 'Cracked on handling', unitRp: 3200, totalRp: 672000 },
  { component: 'Pump head', supplied: 15000, loss: 190, reason: 'Mechanism defect', unitRp: 4500, totalRp: 855000 },
  { component: 'Shrink wrap', supplied: 28000, loss: 420, reason: 'Machine jam', unitRp: 300, totalRp: 126000 },
  { component: 'Carton shipper', supplied: 8000, loss: 180, reason: 'Stacking crush', unitRp: 5000, totalRp: 900000 },
  { component: 'Others', supplied: null, loss: 1340, reason: 'Various', unitRp: null, totalRp: 4677000 },
]

// ─── Monitoring — Line Data ──────────────────────────────────────────
export interface LineOlah {
  code: string; status: LineStatus
  progress?: number; po?: string; targetKg?: number; elapsedMin?: number; stdMin?: number
  material?: string; operators?: string[]
  downtimeMin?: number; idleMin?: number; setupEta?: string
}
export interface LineKemas {
  code: string; status: LineStatus
  progress?: number; po?: string; targetPcs?: number; donePcs?: number
  material?: string; operators?: string[]
  downtimeMin?: number; idleMin?: number; setupEta?: string
}
export interface QueueItem { po: string; material: string; due: string }
export interface ZoneData {
  desc: string
  antriTimbang: QueueItem[]; antriOlah: QueueItem[]; antriKemas: QueueItem[]
  timbang: LineOlah[]; olah: LineOlah[]; kemas: LineKemas[]
}
export type PlantData = Record<string, ZoneData>

export const MONITORING_DATA: Record<string, PlantData> = {
  POWDER: {
    A: {
      desc: 'Loose powder',
      antriTimbang: [{ po: 'PO-SFG-240000000515', material: 'WD CFIT VELVET PWDR FNDTN 22N 11G', due: '03/07/2026' }],
      antriOlah: [
        { po: 'PO-SFG-240000000510', material: 'WRDH RFL LPF LF 02 PNK BG 31C 12G', due: '03/07/2026' },
        { po: 'PO-SFG-240000000511', material: 'OMG OMM CVRLS TWC 32N NAT PS', due: '06/07/2026' },
      ],
      antriKemas: [{ po: 'PO-FG-210000049530', material: 'WD CFIT VELVET PF 52N 11G REF R', due: '06/07/2026' }],
      timbang: [{ code: 'PSM03', status: 'running', progress: 60, po: 'PO-SFG-240000000513', targetKg: 200, elapsedMin: 12, stdMin: 20, material: 'WRDH RFL LPF LF 06 WRM BG 32W', operators: ['ANRA'] }],
      olah: [
        { code: 'PSM02', status: 'running', progress: 55, po: 'PO-SFG-240000000487', targetKg: 200, elapsedMin: 330, stdMin: 480, material: 'WD LIGHTENING PF LGHT FEEL 11C 12G', operators: ['FASU'] },
        { code: 'PSM04', status: 'running', progress: 80, po: 'PO-SFG-240000000490', targetKg: 220, elapsedMin: 390, stdMin: 450, material: 'OMG COVERLAST TWC 21W 12G R', operators: ['SAWU', 'RIMA'] },
        { code: 'PSM05', status: 'running', progress: 71, po: 'PO-SFG-240000000491', targetKg: 200, elapsedMin: 340, stdMin: 480, material: 'MO PERFECT COVER PWDR FNDTN 03', operators: ['RIMA'] },
        { code: 'PSM06', status: 'idle', idleMin: 140 },
        { code: 'PSM07', status: 'breakdown', downtimeMin: 95, po: 'PO-SFG-240000000488', targetKg: 180, elapsedMin: 210, stdMin: 420, material: 'WRDH RFL LPF LF 06 WRM BG 32W 12G', operators: ['DEKU'] },
        { code: 'PSM17', status: 'running', progress: 45, po: 'PO-SFG-240000000493', targetKg: 190, elapsedMin: 200, stdMin: 440, material: 'WD CFIT VELVET PF 23W 11G', operators: ['DEKU'] },
        { code: 'PSM21', status: 'setup', setupEta: '~16:00' },
        { code: 'PSM22', status: 'running', progress: 62, po: 'PO-SFG-240000000495', targetKg: 200, elapsedMin: 280, stdMin: 450, material: 'MO 24H PMPF C31 10G', operators: ['TOPR'] },
        { code: 'PSM23', status: 'idle', idleMin: 80 },
      ],
      kemas: [
        { code: 'PNP01', status: 'running', progress: 56, po: 'PO-FG-210000049501', targetPcs: 20000, donePcs: 11200, material: 'OMG COVERLAST TWC 21W 12G R', operators: ['SAWU', 'RIMA'] },
        { code: 'PNP02', status: 'running', progress: 24, po: 'PO-FG-210000049507', targetPcs: 8000, donePcs: 1920, material: 'WRDH RFL LPF LF 05 WRM IVR 23W 12G', operators: ['YUAS'] },
        { code: 'PNP03', status: 'idle', idleMin: 65 },
        { code: 'PNP04', status: 'running', progress: 24, po: 'PO-FG-210000049507', targetPcs: 8000, donePcs: 1920, material: 'WRDH RFL LPF LF 05 WRM IVR 23W 12G', operators: ['HEFI'] },
        { code: 'PNP05', status: 'running', progress: 24, po: 'PO-FG-210000049507', targetPcs: 8000, donePcs: 1920, material: 'WRDH RFL LPF LF 05 WRM IVR 23W 12G', operators: ['LISU', 'HEFI'] },
        { code: 'PNP06', status: 'setup', setupEta: '~15:00' },
      ],
    },
    B: {
      desc: 'Press (compact / eyeshadow)',
      antriTimbang: [], antriOlah: [{ po: 'PO-SFG-240000000520', material: 'WD EXCLV TWC 02 12G R2', due: '03/07/2026' }], antriKemas: [],
      timbang: [],
      olah: [
        { code: 'PAP01', status: 'running', progress: 38, po: 'PO-SFG-240000000496', targetKg: 150, elapsedMin: 180, stdMin: 400, material: 'WD EVD LUM TWC 02 12G', operators: ['MITR'] },
        { code: 'PVT02', status: 'running', progress: 67, po: 'PO-SFG-240000000497', targetKg: 160, elapsedMin: 300, stdMin: 420, material: 'WRDH EXCLS TWC 02 LT BG 12G', operators: ['RUHA'] },
        { code: 'PVT03', status: 'breakdown', downtimeMin: 42, po: 'PO-SFG-240000000498', targetKg: 170, elapsedMin: 150, stdMin: 430, material: 'MO 24H PMPF N30 10G', operators: ['NARA'] },
        { code: 'PVT07', status: 'running', progress: 82, po: 'PO-SFG-240000000500', targetKg: 160, elapsedMin: 380, stdMin: 430, material: 'MO PERFECT COVER PWDR FNDTN 02', operators: ['DESA'] },
      ],
      kemas: [
        { code: 'PEP04', status: 'running', progress: 42, po: 'PO-FG-210000049510', targetPcs: 6000, donePcs: 2520, material: 'WD EVD LUM TWC 02 12G', operators: ['BAAN'] },
        { code: 'PEP06', status: 'idle', idleMin: 200 },
      ],
    },
    C: {
      desc: 'Refill & sachet',
      antriTimbang: [], antriOlah: [], antriKemas: [],
      timbang: [],
      olah: [{ code: 'PWE01', status: 'running', progress: 60, po: 'PO-SFG-240000000510', targetKg: 100, elapsedMin: 240, stdMin: 400, material: 'WRDH RFL LPF LF 02 PNK BG 31C', operators: ['VELE'] }],
      kemas: [
        { code: 'LPP01', status: 'running', progress: 65, po: 'PO-FG-210000049520', targetPcs: 7500, donePcs: 4875, material: 'WRDH RFL LPF LF 02 PNK BG 31C', operators: ['PUNU'] },
        { code: 'LPP02', status: 'running', progress: 88, po: 'PO-FG-210000049521', targetPcs: 5000, donePcs: 4400, material: 'WRDH RFL LPF LF 07 ALMD 52N', operators: ['RAGU'] },
        { code: 'LPP03', status: 'setup', setupEta: '~16:00' },
      ],
    },
  },
  LIQUID: {
    A: {
      desc: 'High automation',
      antriTimbang: [{ po: 'PO-SFG-300000011095', material: 'FACEWASH KAFH 100ML', due: '02/07/2026' }],
      antriOlah: [], antriKemas: [{ po: 'PO-FG-300000011120', material: 'SERUM NIACINAMIDE 15ML', due: '04/07/2026' }],
      timbang: [{ code: 'LOL02', status: 'running', progress: 75, po: 'PO-SFG-300000011094', targetKg: 600, elapsedMin: 15, stdMin: 20, material: 'BODY LOTION GLOW 200ML', operators: ['TOSE'] }],
      olah: [
        { code: 'LOL01', status: 'running', progress: 88, po: 'PO-SFG-300000011090', targetKg: 850, elapsedMin: 420, stdMin: 480, material: 'FACEWASH KAFH 100ML', operators: ['SUMA'] },
        { code: 'LOL03', status: 'running', progress: 33, po: 'PO-SFG-300000011092', targetKg: 900, elapsedMin: 160, stdMin: 480, material: 'FACEWASH KAFH 100ML', operators: ['TOSE'] },
      ],
      kemas: [
        { code: 'TUP01', status: 'running', progress: 70, po: 'PO-FG-300000011099', targetPcs: 12000, donePcs: 8400, material: 'FACEWASH KAFH 100ML', operators: ['EKPR'] },
        { code: 'TUP02', status: 'running', progress: 55, po: 'PO-FG-300000011100', targetPcs: 10000, donePcs: 5500, material: 'BODY LOTION GLOW 200ML', operators: ['GIRO'] },
        { code: 'TUP06', status: 'breakdown', downtimeMin: 18, po: 'PO-FG-300000011102', targetPcs: 11000, donePcs: 2200, material: 'FACEWASH KAFH 100ML', operators: ['RUHA'] },
      ],
    },
    B: {
      desc: 'Medium manual',
      antriTimbang: [], antriOlah: [], antriKemas: [],
      timbang: [],
      olah: [{ code: 'LOL04', status: 'running', progress: 62, po: 'PO-SFG-300000011078', targetKg: 500, elapsedMin: 310, stdMin: 500, material: 'BODY LOTION GLOW 200ML', operators: ['RUHA', 'DESA'] }],
      kemas: [
        { code: 'BOP01', status: 'running', progress: 45, po: 'PO-FG-300000011105', targetPcs: 8000, donePcs: 3600, material: 'BODY LOTION GLOW 200ML', operators: ['AGPU'] },
        { code: 'BOP04', status: 'breakdown', downtimeMin: 150, po: 'PO-FG-300000011106', targetPcs: 7500, donePcs: 900, material: 'BODY LOTION GLOW 200ML', operators: ['JOWI'] },
      ],
    },
    C: {
      desc: 'High manual',
      antriTimbang: [], antriOlah: [], antriKemas: [],
      timbang: [],
      olah: [{ code: 'LOL06', status: 'running', progress: 70, po: 'PO-SFG-300000011083', targetKg: 300, elapsedMin: 280, stdMin: 400, material: 'SERUM NIACINAMIDE 15ML', operators: ['BAAN'] }],
      kemas: [{ code: 'BOP09', status: 'running', progress: 77, po: 'PO-FG-300000011110', targetPcs: 6000, donePcs: 4620, material: 'SERUM NIACINAMIDE 15ML', operators: ['VELE'] }],
    },
  },
  SEMISOLID: {
    A: {
      desc: 'Mixing & emulsification',
      antriTimbang: [], antriOlah: [], antriKemas: [],
      timbang: [],
      olah: [{ code: 'SOL01', status: 'running', progress: 45, po: 'PO-SFG-400000022060', targetKg: 200, elapsedMin: 230, stdMin: 480, material: 'CREAM HIDROKORTISON 1% 10G', operators: ['VELE'] }],
      kemas: [{ code: 'BRP01', status: 'running', progress: 50, po: 'PO-FG-400000022065', targetPcs: 8000, donePcs: 4000, material: 'CREAM HIDROKORTISON 1% 10G', operators: ['PUNU'] }],
    },
    B: {
      desc: 'Filling',
      antriTimbang: [{ po: 'PO-SFG-400000022075', material: 'BALM OTOT PEGAL 30G', due: '05/07/2026' }], antriOlah: [], antriKemas: [],
      timbang: [],
      olah: [{ code: 'SOL04', status: 'running', progress: 60, po: 'PO-SFG-400000022071', targetKg: 320, elapsedMin: 280, stdMin: 460, material: 'BALM OTOT PEGAL 30G', operators: ['SUMA'] }],
      kemas: [
        { code: 'JRP02', status: 'breakdown', downtimeMin: 240, po: 'PO-FG-400000022070', targetPcs: 10000, donePcs: 3300, material: 'BALM OTOT PEGAL 30G', operators: ['SUMA'] },
        { code: 'FOP03', status: 'running', progress: 71, po: 'PO-FG-400000022072', targetPcs: 8500, donePcs: 6035, material: 'BALM OTOT PEGAL 30G', operators: ['TOSE'] },
      ],
    },
    C: {
      desc: 'Labeling & cartoning',
      antriTimbang: [], antriOlah: [], antriKemas: [],
      timbang: [],
      olah: [{ code: 'SOL05', status: 'running', progress: 80, po: 'PO-SFG-400000022080', targetKg: 150, elapsedMin: 350, stdMin: 440, material: 'GIFT SET BODY CARE 3IN1', operators: ['EKPR'] }],
      kemas: [{ code: 'ALP03', status: 'running', progress: 95, po: 'PO-FG-400000022090', targetPcs: 5000, donePcs: 4750, material: 'GIFT SET BODY CARE 3IN1', operators: ['GIRO'] }],
    },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────
export function fmtRp(v: number): string {
  return 'Rp ' + Math.round(v).toLocaleString('id-ID')
}
export function fmtMin(m: number): string {
  const h = Math.floor(m / 60), mn = m % 60
  return mn ? `${h}h ${mn}m` : `${h}h`
}
export function fmtDuration(min: number): string {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60), m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
