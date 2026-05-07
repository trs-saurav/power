'use client'

import { SessionProvider } from 'next-auth/react'
import { AppContextProvider } from '@/context/AppContext'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster toastOptions={{ className: 'bg-background text-foreground border border-border' }} />
        <AppContextProvider>{children}</AppContextProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
