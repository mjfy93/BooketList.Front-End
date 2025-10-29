// routes/admin-new-book.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function AdminNewBook() {
  const navigate = useNavigate()
  
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: 'Ficción',
    description: '',
    isbn: '',
    publishedDate: '',
    status: 'draft',
    coverImage: 'https://th.bing.com/th/id/OIF.Y2rN6VOb3ioE4J1sqv1huw?w=206&h=206&c=7&r=0&o=7&pid=1.7&rm=3',
    amazonLink: ''
  })

  const handleSave = () => {
    if (!book.title || !book.author) {
      alert('Por favor, completa los campos obligatorios (Título y Autor)')
      return
    }
    alert('Libro creado correctamente')
    navigate('/admin/books')
  }

  const handleInputChange = (field, value) => {
    setBook({...book, [field]: value})
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white vh-100 position-fixed">
          <div className="p-3">
            <h4 className="text-center mb-4">BooketList Admin</h4>
            <nav className="nav flex-column">
              <Link to="/admin" className="nav-link text-white mb-2">
                <i className="fas fa-tachometer-alt me-2"></i>Dashboard
              </Link>
              <Link to="/admin/users" className="nav-link text-white mb-2">
                <i className="fas fa-users me-2"></i>Gestión de Usuarios
              </Link>
              <Link to="/admin/books" className="nav-link text-white mb-2 active">
                <i className="fas fa-book me-2"></i>Gestión de Libros
              </Link>
              <Link to="/admin/authors" className="nav-link text-white mb-2">
                <i className="fas fa-pen-fancy me-2"></i>Gestión de Autores
              </Link>
              <Link to="/" className="nav-link text-warning mt-4">
                <i className="fas fa-sign-out-alt me-2"></i>Volver al Sitio
              </Link>
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

            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Información del Libro</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Título *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ingresa el título del libro"
                            value={book.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Autor *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del autor"
                            value={book.author}
                            onChange={(e) => handleInputChange('author', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Género *</label>
                          <select 
                            className="form-select"
                            value={book.genre}
                            onChange={(e) => handleInputChange('genre', e.target.value)}
                          >
                            <option value="Ficción">Ficción</option>
                            <option value="Ciencia Ficción">Ciencia Ficción</option>
                            <option value="Fantasia">Fantasia</option>
                            <option value="Romance">Romance</option>
                            <option value="Misterio">Misterio</option>
                            <option value="Biografía">Biografía</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">ISBN</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ISBN del libro"
                            value={book.isbn}
                            onChange={(e) => handleInputChange('isbn', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Portada del Libro</label>
                        <div className="row">
                          <div className="col-md-4">
                            <img 
                              src={book.coverImage} 
                              alt="Portada del libro"
                              className="img-fluid rounded shadow-sm mb-3"
                              style={{maxHeight: '200px', objectFit: 'cover'}}
                            />
                          </div>
                          <div className="col-md-8">
                            <input
                              type="url"
                              className="form-control"
                              placeholder="URL de la portada..."
                              value={book.coverImage}
                              onChange={(e) => handleInputChange('coverImage', e.target.value)}
                            />
                            <small className="form-text text-muted">
                              Ingresa la URL de la imagen de portada
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Enlace de Amazon</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://www.amazon.com/..."
                          value={book.amazonLink}
                          onChange={(e) => handleInputChange('amazonLink', e.target.value)}
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
                          value={book.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fecha de Publicación</label>
                          <input
                            type="date"
                            className="form-control"
                            value={book.publishedDate}
                            onChange={(e) => handleInputChange('publishedDate', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Estado</label>
                          <select 
                            className="form-select"
                            value={book.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                          >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                            <option value="archived">Archivado</option>
                          </select>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                          <i className="fas fa-plus me-2"></i>Crear Libro
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
                    <img 
                      src={book.coverImage} 
                      alt="Portada del libro"
                      className="img-fluid rounded shadow mb-3"
                      style={{maxHeight: '250px', objectFit: 'cover'}}
                    />
                    <h5>{book.title || 'Título del libro'}</h5>
                    <p className="text-muted">{book.author || 'Nombre del autor'}</p>
                    <span className="badge bg-secondary">{book.genre}</span>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Información</h5>
                  </div>
                  <div className="card-body">
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      Completa todos los campos obligatorios (*) para crear el libro.
                    </div>
                    <div className="mb-3">
                      <strong>Estado:</strong> 
                      <span className={`badge ${book.status === 'published' ? 'bg-success' : book.status === 'draft' ? 'bg-warning' : 'bg-secondary'} ms-2`}>
                        {book.status === 'published' ? 'Publicado' : book.status === 'draft' ? 'Borrador' : 'Archivado'}
                      </span>
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