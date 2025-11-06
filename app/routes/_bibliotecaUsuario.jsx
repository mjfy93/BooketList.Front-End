import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function BibliotecaUsuario() {
    const navigate = useNavigate();
    const auth = useAuth();

    const [libraryData, setLibraryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLibrary = async () => {
            if (!auth.isAuthenticated || !auth.user?.token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/api/my-library', {
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar la biblioteca');
                }

                const data = await response.json();
                setLibraryData(data);
            } catch (err) {
                console.error('Error fetching library:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [auth.isAuthenticated, auth.user?.token, navigate]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando biblioteca...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Separate books by reading state
    const allBooks = libraryData?.books || [];
    const readingBooks = allBooks.filter(item => item.reading_state === 'leyendo');
    const readBooks = allBooks.filter(item => item.reading_state === 'leido');
    const toReadBooks = allBooks.filter(item => item.reading_state === 'quiero_leer');

    // Get unique authors
    const authors = [...new Set(allBooks.map(item => item.book.autor))].sort();

    return (
        <div className="bibliotecaUsuarioContainer">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="librosTodos-tab" data-bs-toggle="tab"
                        data-bs-target="#todosLibros-pane" type="button" role="tab"
                        aria-controls="todosLibros-pane" aria-selected="true">
                        Biblioteca ({allBooks.length})
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="autores-tab" data-bs-toggle="tab"
                        data-bs-target="#autores-pane" type="button" role="tab"
                        aria-controls="autores-pane" aria-selected="false">
                        Autores ({authors.length})
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="leyendo-tab" data-bs-toggle="tab"
                        data-bs-target="#leyendo-pane" type="button" role="tab"
                        aria-controls="leyendo-pane" aria-selected="false">
                        Leyendo ({readingBooks.length})
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="leido-tab" data-bs-toggle="tab"
                        data-bs-target="#leido-pane" type="button" role="tab"
                        aria-controls="leido-pane" aria-selected="false">
                        Leídos ({readBooks.length})
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="porLeer-tab" data-bs-toggle="tab"
                        data-bs-target="#porLeer-pane" type="button" role="tab"
                        aria-controls="porLeer-pane" aria-selected="false">
                        Por Leer ({toReadBooks.length})
                    </button>
                </li>
            </ul>

            <div className="tab-content p-4" id="myTabContent">
                {/* Todos los Libros */}
                <div className="tab-pane fade show active" id="todosLibros-pane" role="tabpanel"
                    aria-labelledby="librosTodos-tab">
                    {allBooks.length > 0 ? (
                        <div className="row">
                            {allBooks.map(item => (
                                <div key={item.library_id} className="col-md-3 mb-4">
                                    <div className="card h-100">
                                        <img src={item.book.enlace_portada_libro || 'https://placehold.co/300x450'}
                                            className="card-img-top" alt={item.book.titulo_libro}
                                            style={{ height: '300px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h6 className="card-title">{item.book.titulo_libro}</h6>
                                            <p className="card-text text-muted small">{item.book.autor}</p>
                                            <span className={`badge ${item.reading_state === 'leido' ? 'bg-success' :
                                                    item.reading_state === 'leyendo' ? 'bg-warning' : 'bg-info'
                                                }`}>
                                                {item.reading_state === 'leido' ? 'Leído' :
                                                    item.reading_state === 'leyendo' ? 'Leyendo' : 'Por Leer'}
                                            </span>
                                        </div>
                                        <div className="card-footer">
                                            <Link to={`/libros/${item.book.id_libros}`}
                                                className="btn btn-sm btn-primary w-100">
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No tienes libros en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
                    )}
                </div>

                {/* Autores */}
                <div className="tab-pane fade" id="autores-pane" role="tabpanel"
                    aria-labelledby="autores-tab">
                    {authors.length > 0 ? (
                        <div className="list-group">
                            {authors.map(author => {
                                const authorBooks = allBooks.filter(item => item.book.autor === author);
                                return (
                                    <div key={author} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-1">{author}</h5>
                                            <span className="badge bg-primary rounded-pill">
                                                {authorBooks.length} libro{authorBooks.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="row mt-2">
                                            {authorBooks.map(item => (
                                                <div key={item.library_id} className="col-md-2 mb-2">
                                                    <Link to={`/libros/${item.book.id_libros}`}>
                                                        <img src={item.book.enlace_portada_libro}
                                                            className="img-fluid rounded"
                                                            alt={item.book.titulo_libro}
                                                            title={item.book.titulo_libro} />
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No tienes autores en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
                    )}
                </div>

                {/* Leyendo */}
                <div className="tab-pane fade" id="leyendo-pane" role="tabpanel"
                    aria-labelledby="leyendo-tab">
                    {readingBooks.length > 0 ? (
                        <div className="row">
                            {readingBooks.map(item => (
                                <div key={item.library_id} className="col-md-3 mb-4">
                                    <div className="card h-100">
                                        <img src={item.book.enlace_portada_libro}
                                            className="card-img-top" alt={item.book.titulo_libro}
                                            style={{ height: '300px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h6 className="card-title">{item.book.titulo_libro}</h6>
                                            <p className="card-text text-muted small">{item.book.autor}</p>
                                        </div>
                                        <div className="card-footer">
                                            <Link to={`/libros/${item.book.id_libros}`}
                                                className="btn btn-sm btn-primary w-100">
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No estás leyendo ningún libro en este momento. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
                    )}
                </div>

                {/* Leídos */}
                <div className="tab-pane fade" id="leido-pane" role="tabpanel"
                    aria-labelledby="leido-tab">
                    {readBooks.length > 0 ? (
                        <div className="row">
                            {readBooks.map(item => (
                                <div key={item.library_id} className="col-md-3 mb-4">
                                    <div className="card h-100">
                                        <img src={item.book.enlace_portada_libro}
                                            className="card-img-top" alt={item.book.titulo_libro}
                                            style={{ height: '300px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h6 className="card-title">{item.book.titulo_libro}</h6>
                                            <p className="card-text text-muted small">{item.book.autor}</p>
                                        </div>
                                        <div className="card-footer">
                                            <Link to={`/libros/${item.book.id_libros}`}
                                                className="btn btn-sm btn-primary w-100">
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No tienes libros leídos en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
                    )}
                </div>

                {/* Por Leer */}
                <div className="tab-pane fade" id="porLeer-pane" role="tabpanel"
                    aria-labelledby="porLeer-tab">
                    {toReadBooks.length > 0 ? (
                        <div className="row">
                            {toReadBooks.map(item => (
                                <div key={item.library_id} className="col-md-3 mb-4">
                                    <div className="card h-100">
                                        <img src={item.book.enlace_portada_libro}
                                            className="card-img-top" alt={item.book.titulo_libro}
                                            style={{ height: '300px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h6 className="card-title">{item.book.titulo_libro}</h6>
                                            <p className="card-text text-muted small">{item.book.autor}</p>
                                        </div>
                                        <div className="card-footer">
                                            <Link to={`/libros/${item.book.id_libros}`}
                                                className="btn btn-sm btn-primary w-100">
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No tienes libros por leer en tu biblioteca. ¡Agrega un libro! <Link to='/libros'>Explora nuestra biblioteca</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
}