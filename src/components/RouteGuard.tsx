import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentSession, getAuthUser } from '@/lib/auth'

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'alumni'
}

export const RouteGuard = ({ children, requiredRole }: RouteGuardProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'student' | 'alumni' | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getCurrentSession()
        if (!session) {
          setIsAuthenticated(false)
          navigate('/sign-in', { state: { from: location.pathname } })
          return
        }

        const authUser = await getAuthUser()
        if (!authUser) {
          setIsAuthenticated(false)
          navigate('/sign-in', { state: { from: location.pathname } })
          return
        }

        setIsAuthenticated(true)
        setUserRole(authUser.role)

        // Check role requirement
        if (requiredRole && authUser.role !== requiredRole) {
          // Redirect to appropriate dashboard based on role
          if (authUser.role === 'student') {
            navigate('/home')
          } else {
            navigate('/alumni-dashboard')
          }
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        navigate('/sign-in', { state: { from: location.pathname } })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [navigate, location.pathname, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vt-maroon mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && userRole !== requiredRole) {
    return null
  }

  return <>{children}</>
}
