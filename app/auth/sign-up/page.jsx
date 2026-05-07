'use client'
import { SignupForm } from '@/components/signup-form'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-5xl">
        <SignupForm />
      </div>
    </div>
  )
}
