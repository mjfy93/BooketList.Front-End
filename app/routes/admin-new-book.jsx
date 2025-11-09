// routes/admin-new-book.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SessionBlocker from '../components/SessionBlocker'

export default function AdminNewBook() {
  const navigate = useNavigate()
  const { adminFetch, isAdminLoggedIn, adminLogout, loading: authLoading, isInitialized } = useAuth()
  const [book, setBook] = useState({
    titulo_libro: '',
    id_autor: '',
    genero_libro: 'Ficción',
    descripcion_libros: '',
    enlace_portada_libro: '',
    enlace_asin_libro: ''
  })
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      loadAuthors()
    }
  }, [isAdminLoggedIn])

  if (authLoading || !isInitialized) {
    return <LoadingSpinner />
  }

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const loadAuthors = async () => {
    try {
      const response = await adminFetch('/admin/authors/list')
      if (response.ok) {
        const data = await response.json()
        setAuthors(data)
      }
    } catch (error) {
      console.error('Error loading authors:', error)
    }
  }

  const handleSave = async () => {
    if (!book.titulo_libro || !book.id_autor || !book.genero_libro) {
      alert('Por favor, completa los campos obligatorios (Título, Autor y Género)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await adminFetch('/admin/books/create', {
        method: 'POST',
        body: JSON.stringify(book)
      })

      if (response.ok) {
        const data = await response.json()
        alert('Libro creado correctamente')
        navigate('/admin/books')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al crear libro')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setBook({...book, [field]: value})
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
                <h1>Agregar Nuevo Libro</h1>
                <Link to="/admin/books" className="btn btn-outline-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Volver a Libros
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
                      <h5 className="card-title mb-0">Información del Libro</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Título *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingresa el título del libro"
                              value={book.titulo_libro}
                              onChange={(e) => handleInputChange('titulo_libro', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Autor *</label>
                            <select
                              className="form-select"
                              value={book.id_autor}
                              onChange={(e) => handleInputChange('id_autor', e.target.value)}
                              required
                            >
                              <option value="">Seleccionar autor</option>
                              {authors.map(author => (
                                <option key={author.id_autor} value={author.id_autor}>
                                  {author.nombre_autor} {author.apellido_autor}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Género *</label>
                            <select 
                              className="form-select"
                              value={book.genero_libro}
                              onChange={(e) => handleInputChange('genero_libro', e.target.value)}
                              required
                            >
                              <option value="Ficción">Ficción</option>
                              <option value="Ciencia Ficción">Ciencia Ficción</option>
                              <option value="Fantasia">Fantasia</option>
                              <option value="Romance">Romance</option>
                              <option value="Misterio">Misterio</option>
                              <option value="Biografía">Biografía</option>
                              <option value="Historia">Historia</option>
                              <option value="Autoayuda">Autoayuda</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Portada del Libro (URL)</label>
                          <input
                            type="url"
                            className="form-control"
                            placeholder="https://ejemplo.com/portada.jpg"
                            value={book.enlace_portada_libro}
                            onChange={(e) => handleInputChange('enlace_portada_libro', e.target.value)}
                          />
                          <small className="form-text text-muted">
                            Ingresa la URL de la imagen de portada
                          </small>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Enlace de Amazon</label>
                          <input
                            type="url"
                            className="form-control"
                            placeholder="https://www.amazon.com/..."
                            value={book.enlace_asin_libro}
                            onChange={(e) => handleInputChange('enlace_asin_libro', e.target.value)}
                          />
                          <small className="form-text text-muted">
                            Enlace directo para comprar el libro en Amazon
                          </small>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Descripción</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Descripción del libro..."
                            value={book.descripcion_libros}
                            onChange={(e) => handleInputChange('descripcion_libros', e.target.value)}
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
                                <i className="fas fa-plus me-2"></i>Crear Libro
                              </>
                            )}
                          </button>
                          <Link to="/admin/books" className="btn btn-outline-secondary">
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
                      {book.enlace_portada_libro ? (
                        <img 
                          src={book.enlace_portada_libro} 
                          alt="Vista previa de portada"
                          className="rounded mb-3"
                          style={{width: '150px', height: '200px', objectFit: 'cover'}}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center mb-3" 
                             style={{width: '150px', height: '200px', margin: '0 auto'}}>
                          <i className="fas fa-book fa-3x text-muted"></i>
                        </div>
                      )}
                      <h5>{book.titulo_libro || 'Título del libro'}</h5>
                      <p className="text-muted">
                        {authors.find(a => a.id_autor === book.id_autor)?.nombre_autor || 'Autor'} {authors.find(a => a.id_autor === book.id_autor)?.apellido_autor || ''}
                      </p>
                      {book.genero_libro && (
                        <span className="badge bg-secondary">{book.genero_libro}</span>
                      )}
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