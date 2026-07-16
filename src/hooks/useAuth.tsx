// src/hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// Mocking the AdminUser interface inline since we are decoupling from the live API
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
}

interface AuthCtx {
  admin:   AdminUser | null
  loading: boolean
  login:   (email: string, password: string) => Promise<void>
  logout:  () => void
}

const Ctx = createContext<AuthCtx>({ 
  admin: null, 
  loading: true, 
  login: async () => {}, 
  logout: () => {} 
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin,   setAdmin]   = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Simulate verifying the session on app mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { 
      setLoading(false)
      return 
    }
    
    // Simulate a successful API response from /api/auth/me
    setAdmin({
      id: "admin-1",
      email: "admin@enduro.com",
      name: "Thoufiq (Admin)",
      role: 'admin'
    })
    setLoading(false)
  }, [])

  // Simulate backend validation for login
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    
    // Tiny artificial delay to make the UI loader feel realistic
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Set a dummy token to persist the session across mock refreshes
    localStorage.setItem('admin_token', 'mock_jwt_token_value')
    
    setAdmin({
      id: "admin-1",
      email: email || "admin@enduro.com",
      name: "Thoufiq (Admin)",
      role: 'admin'
    })
    
    setLoading(false)
    navigate('/admin')
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    setAdmin(null)
    navigate('/auth/login') 
    // Note: Verify if your router uses '/auth/login' or just '/login' based on your tree!
  }, [navigate])

  return <Ctx.Provider value={{ admin, loading, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth() { return useContext(Ctx) }