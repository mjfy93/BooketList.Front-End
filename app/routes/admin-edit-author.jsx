// routes/admin-edit-author.jsx
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router'
import { useAdmin } from '../context/AdminContext.jsx'

export default function AdminEditAuthor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminFetch, isAdminLoggedIn, adminLogout } = useAdmin()
  
  // Redirigir si no está logueado
  if (!isAdminLoggedIn()) {
    return <Navigate to="api/admin/login" replace />
  }

  const [author, setAuthor] = useState({
    nombre_autor: '',
    apellido_autor: '',
    biografia_autor: '',
    imagen_autor: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAuthor()
  }, [id])

  const loadAuthor = async () => {
    try {
      setLoading(true)
      const response = await adminFetch('/admin/authors/list')
      
      if (response.ok) {
        const authorsData = await response.json()
        const currentAuthor = authorsData.find(a => a.id_autor === parseInt(id))
        
        if (currentAuthor) {
          setAuthor({
            nombre_autor: currentAuthor.nombre_autor || '',
            apellido_autor: currentAuthor.apellido_autor || '',
            biografia_autor: currentAuthor.biografia_autor || '',
            imagen_autor: currentAuthor.imagen_autor || ''
          })
        } else {
          setError('Autor no encontrado')
        }
      } else {
        setError('Error al cargar autor')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!author.nombre_autor || !author.apellido_autor) {
      alert('Por favor, completa los campos obligatorios (Nombre y Apellido)')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await adminFetch(`/admin/authors/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_autor: author.nombre_autor,
          apellido_autor: author.apellido_autor,
          biografia_autor: author.biografia_autor
        })
      })

      if (response.ok) {
        const data = await response.json()
        alert('Autor actualizado correctamente')
        navigate('/admin/authors')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al actualizar autor')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setAuthor(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError('')
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      adminLogout()
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
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
              <h1>Editar Autor</h1>
              <div>
                <Link to={`/admin/authors/${id}`} className="btn btn-outline-info me-2">
                  <i className="fas fa-eye me-2"></i>Ver Detalles
                </Link>
                <Link to="/admin/authors" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Volver a Autores
                </Link>
              </div>
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
                        <label className="form-label">Imagen del Autor (URL)</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={author.imagen_autor}
                          onChange={(e) => handleInputChange('imagen_autor', e.target.value)}
                          disabled
                        />
                        <small className="form-text text-muted">
                          La funcionalidad de imágenes estará disponible próximamente.
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Biografía</label>
                        <textarea
                          className="form-control"
                          rows="6"
                          placeholder="Biografía del autor..."
                          value={author.biografia_autor}
                          onChange={(e) => handleInputChange('biografia_autor', e.target.value)}
                        ></textarea>
                        <small className="form-text text-muted">
                          {author.biografia_autor.length}/1000 caracteres
                        </small>
                      </div>

                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>Guardar Cambios
                            </>
                          )}
                        </button>
                        <Link to="/admin/authors" className="btn btn-outline-secondary">
                          Cancelar
                        </Link>
                        <button 
                          type="button" 
                          className="btn btn-outline-danger"
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de que quieres eliminar este autor?')) {
                              alert('Funcionalidad de eliminar en desarrollo')
                            }
                          }}
                        >
                          <i className="fas fa-trash me-2"></i>Eliminar
                        </button>
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
                        style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div 
                      className="avatar bg-info text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                      style={{
                        width: '120px', 
                        height: '120px', 
                        fontSize: '2.5rem',
                        display: author.imagen_autor ? 'none' : 'flex'
                      }}
                    >
                      {author.nombre_autor ? author.nombre_autor.charAt(0) : 'A'}
                    </div>
                    <h4>{author.nombre_autor || 'Nombre'} {author.apellido_autor || 'Apellido'}</h4>
                    <p className="text-muted">Autor</p>
                    
                    {author.biografia_autor && (
                      <div className="mt-3 text-start">
                        <h6>Biografía:</h6>
                        <p className="small text-muted">
                          {author.biografia_autor.length > 150 
                            ? author.biografia_autor.substring(0, 150) + '...' 
                            : author.biografia_autor
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Acciones Rápidas</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <Link 
                        to={`/admin/authors/${id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fas fa-eye me-2"></i>Ver Detalles del Autor
                      </Link>
                      <Link 
                        to="/admin/books"
                        className="btn btn-outline-success btn-sm"
                      >
                        <i className="fas fa-book me-2"></i>Gestionar Libros
                      </Link>
                      <Link 
                        to="/admin/authors/new"
                        className="btn btn-outline-info btn-sm"
                      >
                        <i className="fas fa-plus me-2"></i>Agregar Nuevo Autor
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}