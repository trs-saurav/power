import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";


const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  metadataBase: new URL('https://powerele.vercel.app'),
  title: {
    default: 'Power Electronics - Premium Electrical Solutions in Patna, Bihar',
    template: '%s | Power Electronics'
  },
  description: 'Leading provider of UPS, solar, CCTV, and electrical solutions in Patna with 30+ years of experience. Professional installation and maintenance services.',
  keywords: [
    'UPS systems Patna',
    'solar installation Bihar',
    'CCTV installation Patna',
    'electrical services Bihar',
    'voltage stabilizers Patna',
    'power backup solutions',
    'electrical wiring Patna'
  ],
  authors: [{ name: 'Power Electronics' }],
  creator: 'Power Electronics',
  publisher: 'Power Electronics',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://powerele.vercel.app',
    title: 'Power Electronics - Premium Electrical Solutions',
    description: 'Leading electrical solutions provider in Patna with 30+ years of experience in UPS, solar, CCTV installations.',
    siteName: 'Power Electronics',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Power Electronics - Electrical Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power Electronics - Premium Electrical Solutions',
    description: 'Leading electrical solutions provider in Patna with 30+ years of experience.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
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
