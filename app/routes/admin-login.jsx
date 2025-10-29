// routes/admin-login.jsx
export default function AdminLogin() {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="card shadow border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="card-title fw-bold text-primary">Admin Login</h2>
            <p className="text-muted mb-0">Acceso exclusivo para administradores</p>
          </div>
          
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input 
                type="email" 
                className="form-control form-control-lg" 
                id="email" 
                placeholder="admin@booketlist.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                id="password" 
                placeholder="••••••••"
              />
            </div>
            
            <div className="mb-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label className="form-check-label" htmlFor="remember">
                  Recordar sesión
                </label>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-semibold">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}