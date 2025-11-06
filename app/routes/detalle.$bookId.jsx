import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export async function loader({ params }) {
    const { bookId } = params;
    const response = await fetch(`http://127.0.0.1:5000/api/books/${bookId}`);
    if (!response.ok) {
        throw new Response("Libro no encontrado", { status: 404 });
    }
    const book = await response.json();

    // Don't fetch user data in loader - do it client-side
    // because we need the auth context which isn't available during SSR
    return { book };
}

export default function DetalleLibro() {
    const { book } = useLoaderData();
    const navigate = useNavigate();
    const auth = useAuth();

    const [readingState, setReadingState] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);

    // Fetch user's reading state and rating after component mounts
    useEffect(() => {
        const fetchUserBookData = async () => {
            if (!auth?.isAuthenticated || !auth?.user?.token) {
                return;
            }

            setIsLoadingUserData(true);
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/books/${book.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.user.token}`
                        }
                    }
                );

                if (response.ok) {
                    const userData = await response.json();
                    setReadingState(userData.reading_state);
                    setRating(userData.rating || 0);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoadingUserData(false);
            }
        };

        fetchUserBookData();
    }, [auth?.isAuthenticated, auth?.user?.token, book.id]);

    // Helper functions using your auth context
    const isLoggedIn = () => {
        return auth?.isAuthenticated || false;
    };

    const getAuthToken = () => {
        return auth?.user?.token || null;
    };

    const genreSlug = book.genre
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

    const readingStates = [
        { value: 'quiero_leer', label: 'Quiero Leer' },
        { value: 'leyendo', label: 'Leyendo' },
        { value: 'leido', label: 'Leído' }
    ];

    const getReadingStateLabel = () => {
        const state = readingStates.find(s => s.value === readingState);
        return state ? state.label : 'Estado de lectura';
    };

    const handleReadingStateChange = async (newState) => {
        if (!isLoggedIn()) {
            alert('Debes iniciar sesión para cambiar el estado de lectura');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/user/books/${book.id}/reading-state`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: JSON.stringify({ reading_state: newState })
                }
            );

            if (response.ok) {
                setReadingState(newState);
                setShowDropdown(false);

                // If user marked as "leido", navigate to review page
                if (newState === 'leido') {
                    navigate(`/libros/${book.id}/review`);
                }
            } else {
                alert('Error al actualizar el estado de lectura');
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
                `http://127.0.0.1:5000/api/user/books/${book.id}/rating`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getAuthToken()}`
                    },
                    body: JSON.stringify({ rating: newRating })
                }
            );

            if (response.ok) {
                setRating(newRating);
                // Navigate to review page after rating
                navigate(`/libros/${book.id}/review`);
            } else {
                alert('Error al guardar la calificación');
            }
        } catch (error) {
            console.error("Error saving rating:", error);
            alert('Error al guardar la calificación');
        }
    };

    const renderStars = () => {
        return (
            <div className="d-flex align-items-center gap-1 my-3">
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

    return (
        <div className="container my-4">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary mb-3"
            >
                ← Volver
            </button>
            <div className="row">
                <div className="col-md-4 text-center">
                    <img
                        src={book.cover_url || "https://placehold.co/300x450"}
                        alt={book.title}
                        className="img-fluid rounded shadow"
                        style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <div className="d-flex flex-column gap-2 mt-3">
                        {book.amazon_asin && (
                            <a
                                href={`https://www.amazon.com/dp/${book.amazon_asin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-warning"
                            >
                                Comprar este libro
                            </a>
                        )}

                        <Link
                            to={`/generosTodos/${genreSlug}`}
                            className="btn btn-outline-primary"
                        >
                            Ver más libros como este
                        </Link>

                        {/* Star Rating */}
                        {renderStars()}

                        {/* Reading State Dropdown */}
                        <div className="dropdown" style={{ position: 'relative' }}>
                            <button
                                className="btn btn-success dropdown-toggle w-100"
                                type="button"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {getReadingStateLabel()}
                            </button>
                            {showDropdown && (
                                <ul
                                    className="dropdown-menu show w-100"
                                    style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000 }}
                                >
                                    {readingStates.map((state) => (
                                        <li key={state.value}>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => handleReadingStateChange(state.value)}
                                            >
                                                {state.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <h1>{book.title}</h1>
                    <h3 className="text-muted">{book.author}</h3>
                    <span className="badge bg-primary mb-3">{book.genre}</span>

                    {/* Display current rating if exists */}
                    {rating > 0 && (
                        <div className="mb-2">
                            <Link
                                to={`/libros/${book.id}/review`}
                                className="text-decoration-none"
                            >
                                <span style={{ color: '#ffc107' }}>
                                    {'★'.repeat(rating)}
                                </span>
                                <span style={{ color: '#e0e0e0' }}>
                                    {'★'.repeat(5 - rating)}
                                </span>
                                <span className="ms-2 text-primary">Ver/editar reseña</span>
                            </Link>
                        </div>
                    )}

                    <p className="lead mt-3">{book.description}</p>
                </div>
            </div>
        </div>
    );
}