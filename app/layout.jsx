import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata = {
  title: 'EcoTrack | Environmental Sustainability Management',
  description: 'Monitor carbon emissions, energy, water, and sustainability goals across your organization.',
  generator: 'v0.app',
}

export const viewport = {
  colorScheme: 'light',
  themeColor: '#F7F9F8',
}

export default function RootLayout({ children }) {
  return <html lang="en" className="bg-[#F7F9F8]"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
