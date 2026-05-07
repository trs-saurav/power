'use client'
import { SigninForm } from '@/components/signin-form'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-5xl">
        <SigninForm />
      </div>
    </div>
  )
}
