import React, { useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import { useAuth, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/extra/ModeToggle'
import { motion } from 'framer-motion'
import {
  LogOut,
  Home,
  Sparkles,
  Shield,
  ChevronDown
} from 'lucide-react'

const Navbar = () => {
  const { router } = useAppContext()
  const { signOut } = useAuth()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout')
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm'
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        
        {/* Left Section - Logo */}
        <Link 
          href="/" 
          className="relative flex items-center group transition-all duration-300 hover:scale-105"
          aria-label="Power Electronics Home"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-1.5 border border-primary/20">
              <Image 
                src="/favicon.png" 
                alt="Power Electronics Logo" 
                width={48} 
                height={48} 
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="ml-3 hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                Power Electronics
              </h1>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Dashboard Control Panel
            </p>
          </div>
        </Link>

        {/* Right Section - Theme Toggle & User */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-xl transition-all duration-200"
              >
                <Avatar className="w-9 h-9 border-2 border-border/50">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-medium">
                    {user?.fullName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">
                    {user?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Administrator
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Admin Panel
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleGoHome}
                className="cursor-pointer flex items-center gap-2 hover:bg-muted/50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Website
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isLoading}
                className="cursor-pointer flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
