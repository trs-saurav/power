// components/ProtectedRoute.jsx
'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        toast.error('Please sign in to access this page')
        router.push('/sign-in')
        return
      }

      const userRole = user?.publicMetadata?.role
      if (userRole !== requiredRole) {
        toast.error('You do not have permission to access this page')
        router.push('/')
        return
      }
    }
  }, [user, isLoaded, router, requiredRole])

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading if user not loaded or doesn't have permission
  if (!user || user?.publicMetadata?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
