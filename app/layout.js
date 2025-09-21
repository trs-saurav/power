import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";


const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  metadataBase: new URL('https://powerele.shop'),
  title: {
    default: 'Power Electronics - Premium Electrical Solutions in Patna, Bihar',
    template: '%s | Power Electronics'
  },
  description: 'Leading provider of UPS, solar, CCTV, and electrical solutions in Patna with 30+ years of experience. Professional installation and maintenance services across Bihar.',
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    url: 'https://powerele.shop', // Fixed URL
    title: 'Power Electronics - Premium Electrical Solutions in Patna',
    description: 'Leading electrical solutions provider in Patna with 30+ years of experience in UPS, solar, CCTV installations, and power backup systems across Bihar.',
    siteName: 'Power Electronics',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Power Electronics - Electrical Solutions in Patna, Bihar',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@powerelectronics', // Add your Twitter handle if available
    creator: '@powerelectronics',
    title: 'Power Electronics - Premium Electrical Solutions in Patna',
    description: 'Leading electrical solutions provider in Patna with 30+ years of experience in UPS, solar, and CCTV installations.',
    images: {
      url: '/og-image.jpg',
      alt: 'Power Electronics - Electrical Solutions',
    },
  },
  alternates: {
    canonical: 'https://powerele.shop',
    languages: {
      'en-IN': 'https://powerele.shop',
      'hi-IN': 'https://powerele.shop/hi', // If you plan to add Hindi version
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
    yandex: 'your-yandex-verification-code', // Optional
    bing: 'your-bing-verification-code', // Optional
  },
  category: 'electronics',
  classification: 'business',
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna',
    'geo.position': '25.5941;85.1376', // Patna coordinates
    'ICBM': '25.5941, 85.1376',
  },
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.png" sizes="any" />
        </head>
        <body className={`${outfit.className} antialiased bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster 
              toastOptions={{
                className: 'bg-background text-foreground border border-border',
              }}
            />
            <AppContextProvider>
                {children}
            </AppContextProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
