// routes/admin-login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAdmin } from '../context/AdminContext.jsx'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin, loading } = useAdmin()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validación básica
    if (!formData.username || !formData.password) {
      setError('Por favor, completa todos los campos')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.username)) {
      setError('Por favor, ingresa un email válido')
      return
    }

    try {
      console.log('Attempting login...')
      const result = await adminLogin(formData.username, formData.password)

      if (result.success) {
        console.log('Login successful, redirecting...')
        alert('Login exitoso! Redirigiendo al dashboard...')
        navigate('/admin')
      } else {
        console.log('Login failed:', result.error)
        setError(result.error || 'Credenciales inválidas')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error de conexión con el servidor: ' + error.message)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  // Datos de prueba para desarrollo
  const fillTestCredentials = () => {
    setFormData({
      username: 'admin@booketlist.com',
      password: 'admin123'
    })
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="card shadow border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="card-title fw-bold text-primary">Admin Login</h2>
            <p className="text-muted mb-0">Acceso exclusivo para administradores</p>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">Email Admin</label>
              <input 
                type="email" 
                className="form-control form-control-lg" 
                id="username" 
                placeholder="admin@booketlist.com"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                id="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Solo mostrar en desarrollo */}
         
        </div>
      </div>
    </div>
  )
}