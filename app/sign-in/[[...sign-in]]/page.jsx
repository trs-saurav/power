// app/sign-in/[[...sign-in]]/page.jsx
import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your admin dashboard
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              }
            }}
            redirectUrl="/admin"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  )
}

export default SignInPage
