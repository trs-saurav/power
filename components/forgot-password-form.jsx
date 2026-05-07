'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader } from 'lucide-react'

export function ForgotPasswordForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email')
      return
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Failed to send reset email')
        return
      }

      setSubmitted(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset password</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  {submitted 
                    ? 'Check your email for reset instructions' 
                    : 'Enter your email to receive a password reset link'}
                </p>
              </div>

              {!submitted ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <FieldDescription>
                          We&apos;ll send a password reset link to this email address.
                        </FieldDescription>
                      </Field>

                      <Field>
                        <Button type="submit" disabled={isLoading} className="w-full">
                          {isLoading ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            'Send Reset Link'
                          )}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>

                  <FieldDescription className="text-center">
                    Remember your password?{' '}
                    <Link href="/sign-in" className="text-primary hover:underline font-semibold">
                      Sign in
                    </Link>
                  </FieldDescription>
                </>
              ) : (
                <>
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-300 font-medium text-sm">
                      Email sent successfully!
                    </p>
                    <p className="text-green-700 dark:text-green-400 text-xs mt-2">
                      Please check your email for the password reset link. It will expire in 24 hours.
                    </p>
                  </div>

                  <Field>
                    <Button
                      onClick={() => {
                        setSubmitted(false)
                        setEmail('')
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Try another email
                    </Button>
                  </Field>

                  <FieldDescription className="text-center">
                    <Link href="/sign-in" className="text-primary hover:underline font-semibold">
                      Back to sign in
                    </Link>
                  </FieldDescription>
                </>
              )}
            </FieldGroup>
          </div>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
