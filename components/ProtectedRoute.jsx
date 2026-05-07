// components/ProtectedRoute.jsx
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to access this page')
      router.push('/sign-in')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== requiredRole) {
      // For admin route, check if user has admin role
      if (requiredRole === 'admin' && session?.user?.role !== 'admin') {
        toast.error('You do not have permission to access this page')
        router.push('/')
        return
      }
    }
  }, [session, status, router, requiredRole])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading if user not authenticated or doesn't have permission
  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
