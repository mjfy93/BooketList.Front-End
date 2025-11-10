import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../utils/api";

export async function loader({ params }) {
    const { bookId } = params;
    
    try {
        // Obtener información del libro
        const bookResponse = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
        if (!bookResponse.ok) {
            throw new Response("Libro no encontrado", { status: 404 });
        }
        const book = await bookResponse.json();

        // Obtener reseñas del libro
        const reviewsResponse = await fetch(`${API_BASE_URL}/api/books/${bookId}/reviews`);
        let reviews = [];
        if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            reviews = Array.isArray(reviewsData) ? reviewsData : [];
        }

        // Obtener estadísticas de reseñas
        const statsResponse = await fetch(`${API_BASE_URL}/api/books/${bookId}/reviews/stats`);
        let reviewsStats = { total_reviews: 0, average_rating: 0 };
        if (statsResponse.ok) {
            reviewsStats = await statsResponse.json();
        }

        return { book, reviews, reviewsStats };
    } catch (error) {
        throw new Response("Error al cargar el libro", { status: 500 });
    }
}

export default function DetalleLibro() {
    const { book, reviews, reviewsStats } = useLoaderData();
    const navigate = useNavigate();
    const auth = useAuth();

    const [readingState, setReadingState] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);

    // Fetch user's reading state and rating
    useEffect(() => {
        const fetchUserBookData = async () => {
            if (!auth?.isAuthenticated || !auth?.user?.token) {
                return;
            }

            setIsLoadingUserData(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/my-library`,
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.user.token}`
                        }
                    }
                );

                if (response.ok) {
                    const library = await response.json();
                    const bookId = parseInt(book.id);

                    // Check in quiero_leer
                    const inQuieroLeer = library.quiero_leer?.find(
                        item => item.book.id_libros === bookId
                    );

                    // Check in leyendo
                    const inLeyendo = library.leyendo?.find(
                        item => item.book.id_libros === bookId
                    );

                    // Check in leido (Rating table)
                    const inLeido = library.leido?.find(
                        item => item.book.id_libros === bookId
                    );

                    // Set state based on where book was found
                    if (inQuieroLeer) {
                        setReadingState('quiero_leer');
                        setRating(0);
                    } else if (inLeyendo) {
                        setReadingState('leyendo');
                        setRating(0);
                    } else if (inLeido) {
                        setReadingState('leido');
                        setRating(inLeido.calificacion || 0);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoadingUserData(false);
            }
        };

        fetchUserBookData();
    }, [auth?.isAuthenticated, auth?.user?.token, book.id]);

    // ✅ FUNCIÓN PARA ELIMINAR LIBRO DESDE DETALLE
    const handleRemoveBookFromDetail = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este libro de tu biblioteca? Esta acción también eliminará cualquier reseña asociada.')) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/my-library/books/${book.id}/complete-remove`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${auth?.user?.token}`
                    }
                }
            );

            if (response.ok) {
                setReadingState(null);
                setRating(0);
                alert('Libro eliminado de tu biblioteca exitosamente');
                navigate('/biblioteca');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error al eliminar el libro');
            }
        } catch (error) {
            console.error("Error removing book:", error);
            alert('Error al eliminar el libro');
        }
    };

    // Helper functions
    const isLoggedIn = () => {
        return auth?.isAuthenticated || false;
    };

    const getAuthToken = () => {
        return auth?.user?.token || null;
    };

    const genreSlug = book.genre
        ?.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-') || 'genero';

    const readingStates = [
        { value: 'quiero_leer', label: 'Quiero Leerlo', icon: 'heart' },
        { value: 'leyendo', label: 'Leyendo', icon: 'book-open' },
        { value: 'leido', label: 'Leído', icon: 'check-circle' }
    ];

    const getReadingStateLabel = () => {
        const state = readingStates.find(s => s.value === readingState);
        return state ? state.label : 'Agregar a mi biblioteca';
    };

    const handleReadingStateChange = async (newState) => {
        if (!isLoggedIn()) {
            alert('Debes iniciar sesión para cambiar el estado de lectura');
            navigate('/login');
            return;
        }

        try {
            if (newState === 'leido') {
                const response = await fetch(
                    `${API_BASE_URL}/api/my-library/books/${book.id}/mark-read`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getAuthToken()}`
                        },
                        body: JSON.stringify({
                            calificacion: rating || null
                        })
                    }
                );

                if (response.ok) {
                    setReadingState(newState);
                    setShowDropdown(false);
                    navigate(`/libros/${book.id}/resena`);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Error al marcar como leído');
                }
            } else if (readingState && readingState !== 'leido') {
                const response = await fetch(
                    `${API_BASE_URL}/api/my-library/books/${book.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getAuthToken()}`
                        },
                        body: JSON.stringify({
                            estado_lectura: newState
                        })
                    }
                );

                if (response.ok) {
                    setReadingState(newState);
                    setShowDropdown(false);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Error al actualizar el estado de lectura');
                }
            } else {
                const response = await fetch(
                    `${API_BASE_URL}/api/my-library/books`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getAuthToken()}`
                        },
                        body: JSON.stringify({
                            id_libro: parseInt(book.id),
                            estado_lectura: newState
                        })
                    }
                );

                if (response.ok) {
                    setReadingState(newState);
                    setShowDropdown(false);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Error al agregar libro a la biblioteca');
                }
            }
        } catch (error) {
            console.error("Error updating reading state:", error);
            alert('Error al actualizar el estado de lectura');
        }
    };

    const handleRatingClick = async (newRating) => {
        if (!isLoggedIn()) {
            alert('Debes iniciar sesión para calificar este libro');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/my-library/books/${book.id}/mark-read`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: JSON.stringify({
                        calificacion: newRating
                    })
                }
            );

            if (response.ok) {
                setRating(newRating);
                navigate(`/libros/${book.id}/resena`);
            } else {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    alert(errorData.message || 'Error al guardar la calificación');
                } catch (e) {
                    alert('Error al guardar la calificación');
                }
            }
        } catch (error) {
            console.error("Error saving rating:", error);
            alert('Error al guardar la calificación');
        }
    };

    const renderStars = () => {
        return (
            <div className="d-flex align-items-center justify-content-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className="btn btn-link p-0 border-0"
                        style={{ fontSize: '24px', textDecoration: 'none' }}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => handleRatingClick(star)}
                    >
                        <span style={{
                            color: (hoveredStar >= star || rating >= star) ? '#ffc107' : '#e0e0e0'
                        }}>
                            ★
                        </span>
                    </button>
                ))}
                {rating > 0 && (
                    <span className="ms-2 text-muted">({rating}/5)</span>
                )}
            </div>
        );
    };

    // ✅ FUNCIONES PARA RESEÑAS ACTUALIZADAS
    const renderReviewStats = () => {
        if (reviewsStats.total_reviews === 0) return null;

        return (
            <div className="card bg-dark border-light mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        <i className="fas fa-star me-2 text-warning"></i>
                        Reseñas del Libro
                    </h5>
                    
                    <div className="row text-center">
                        <div className="col-6 mb-3">
                            <div className="h4 text-primary mb-1">{reviewsStats.total_reviews}</div>
                            <small className="text-muted">Total Reseñas</small>
                        </div>
                        <div className="col-6 mb-3">
                            <div className="h4 text-warning mb-1">{reviewsStats.average_rating.toFixed(1)}</div>
                            <small className="text-muted">Calificación Promedio</small>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderReviews = () => {
        if (!reviews || reviews.length === 0) {
            return (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-comment-slash fa-3x"></i>
                    </div>
                    <h5 className="text-muted mb-2">Este libro aún no tiene reseñas</h5>
                    <p className="text-muted mb-4">
                        ¡Sé el primero en compartir tu opinión!
                    </p>
                    {isLoggedIn() && (
                        <Link 
                            to={`/libros/${book.id}/resena`}
                            className="btn btn-primary"
                        >
                            <i className="fas fa-edit me-2"></i>
                            Escribir Primera Reseña
                        </Link>
                    )}
                </div>
            );
        }

        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">
                        <i className="fas fa-comments me-2"></i>
                        Reseñas de Lectores
                    </h4>
                    <span className="badge bg-primary fs-6">{reviews.length}</span>
                </div>

                <div className="row">
                    {reviews.map((review) => (
                        <div key={review.id_calificacion} className="col-12 mb-3">
                            <div className="card h-100 bg-dark border-light">
                                <div className="card-body">
                                    {/* Header de la reseña */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="flex-grow-1">
                                            <h6 className="card-title mb-2 text-primary">
                                                <i className="fas fa-user me-2"></i>
                                                {review.usuario_nombre_completo}
                                            </h6>
                                            {review.calificacion && (
                                                <div className="text-warning">
                                                    {'★'.repeat(review.calificacion)}
                                                    {'☆'.repeat(5 - review.calificacion)}
                                                    <span className="text-muted ms-2">
                                                        ({review.calificacion}/5)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <small className="text-muted text-nowrap">
                                            <i className="fas fa-calendar me-1"></i>
                                            {review.created_at ? 
                                                new Date(review.created_at).toLocaleDateString('es-ES') 
                                                : 'Fecha no disponible'
                                            }
                                        </small>
                                    </div>
                                    
                                    {/* Contenido de la reseña */}
                                    {review.resena ? (
                                        <div>
                                            <p 
                                                className="card-text"
                                                style={{ lineHeight: '1.6' }}
                                            >
                                                {review.resena}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="card-text text-muted fst-italic mb-0">
                                            <i className="fas fa-star me-2 text-warning"></i>
                                            Este usuario calificó el libro pero no escribió una reseña.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container ">
            {/* Botón volver */}
            <nav aria-label="breadcrumb" className="mb-1">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate(-1)}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Volver
                        </button>
                    </li>
                    <li className="breadcrumb-item active text-light" aria-current="page">
                        Detalle del Libro
                    </li>
                </ol>
            </nav>

            <div className="row">
                {/* Columna izquierda - Portada y acciones */}
                <div className="col-lg-4 col-md-5 mb-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        {/* Portada del libro */}
                        <div className="text-center mb-4">
                            <img
                                src={book.cover_url || "https://placehold.co/300x450"}
                                alt={book.title}
                                className="img-fluid rounded shadow"
                                style={{ 
                                    height: '350px', 
                                    objectFit: 'contain',
                                    width: '100%',
                                    maxWidth: '280px'
                                }}
                            />
                        </div>

                        {/* Acciones del libro */}
                        <div className="d-flex flex-column gap-3">
                            {/* Botón Amazon */}
                            {book.amazon_asin && (
                                <a
                                    href={`https://www.amazon.com/dp/${book.amazon_asin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-warning btn-lg"
                                >
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    Comprar en Amazon
                                </a>
                            )}

                            {/* Botón género */}
                            <Link
                                to={`/generosTodos/${genreSlug}`}
                                className="btn btn-outline-light btn-lg"
                            >
                                <i className="fas fa-tags me-2"></i>
                                Más libros de {book.genre}
                            </Link>

                            {/* Calificación con estrellas */}
                            <div className="card bg-dark border-light p-1">
                                <div className="card-body text-center">
                                    <h6 className="card-title text-muted mb-1">Calificar este libro</h6>
                                    {renderStars()}
                                </div>
                            </div>

                            {/* Dropdown para estado de lectura */}
                            <div className="dropdown mb-3">
                                <button
                                    className="btn btn-success btn-lg dropdown-toggle w-100"
                                    type="button"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    disabled={isLoadingUserData}
                                >
                                    {isLoadingUserData ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Cargando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-bookmark me-2"></i>
                                            {getReadingStateLabel()}
                                        </>
                                    )}
                                </button>
                                {showDropdown && (
                                    <ul className="dropdown-menu show w-100" style={{ position: 'absolute' }}>
                                        {readingStates.map((state) => (
                                            <li key={state.value}>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleReadingStateChange(state.value)}
                                                    disabled={isLoadingUserData}
                                                >
                                                    <i className={`fas fa-${state.icon} me-2`}></i>
                                                    {state.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* ✅ BOTÓN PARA ELIMINAR LIBRO */}
                            {readingState && (
                                <button 
                                    className="btn btn-outline-danger btn-lg"
                                    onClick={handleRemoveBookFromDetail}
                                    title="Eliminar libro y reseña de mi biblioteca"
                                >
                                    <i className="fas fa-trash me-2"></i>
                                    Eliminar de mi biblioteca
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna derecha - Información y reseñas */}
                <div className="col-lg-8 col-md-7">
                    {/* Información del libro */}
                    <div className="card bg-dark border-light mb-4">
                        <div className="card-body">
                            <h1 className="card-title display-6 fw-bold mb-2">{book.title}</h1>
                            <h2 className="card-subtitle h4 text-muted mb-3">{book.author}</h2>
                            
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge bg-light text-dark fs-6">{book.genre}</span>
                                {book.publication_date && (
                                    <span className="badge bg-secondary fs-6">
                                        <i className="fas fa-calendar me-1"></i>
                                        {new Date(book.publication_date).getFullYear()}
                                    </span>
                                )}
                            </div>

                            {/* Rating personal si existe */}
                            {rating > 0 && (
                                <div className="alert alert-warning mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="text-warning me-2 fs-5">
                                            {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                                        </div>
                                        <span className="me-3 fw-bold">Tu calificación: {rating}/5</span>
                                        <Link
                                            to={`/libros/${book.id}/resena`}
                                            className="btn btn-outline-primary btn-sm ms-auto"
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Ver/editar reseña
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="mt-4">
                                <h4 className="mb-3">
                                    <i className="fas fa-book-open me-2"></i>
                                    Sinopsis
                                </h4>
                                <p className="card-text lead" style={{ lineHeight: '1.8' }}>
                                    {book.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de reseñas */}
                    <div className="reviews-section">
                        {renderReviewStats()}
                        {renderReviews()}
                    </div>
                </div>
            </div>
        </div>
    );
}