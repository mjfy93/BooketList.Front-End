import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import { API_BASE_URL } from "../utils/api"
import SessionBlocker from '../components/SessionBlocker'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    last_name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones
    if (!formData.username || !formData.email || !formData.password) {
      setError('Por favor, completa todos los campos obligatorios')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un email válido')
      setLoading(false)
      return
    }

    try {
      console.log('📤 Enviando datos al backend:', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        last_name: formData.last_name
      })

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          last_name: formData.last_name
        }),
      })

      console.log('📥 Respuesta del servidor:', response.status, response.statusText)

      const data = await response.json()
      console.log('📄 Datos de respuesta:', data)

      if (response.ok) {
        // Usar la función login del AuthContext para establecer la sesión
        await login(formData.email, formData.password)
        
        alert('¡Cuenta creada exitosamente!')
        navigate('/biblioteca')
      } else {
        setError(data.error || data.message || 'Error en el registro')
      }
    } catch (err) {
      console.error('💥 Error de registro:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SessionBlocker requiredRole="user">
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-4 ">
        <div className="card shadow border-0" style={{ width: '100%', maxWidth: '450px' }}>
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="card-title fw-bold text-warning">Crear Cuenta</h2>
              <p className="text-muted mb-0">Únete a la comunidad de BooketList</p>
            </div>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-semibold">Nombre de Usuario *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="username" 
                  name="username"
                  placeholder="Tu nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="last_name" className="form-label fw-semibold">Apellido</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="last_name" 
                  name="last_name"
                  placeholder="Tu apellido (opcional)"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Contraseña *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="password" 
                  name="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirmar Contraseña *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted">
                ¿Ya tienes cuenta? <Link to="/login" className="text-warning">Inicia sesión aquí</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}