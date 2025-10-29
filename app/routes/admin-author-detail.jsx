// routes/admin-author-detail.jsx
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'

export default function AdminAuthorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [author, setAuthor] = useState({
    id: parseInt(id),
    name: 'Gabriel García Márquez',
    email: 'gabriel@autor.com',
    bio: 'Escritor, guionista, editor y periodista colombiano. En 1982 recibió el Premio Nobel de Literatura.',
    nationality: 'Colombiano',
    birthDate: '1927-03-06',
    status: 'active',
    verified: true,
    booksCount: 24,
    joinDate: '2023-05-15'
  })

  const [books] = useState([
    { id: 1, title: 'Cien años de soledad', year: 1967, reviews: 156, rating: 4.8 },
    { id: 2, title: 'El amor en los tiempos del cólera', year: 1985, reviews: 89, rating: 4.6 },
    { id: 3, title: 'Crónica de una muerte anunciada', year: 1981, reviews: 67, rating: 4.4 }
  ])

  const handleVerification = () => {
    setAuthor({...author, verified: !author.verified})
    alert(`Autor ${!author.verified ? 'verificado' : 'desverificado'} correctamente`)
  }

  const handleSave = () => {
    alert('Información del autor actualizada')
    navigate('/admin/authors')
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
              <h1>Detalle del Autor</h1>
              <Link to="/admin/authors" className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>Volver a Autores
              </Link>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="avatar bg-info text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" 
                         style={{width: '100px', height: '100px', fontSize: '2rem'}}>
                      {author.name.charAt(0)}
                    </div>
                    <h4>{author.name}</h4>
                    <p className="text-muted">{author.email}</p>
                    
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      <span className={`badge ${author.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                        {author.status === 'active' ? 'Activo' : 'Pendiente'}
                      </span>
                      <span className={`badge ${author.verified ? 'bg-success' : 'bg-secondary'}`}>
                        {author.verified ? 'Verificado' : 'No Verificado'}
                      </span>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        className={`btn ${author.verified ? 'btn-warning' : 'btn-success'}`}
                        onClick={handleVerification}
                      >
                        <i className={`fas ${author.verified ? 'fa-times' : 'fa-check'} me-2`}></i>
                        {author.verified ? 'Quitar Verificación' : 'Verificar Autor'}
                      </button>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-envelope me-2"></i>Contactar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Estadísticas</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Total de Libros:</strong> {author.booksCount}
                    </div>
                    <div className="mb-3">
                      <strong>Reseñas Totales:</strong> 1,245
                    </div>
                    <div className="mb-3">
                      <strong>Calificación Promedio:</strong> 4.6/5
                    </div>
                    <div className="mb-3">
                      <strong>Miembro desde:</strong> {author.joinDate}
                    </div>
                  </div>
                </div>
              </div>

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
                            value={author.name}
                            onChange={(e) => setAuthor({...author, name: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            value={author.email}
                            onChange={(e) => setAuthor({...author, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Nacionalidad</label>
                          <input
                            type="text"
                            className="form-control"
                            value={author.nationality}
                            onChange={(e) => setAuthor({...author, nationality: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Fecha de Nacimiento</label>
                          <input
                            type="date"
                            className="form-control"
                            value={author.birthDate}
                            onChange={(e) => setAuthor({...author, birthDate: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Biografía</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={author.bio}
                          onChange={(e) => setAuthor({...author, bio: e.target.value})}
                        ></textarea>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                          <i className="fas fa-save me-2"></i>Guardar Cambios
                        </button>
                        <Link to="/admin/authors" className="btn btn-outline-secondary">
                          Cancelar
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Libros del Autor</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Título</th>
                            <th>Año</th>
                            <th>Reseñas</th>
                            <th>Calificación</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {books.map(book => (
                            <tr key={book.id}>
                              <td>
                                <strong>{book.title}</strong>
                              </td>
                              <td>{book.year}</td>
                              <td>{book.reviews}</td>
                              <td>
                                <span className="badge bg-success">{book.rating}/5</span>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Link 
                                    to={`/admin/books/edit/${book.id}`}
                                    className="btn btn-sm btn-outline-primary"
                                    title="Editar libro"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </Link>
                                  <button className="btn btn-sm btn-outline-info" title="Ver reseñas">
                                    <i className="fas fa-comments"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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