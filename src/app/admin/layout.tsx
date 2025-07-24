import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

async function checkAdminAccess() {
  const { userId, sessionClaims } = await auth()
  
  if (!userId) {
    redirect('/admin')
  }
  
  if (sessionClaims?.role !== 'admin') {
    redirect('/')
  }
  
  return userId
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Double-check admin access at layout level
  await checkAdminAccess()
  const user = await currentUser()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                WiFi Guard Admin
              </h1>
              <nav className="flex space-x-8">
                <a
                  href="/admin/analytics"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Analytics
                </a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: {user?.firstName} {user?.lastName}
              </span>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>WiFi Guard Admin Dashboard</p>
            <p>
              Environment: {process.env.NODE_ENV}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}