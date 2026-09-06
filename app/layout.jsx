import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

export const metadata = {
  title: 'EcoTrack | Enterprise Carbon Intelligence & ESG Management',
  description: 'Enterprise sustainability platform for GHG Protocol Scope 1/2/3 accounting, water stewardship, SBTi glidepaths, and CSRD compliance.',
  generator: 'v0.app',
}

export const viewport = {
  colorScheme: 'light',
  themeColor: '#F7F9F8',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#F7F9F8]">
      <body className="antialiased">
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
