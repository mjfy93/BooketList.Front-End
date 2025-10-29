// routes/login.jsx
import { useState } from 'react'
import { Link } from 'react-router'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica de login
    alert('Inicio de sesión exitoso. Redirigiendo...')
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
      <div className="card shadow border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="card-title fw-bold text-primary">Iniciar Sesión</h2>
            <p className="text-muted mb-0">Bienvenido de vuelta a BooketList</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
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
              <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
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
            </div>
            
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="remember">
                  Recordar sesión
                </label>
              </div>
              <a href="/forgot-password" className="text-decoration-none">¿Olvidaste tu contraseña?</a>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3 mb-3 fw-semibold">
              Iniciar Sesión
            </button>

            <div className="text-center mb-3">
              <p className="mb-0">
                ¿No tienes una cuenta? <Link to="/register" className="text-decoration-none fw-semibold">Regístrate</Link>
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