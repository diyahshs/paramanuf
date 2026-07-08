import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Paramanuf — by Paragoncorp',
  description: 'Production monitoring dashboard for Paragon manufacturing plants',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
