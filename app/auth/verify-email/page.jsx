'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(null)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token || !email) {
          setError('Invalid verification link. Missing token or email.')
          setIsLoading(false)
          return
        }

        console.log('🔐 Verifying email with token:', token)
        console.log('📧 Email:', email)

        const response = await axios.post('/api/user/verify-email', {
          email,
          token,
        })

        if (response.status === 200) {
          console.log('✅ Email verified successfully')
          setIsVerified(true)
          toast.success('Email verified successfully!')
          
          // Redirect to login or settings after 3 seconds
          setTimeout(() => {
            router.push('/sign-in')
          }, 3000)
        }
      } catch (err) {
        console.error('❌ Verification error:', err)
        setError(
          err.response?.data?.message || 
          'Failed to verify email. The link may have expired.'
        )
        toast.error(err.response?.data?.message || 'Verification failed')
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [token, email, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            {isLoading && (
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            )}
            {isVerified && (
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            )}
            {error && !isLoading && (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
            {!isLoading && !isVerified && !error && (
              <Mail className="w-12 h-12 text-primary" />
            )}
          </div>
          <CardTitle>
            {isLoading && 'Verifying Your Email'}
            {isVerified && 'Email Verified Successfully!'}
            {error && 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {isLoading && 'Please wait while we verify your email address...'}
            {isVerified && 'Your email has been verified. Redirecting you...'}
            {error && 'There was an issue verifying your email'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Token: {token?.substring(0, 8)}...
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Email: {email}
              </p>
            </div>
          )}

          {isVerified && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Your email address has been successfully verified. You can now use all features of your account.
              </p>
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg p-3">
                <p className="text-sm text-green-800 dark:text-green-200 text-center">
                  ✓ Email verification complete
                </p>
              </div>
              <Button 
                onClick={() => router.push('/sign-in')}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
              <Button 
                onClick={() => router.push('/settings/profile')}
                variant="outline"
                className="w-full"
              >
                Back to Profile Settings
              </Button>
              <Button 
                onClick={() => router.push('/sign-in')}
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          )}

          {!isLoading && !isVerified && !error && (
            <Button className="w-full" disabled>
              Verification Complete
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
