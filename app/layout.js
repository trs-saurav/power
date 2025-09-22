// app/layout.js
import { Outfit } from 'next/font/google'
import './globals.css'
import { AppContextProvider } from '@/context/AppContext'
import { Toaster } from 'react-hot-toast'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'

const outfit = Outfit({ subsets: ['latin'], weight: ['300','400','500'] })

export const metadata = {
  metadataBase: new URL('https://powerele.shop'),
  title: {
    default: 'Power Electronics - Electrical Solutions in Patna',
    template: '%s | Power Electronics'
  },
  description: 'UPS, solar, CCTV, wiring and power backup services in Patna with 30+ years experience. Installation and maintenance across Bihar.',
  keywords: [
    'UPS systems Patna',
    'solar installation Bihar',
    'CCTV installation Patna',
    'electrical services Bihar',
    'voltage stabilizers Patna',
    'power backup solutions',
    'electrical wiring Patna',
    'inverter repair Bihar',
    'power electronics shop'
  ],
  authors: [{ name: 'Power Electronics', url: 'https://powerele.shop' }],
  creator: 'Power Electronics',
  publisher: 'Power Electronics',
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://powerele.shop',
    title: 'Power Electronics - Electrical Solutions in Patna',
    description: 'Electrical solutions provider in Patna with 30+ years experience in UPS, solar, CCTV and power backup systems.',
    siteName: 'Power Electronics',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Power Electronics - Electrical Solutions in Patna, Bihar', type: 'image/jpeg' }],
  },

  alternates: {
    canonical: 'https://powerele.shop',
    languages: { 'en-IN': 'https://powerele.shop', 'hi-IN': 'https://powerele.shop/hi' },
  },
  category: 'electronics',
  classification: 'business',
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna',
    'geo.position': '25.5941;85.1376',
    'ICBM': '25.5941, 85.1376',
  },
  // Icons: let Next.js emit correct tags
  icons: {
    icon: [
      { url: '/favicon.ico' },          // fallback
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} antialiased bg-background text-foreground`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Toaster toastOptions={{ className: 'bg-background text-foreground border border-border' }} />
            <AppContextProvider>{children}</AppContextProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
