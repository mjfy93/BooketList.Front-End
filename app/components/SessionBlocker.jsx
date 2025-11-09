// components/SessionBlocker.jsx
import { useAuth } from '../context/AuthContext.jsx';

export default function SessionBlocker({ children, requiredRole = null }) {
  const { isAuthenticated, isAdmin, logout, adminLogout } = useAuth();

  // Si no requiere rol específico, mostrar el contenido normal
  if (!requiredRole) {
    return children;
  }

  // Si el usuario está autenticado pero intenta acceder a admin
  if (requiredRole === 'admin' && isAuthenticated && !isAdmin) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <i className="fas fa-exclamation-triangle fa-3x text-warning mb-4"></i>
                <h3>Sesión de Usuario Activa</h3>
                <p className="text-muted mb-4">
                  Tienes una sesión de usuario activa. Para acceder al panel de administración, 
                  debes cerrar sesión primero.
                </p>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-warning"
                    onClick={() => {
                      logout();
                      setTimeout(() => window.location.href = '/admin/login', 500);
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión de Usuario e Ir a Admin
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.location.href = '/'}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver al Sitio Principal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el admin está autenticado pero intenta acceder a usuario
  if (requiredRole === 'user' && isAdmin && !isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <i className="fas fa-user-shield fa-3x text-primary mb-4"></i>
                <h3>Sesión de Admin Activa</h3>
                <p className="text-muted mb-4">
                  Tienes una sesión de administrador activa. Para acceder al área de usuario, 
                  debes cerrar sesión primero.
                </p>
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      adminLogout();
                      setTimeout(() => window.location.href = '/login', 500);
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión de Admin e Ir a Usuario
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.location.href = '/admin'}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver al Panel de Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay conflicto de sesiones, mostrar el contenido normal
  return children;
}