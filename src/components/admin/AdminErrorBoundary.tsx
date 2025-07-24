'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminErrorBoundary({ error, reset }: AdminErrorBoundaryProps) {
  const router = useRouter()

  useEffect(() => {
    console.error('Admin dashboard error:', error)
  }, [error])

  // Handle authentication errors by redirecting
  if (error.message.includes('Authentication required') || error.message.includes('Admin privileges required')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
            <p className="mt-2 text-sm text-gray-600">
              {error.message.includes('Authentication required') 
                ? 'You need to sign in to access this area.'
                : 'You don&apos;t have admin privileges to access this area.'
              }
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => router.push('/admin')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Admin Login
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle other errors
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Admin Dashboard Error
      </h2>
      <p className="text-red-600 mb-4">
        {error.message || 'An unexpected error occurred in the admin dashboard.'}
      </p>
      <div className="space-x-3">
        <button 
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
        >
          Back to Admin
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600">
            Error Details (Development)
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}