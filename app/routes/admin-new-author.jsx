// routes/admin-new-author.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

export default function AdminNewAuthor() {
  const navigate = useNavigate()
  
  const [author, setAuthor] = useState({
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthDate: '',
    status: 'active',
    verified: false
  })

  const handleSave = () => {
    if (!author.name || !author.email) {
      alert('Por favor, completa los campos obligatorios (Nombre y Email)')
      return
    }
    alert('Autor creado correctamente')
    navigate('/admin/authors')
  }

  const handleInputChange = (field, value) => {
    setAuthor({...author, [field]: value})
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
              <Link to="/admin/books" className="nav-link text-white mb-2">
                <i className="fas fa-book me-2"></i>Gestión de Libros
              </Link>
              <Link to="/admin/authors" className="nav-link text-white mb-2 active">
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
              <h1>Agregar Nuevo Autor</h1>
              <Link to="/admin/authors" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Autores
              </Link>
            </div>

            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Información del Autor</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nombre Completo *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre completo del autor"
                            value={author.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="email@autor.com"
                            value={author.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nacionalidad</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: Colombiano, Mexicano, Español..."
                            value={author.nationality}
                            onChange={(e) => handleInputChange('nationality', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fecha de Nacimiento</label>
                          <input
                            type="date"
                            className="form-control"
                            value={author.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Biografía</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Biografía del autor..."
                          value={author.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Estado</label>
                          <select 
                            className="form-select"
                            value={author.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                          >
                            <option value="active">Activo</option>
                            <option value="pending">Pendiente</option>
                            <option value="inactive">Inactivo</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Verificación</label>
                          <div className="form-check form-switch mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={author.verified}
                              onChange={(e) => handleInputChange('verified', e.target.checked)}
                            />
                            <label className="form-check-label">
                              Autor verificado
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                          <i className="fas fa-plus me-2"></i>Crear Autor
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
                    <div className="avatar bg-info text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                         style={{width: '100px', height: '100px', fontSize: '2rem'}}>
                      {author.name ? author.name.charAt(0) : 'A'}
                    </div>
                    <h5>{author.name || 'Nombre del autor'}</h5>
                    <p className="text-muted">{author.email || 'email@autor.com'}</p>
                    
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      <span className={`badge ${author.status === 'active' ? 'bg-success' : author.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                        {author.status === 'active' ? 'Activo' : author.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                      </span>
                      <span className={`badge ${author.verified ? 'bg-success' : 'bg-secondary'}`}>
                        {author.verified ? 'Verificado' : 'No Verificado'}
                      </span>
                    </div>

                    {author.nationality && (
                      <p className="mb-2">
                        <strong>Nacionalidad:</strong> {author.nationality}
                      </p>
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
                      Los autores verificados aparecen con un badge especial en la plataforma.
                    </div>
                    <div className="mb-3">
                      <strong>Campos obligatorios:</strong>
                      <ul className="mt-2 mb-0">
                        <li>Nombre completo</li>
                        <li>Email</li>
                      </ul>
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