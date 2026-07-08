'use client'

interface SidebarProps {
  activePage: 'overview' | 'monitoring'
  onNavigate: (page: 'overview' | 'monitoring') => void
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-[200px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 py-4 mx-3 border-b border-gray-200 mb-2">
        <div className="w-7 h-7 rounded-md bg-navy text-white flex items-center justify-center text-sm font-medium flex-shrink-0"
             style={{ backgroundColor: '#1a3a6e' }}>
          P
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 tracking-wide">PARAMANUF</div>
          <div className="text-[9px] text-gray-400 tracking-wider">BY PARAGONCORP</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3">
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-left w-full transition-colors"
          style={activePage === 'overview' ? { backgroundColor: '#1a3a6e', color: '#fff' } : { color: '#6b7280' }}
        >
          <i className="ti ti-layout-dashboard text-base" />
          Overview
        </button>
        <button
          onClick={() => onNavigate('monitoring')}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-left w-full transition-colors"
          style={activePage === 'monitoring' ? { backgroundColor: '#1a3a6e', color: '#fff' } : { color: '#6b7280' }}
        >
          <i className="ti ti-activity text-base" />
          Monitoring
        </button>
      </nav>
    </aside>
  )
}
