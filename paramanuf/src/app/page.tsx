'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import OverviewPage from '@/components/OverviewPage'
import MonitoringPage from '@/components/MonitoringPage'

export default function Home() {
  const [page, setPage] = useState<'overview' | 'monitoring'>('overview')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {page === 'overview' ? <OverviewPage /> : <MonitoringPage />}
      </main>
    </div>
  )
}
