import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [library, setLibrary] = useState([])
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadUserData()
    }
  }, [isAdminLoggedIn, id])

  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const loadUserData = async () => {
    try {
      setLoading(true)
      const [userResponse, statsResponse] = await Promise.all([
        adminFetch(`/admin/users/${id}`),
        adminFetch(`/admin/users/${id}/stats`)
      ])
      
      if (userResponse.ok && statsResponse.ok) {
        const userData = await userResponse.json()
        const statsData = await statsResponse.json()
        setUser(userData)
        setStats(statsData.stats)
      } else {
        setError('Error al cargar datos del usuario')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await adminFetch(`/admin/users/${id}/reviews`)
      
      if (response.ok) {
        const reviewsData = await response.json()
        setReviews(reviewsData.reviews)
      } else {
        alert('Error al cargar reseñas')
      }
    } catch (error) {
      alert('Error de conexión: ' + error.message)
    } finally {
      setReviewsLoading(false)
    }
  }

  const loadUserLibrary = async () => {
    try {
      setLibraryLoading(true)
      const response = await adminFetch(`/admin/users/${id}/library`)
      
      if (response.ok) {
        const libraryData = await response.json()
        setLibrary(libraryData.library)
      } else {
        alert('Error al cargar biblioteca')
      }
    } catch (error) {
      alert('Error de conexión: ' + error.message)
    } finally {
      setLibraryLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'reviews' && reviews.length === 0) {
      loadUserReviews()
    } else if (tab === 'library' && library.length === 0) {
      loadUserLibrary()
    }
  }

  const toggleUserStatus = async () => {
    try {
      const response = await adminFetch(`/admin/users/${id}/status`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser.user)
        alert(updatedUser.message)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al cambiar estado')
      }
    } catch (error) {
      alert('Error de conexión: ' + error.message)
    }
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <SessionBlocker requiredRole="admin">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center py-5">
              <h3>Usuario no encontrado</h3>
              <Link to="/admin/users" className="btn btn-primary mt-3">
                Volver a Usuarios
              </Link>
            </div>
          </div>
        </div>
      </SessionBlocker>
    )
  }

  const renderOverview = () => (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Información del Usuario</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <strong>ID Usuario:</strong> {user.id_usuario}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {user.email_usuario}
            </div>
            <div className="mb-3">
              <strong>Estado:</strong> 
              <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'} ms-2`}>
                {user.is_active ? 'Activo' : 'Bloqueado'}
              </span>
            </div>
            <div className="mb-3">
              <strong>Fecha Registro:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <div className="mb-3">
              <strong>Última Actualización:</strong> {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Estadísticas</h5>
          </div>
          <div className="card-body">
            {stats ? (
              <>
                <div className="row text-center mb-4">
                  <div className="col-4">
                    <h3 className="text-primary mb-0">{stats.total_books || 0}</h3>
                    <small className="text-muted">Total Libros</small>
                  </div>
                  <div className="col-4">
                    <h3 className="text-success mb-0">{stats.total_reviews || 0}</h3>
                    <small className="text-muted">Reseñas</small>
                  </div>
                  <div className="col-4">
                    <h3 className="text-info mb-0">
                      {stats.reading_status ? Object.values(stats.reading_status).reduce((a, b) => a + b, 0) : 0}
                    </h3>
                    <small className="text-muted">En Biblioteca</small>
                  </div>
                </div>
                
                {stats.reading_status && (
                  <div>
                    <h6>Estado de Lectura:</h6>
                    <div className="progress mb-2" style={{height: '20px'}}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${(stats.reading_status.leido / stats.total_books) * 100 || 0}%`}}
                        title={`Leídos: ${stats.reading_status.leido}`}
                      >
                        {stats.reading_status.leido}
                      </div>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{width: `${(stats.reading_status.leyendo / stats.total_books) * 100 || 0}%`}}
                        title={`Leyendo: ${stats.reading_status.leyendo}`}
                      >
                        {stats.reading_status.leyendo}
                      </div>
                      <div 
                        className="progress-bar bg-info" 
                        style={{width: `${(stats.reading_status.quiero_leer / stats.total_books) * 100 || 0}%`}}
                        title={`Por leer: ${stats.reading_status.quiero_leer}`}
                      >
                        {stats.reading_status.quiero_leer}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Leídos: {stats.reading_status.leido}</span>
                      <span>Leyendo: {stats.reading_status.leyendo}</span>
                      <span>Por leer: {stats.reading_status.quiero_leer}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderReviews = () => (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Reseñas del Usuario</h5>
        <span className="badge bg-primary">{reviews.length} reseñas</span>
      </div>
      <div className="card-body">
        {reviewsLoading ? (
          <LoadingSpinner />
        ) : reviews.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
            <p className="text-muted">El usuario no ha realizado ninguna reseña</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Calificación</th>
                  <th>Reseña</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id_calificacion}>
                    <td>
                      <strong>{review.book.titulo_libro}</strong>
                      <br />
                      <small className="text-muted">{review.book.autor}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="text-warning">
                          {'★'.repeat(review.calificacion)}{'☆'.repeat(5 - review.calificacion)}
                        </span>
                        <span className="ms-2">({review.calificacion}/5)</span>
                      </div>
                    </td>
                    <td>
                      {review.resena ? (
                        <p className="mb-0" style={{maxWidth: '300px'}}>
                          {review.resena.length > 100 
                            ? `${review.resena.substring(0, 100)}...` 
                            : review.resena
                          }
                        </p>
                      ) : (
                        <span className="text-muted">Sin reseña escrita</span>
                      )}
                    </td>
                    <td>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  const renderLibrary = () => (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Biblioteca Personal</h5>
        <span className="badge bg-primary">{library.length} libros</span>
      </div>
      <div className="card-body">
        {libraryLoading ? (
          <LoadingSpinner />
        ) : library.length === 0 ? (
          <div className="text-center py-4">
            <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
            <p className="text-muted">El usuario no tiene libros en su biblioteca</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Autor</th>
                  <th>Género</th>
                  <th>Estado</th>
                  <th>Agregado</th>
                </tr>
              </thead>
              <tbody>
                {library.map((item) => (
                  <tr key={item.id_biblioteca}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.book.enlace_portada_libro ? (
                          <img 
                            src={item.book.enlace_portada_libro} 
                            alt={item.book.titulo_libro}
                            className="me-3"
                            style={{width: '40px', height: '60px', objectFit: 'cover'}}
                          />
                        ) : (
                          <div className="bg-light me-3 d-flex align-items-center justify-content-center"
                               style={{width: '40px', height: '60px'}}>
                            <i className="fas fa-book text-muted"></i>
                          </div>
                        )}
                        <div>
                          <strong>{item.book.titulo_libro}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{item.book.autor}</td>
                    <td>
                      <span className="badge bg-secondary">{item.book.genero_libro}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.estado_lectura === 'leido' ? 'bg-success' :
                        item.estado_lectura === 'leyendo' ? 'bg-warning' : 'bg-info'
                      }`}>
                        {item.estado_lectura === 'leido' ? 'Leído' :
                         item.estado_lectura === 'leyendo' ? 'Leyendo' : 'Por leer'}
                      </span>
                    </td>
                    <td>
                      {item.added_at ? new Date(item.added_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <SessionBlocker requiredRole="admin">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 vh-100 position-fixed">
            <div className="p-3">
              <h4 className="text-center mb-4">BooketList Admin</h4>
              <nav className="nav flex-column">
                <Link to="/admin" className="nav-link mb-2">
                  <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                </Link>
                <Link to="/admin/users" className="nav-link mb-2">
                  <i className="fas fa-users me-2"></i>Gestión de Usuarios
                </Link>
                <Link to="/admin/books" className="nav-link mb-2">
                  <i className="fas fa-book me-2"></i>Gestión de Libros
                </Link>
                <Link to="/admin/authors" className="nav-link mb-2">
                  <i className="fas fa-pen-fancy me-2"></i>Gestión de Autores
                </Link>
                <button onClick={handleLogout} className="nav-link mt-4 text-start border-0 bg-transparent">
                  <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>

          <div className="col-md-9 col-lg-10 ms-auto">
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Perfil de Usuario</h1>
                <Link to="/admin/users" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Volver a Usuarios
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Header del Usuario */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center">
                        <div className="avatar bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" 
                             style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                          {user.nombre_usuario?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="mb-1">{user.nombre_usuario} {user.apellido_usuario}</h3>
                          <p className="text-muted mb-2">{user.email_usuario}</p>
                          <div className="d-flex gap-2 mb-2">
                            <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {user.is_active ? 'Activo' : 'Bloqueado'}
                            </span>
                          </div>
                          <div className="text-muted">
                            <small>Miembro desde: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="mb-3">
                        <button 
                          className={`btn ${user.is_active ? 'btn-warning' : 'btn-success'} btn-lg`}
                          onClick={toggleUserStatus}
                        >
                          <i className={`fas ${user.is_active ? 'fa-lock' : 'fa-unlock'} me-2`}></i>
                          {user.is_active ? 'Bloquear Usuario' : 'Desbloquear Usuario'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navegación por Tabs */}
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => handleTabChange('overview')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>Resumen
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => handleTabChange('reviews')}
                  >
                    <i className="fas fa-star me-2"></i>Reseñas
                    {stats && <span className="badge bg-primary ms-2">{stats.total_reviews}</span>}
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'library' ? 'active' : ''}`}
                    onClick={() => handleTabChange('library')}
                  >
                    <i className="fas fa-book me-2"></i>Biblioteca
                    {stats && <span className="badge bg-primary ms-2">{stats.total_books}</span>}
                  </button>
                </div>
              </nav>

              {/* Contenido de los Tabs */}
              <div className="tab-content mt-4">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'reviews' && renderReviews()}
                {activeTab === 'library' && renderLibrary()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}