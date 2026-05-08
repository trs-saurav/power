'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"

export function SigninForm({
  className,
  ...props
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error || 'Failed to sign in')
      } else if (result?.ok) {
        toast.success('Signed in successfully')
        router.push('/admin')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      // For OAuth providers, use redirect: true to allow proper OAuth callback flow
      await signIn('google', {
        redirect: true,
        callbackUrl: '/admin',
      })
      // Note: The function will redirect, so code after this won't execute for successful OAuth
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in with Google')
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
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Sign in to your account to continue shopping
                </p>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <Field>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm underline-offset-2 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Signing in...' : 'Sign in with Email'}
                </Button>
              </form>

              <div className="relative flex items-center gap-4 my-4">
                <div className="flex-1 border-t border-border"></div>
                <span className="text-sm text-muted-foreground">Or</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              <Field>
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign-up" className="text-primary hover:underline font-semibold">
                  Sign up
                </Link>
              </FieldDescription>
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
