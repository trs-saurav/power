'use client'
import { ForgotPasswordForm } from '@/components/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-5xl">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
