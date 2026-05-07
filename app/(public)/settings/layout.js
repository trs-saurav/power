'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  User,
  MapPin,
  ShoppingCart,
  History,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

const settingsMenu = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
    description: 'Manage your profile information',
  },
  {
    title: 'Addresses',
    href: '/settings/add-address',
    icon: MapPin,
    description: 'Manage your delivery addresses',
  },
  {
    title: 'Default Settings',
    href: '/settings/default-settings',
    icon: Settings,
    description: 'Set default profile information',
  },
  {
    title: 'Cart',
    href: '/settings/cart',
    icon: ShoppingCart,
    description: 'View your shopping cart',
  },
  {
    title: 'Order History',
    href: '/settings/orders',
    icon: History,
    description: 'View your past orders',
  },
  {
    title: 'Preferences',
    href: '/settings/preferences',
    icon: Bell,
    description: 'Email and notification preferences',
  },
]

function SidebarNav({ pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-2">
      {settingsMenu.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            <div
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-accent/50'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.title}</p>
                <p className={cn(
                  'text-xs truncate',
                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  {item.description}
                </p>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

export default function SettingsLayout({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  // Close mobile sheet when pathname changes (on navigation)
  useEffect(() => {
    setMobileSheetOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-80 flex-col border-r border-border bg-muted/30">
        <ScrollArea className="flex-1 p-6">
          {/* Sidebar Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>

          <Separator className="mb-6" />

          {/* Navigation */}
          <SidebarNav pathname={pathname} onNavigate={() => {}} />
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-border space-y-3">
          <Separator />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Sheet */}
      <div className="md:hidden">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-40">
            <h1 className="text-xl font-bold">Settings</h1>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent side="left" className="p-0 w-80">
            <ScrollArea className="h-full p-6">
              {/* Mobile Sidebar Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>

              <Separator className="mb-6" />

              {/* Mobile Navigation - Sheet closes automatically on route change */}
              <SidebarNav pathname={pathname} onNavigate={() => {}} />

              <Separator className="my-6" />

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl w-full">
        {children}
      </main>
    </div>
  )
}
