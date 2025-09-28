import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/auth'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vt-maroon via-vt-maroon-light to-vt-orange flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-white/15"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full bg-white/10"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-white/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-vt-maroon text-white rounded-full p-3">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl text-vt-maroon">Welcome Back</CardTitle>
            <p className="text-muted-foreground">Sign in to your Hokies Connect account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-vt-maroon hover:bg-vt-maroon-light text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/sign-up"
                  className="text-vt-maroon hover:text-vt-maroon-light font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-white/60 text-sm">
          Virginia Tech Alumni Network • Est. 1872
        </p>
      </div>
    </div>
  )
}

export default SignIn
