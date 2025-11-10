import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos')
      return
    }

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        navigate('/')
      } else {
        // Mostrar mensaje específico para cuenta bloqueada
        if (result.error && result.error.includes('bloqueada')) {
          setError(result.error)
        } else {
          setError(result.error || 'Credenciales inválidas')
        }
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  return (
    <SessionBlocker requiredRole="user">
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
        <div className="card shadow border-0" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="card-title fw-bold text-warning">Iniciar Sesión</h2>
              <p className="text-muted mb-0">Accede a tu cuenta de BooketList</p>
            </div>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
                {/* Mostrar información de contacto si la cuenta está bloqueada */}
                {error.includes('bloqueada') && (
                  <div className="mt-2">
                    <small>
                      Si crees que esto es un error, contacta a: 
                      <a href="mailto:soporte@booketlist.com" className="text-danger ms-1">
                        soporte@booketlist.com
                      </a>
                    </small>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg" 
                  id="email" 
                  placeholder="correo@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                className="btn btn-warning btn-lg w-100 py-3 fw-semibold"
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

            <div className="text-center mt-4">
              <p className="text-muted">
                ¿No tienes cuenta? <a href="/register" className="text-warning">Regístrate aquí</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}