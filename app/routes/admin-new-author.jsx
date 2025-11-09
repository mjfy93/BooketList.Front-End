import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function AdminNewAuthor() {
  const navigate = useNavigate()
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  const [author, setAuthor] = useState({
    nombre_autor: '',
    apellido_autor: '',
    biografia_autor: '',
    imagen_autor: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const handleSave = async () => {
    if (!author.nombre_autor || !author.apellido_autor) {
      alert('Por favor, completa los campos obligatorios (Nombre y Apellido)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await adminFetch('/admin/authors/create', {
        method: 'POST',
        body: JSON.stringify(author)
      })

      if (response.ok) {
        const data = await response.json()
        alert('Autor creado correctamente')
        navigate('/admin/authors')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al crear autor')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setAuthor({...author, [field]: value})
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

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
                <h1>Agregar Nuevo Autor</h1>
                <Link to="/admin/authors" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Volver a Autores
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Información del Autor</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Nombre *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre del autor"
                              value={author.nombre_autor}
                              onChange={(e) => handleInputChange('nombre_autor', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Apellido *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Apellido del autor"
                              value={author.apellido_autor}
                              onChange={(e) => handleInputChange('apellido_autor', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Biografía</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Biografía del autor..."
                            value={author.biografia_autor}
                            onChange={(e) => handleInputChange('biografia_autor', e.target.value)}
                          ></textarea>
                        </div>

                        <div className="d-flex gap-2">
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={handleSave}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Creando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-plus me-2"></i>Crear Autor
                              </>
                            )}
                          </button>
                          <Link to="/admin/authors" className="btn btn-outline-secondary">
                            Cancelar
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Vista Previa</h5>
                    </div>
                    <div className="card-body text-center">
                      {author.imagen_autor ? (
                        <img 
                          src={author.imagen_autor} 
                          alt="Vista previa"
                          className="rounded-circle mb-3"
                          style={{width: '100px', height: '100px', objectFit: 'cover'}}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="avatar bg-info text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                             style={{width: '100px', height: '100px', fontSize: '2rem'}}>
                          {author.nombre_autor ? author.nombre_autor.charAt(0) : 'A'}
                        </div>
                      )}
                      <h5>{author.nombre_autor || 'Nombre'} {author.apellido_autor || 'Apellido'}</h5>
                    </div>
                  </div>

                  <div className="card mt-4">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Información</h5>
                    </div>
                    <div className="card-body">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        Los campos marcados con * son obligatorios.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionBlocker>
  )
}