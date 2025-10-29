// routes/register.jsx
import { useState } from 'react'
import { Link } from 'react-router'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica de registro
    alert('Registro exitoso. Redirigiendo...')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="card shadow border-0" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="card-title fw-bold text-primary">Crear Cuenta</h2>
            <p className="text-muted mb-0">Únete a nuestra comunidad de lectores</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">Nombre Completo *</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email *</label>
              <input 
                type="email" 
                className="form-control form-control-lg" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">Contraseña *</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <div className="form-text">
                Mínimo 8 caracteres
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirmar Contraseña *</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="mb-4">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="acceptTerms">
                  Acepto los <a href="/terms" className="text-decoration-none">términos y condiciones</a> y la <a href="/privacy" className="text-decoration-none">política de privacidad</a>
                </label>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3 mb-3 fw-semibold">
              Crear Cuenta
            </button>

            <div className="text-center mb-3">
              <p className="mb-0">
                ¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-none fw-semibold">Inicia Sesión</Link>
              </p>
            </div>

            <div className="text-center">
              <Link to="/" className="text-decoration-none text-muted">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}