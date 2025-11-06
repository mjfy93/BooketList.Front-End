// context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Verificar si el admin está autenticado al cargar la app
  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = () => {
    try {
      const token = localStorage.getItem('adminToken')
      const adminData = localStorage.getItem('adminData')
      
      if (token && adminData) {
        setAdmin(JSON.parse(adminData))
      }
    } catch (error) {
      console.error('Error checking admin auth:', error)
      // Limpiar datos corruptos
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
    } finally {
      setLoading(false)
    }
  }

  const adminLogin = async (email, password) => {
    try {
      setLoading(true)
      
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_admin: email,
          password_admin: password
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Guardar token y datos en localStorage
        localStorage.setItem('adminToken', data.access_token)
        localStorage.setItem('adminData', JSON.stringify(data.admin))
        setAdmin(data.admin)
        
        return { success: true }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.message || 'Error en el login' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error de conexión: ' + error.message }
    } finally {
      setLoading(false)
    }
  }

  const adminLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    
    // Limpiar estado
    setAdmin(null)
    
    // Redirigir al login
    navigate('admin/login')
  }

  const adminFetch = async (url, options = {}) => {
    const token = localStorage.getItem('adminToken')
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(`http://localhost:5000/api${url}`, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      })

      // Si el token es inválido o expiró, hacer logout
      if (response.status === 401) {
        adminLogout()
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
      }

      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  const isAdminLoggedIn = () => {
    return !!localStorage.getItem('adminToken')
  }

  const value = {
    admin,
    loading,
    adminLogin,
    adminLogout,
    adminFetch,
    isAdminLoggedIn,
    checkAdminAuth
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}