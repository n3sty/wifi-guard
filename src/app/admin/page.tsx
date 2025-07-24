import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth()
  
  // If user is already signed in, check if they have admin privileges
  if (userId) {    
    if (sessionClaims?.role === 'admin') {
      // User is authenticated admin, redirect to analytics
      redirect('/admin/analytics')
    } else {
      // User is authenticated but not an admin - show error
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
              <p className="mt-2 text-sm text-gray-600">
                You don&apos;t have admin privileges to access this area.
              </p>
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the analytics dashboard
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow">
          <SignIn 
            afterSignInUrl="/admin/analytics"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                card: 'shadow-none'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}