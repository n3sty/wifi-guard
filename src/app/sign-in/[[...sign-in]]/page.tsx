import { SignIn } from '@clerk/nextjs'
import { Shield } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">WiFi Guard</h1>
          <p className="text-slate-300">Admin Sign In</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
              card: 'bg-white/10 backdrop-blur-sm border border-white/20',
              headerTitle: 'text-white',
              headerSubtitle: 'text-slate-300',
              socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
              formFieldLabel: 'text-slate-300',
              formFieldInput: 'bg-white/10 border-white/20 text-white',
              footerActionLink: 'text-blue-400 hover:text-blue-300'
            }
          }}
        />
      </div>
    </div>
  )
}