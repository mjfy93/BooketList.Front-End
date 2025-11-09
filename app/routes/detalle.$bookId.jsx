import { useLoaderData, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../utils/api";

export async function loader({ params }) {
    const { bookId } = params;
    const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
    if (!response.ok) {
        throw new Response("Libro no encontrado", { status: 404 });
    }
    const book = await response.json();


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
    // Fetch user's reading state and rating after component mounts
    useEffect(() => {
        const fetchUserBookData = async () => {
            if (!auth?.isAuthenticated || !auth?.user?.token) {
                return;
            }

            setIsLoadingUserData(true);
            try {
                // ✅ FIXED: Fetch complete library to check all states
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

                    // ✅ Check in quiero_leer
                    const inQuieroLeer = library.quiero_leer?.find(
                        item => item.book.id_libros === bookId
                    );

                    // ✅ Check in leyendo
                    const inLeyendo = library.leyendo?.find(
                        item => item.book.id_libros === bookId
                    );

                    // ✅ Check in leido (Rating table)
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

                    console.log('User book state loaded:', {
                        readingState: inQuieroLeer ? 'quiero_leer' : inLeyendo ? 'leyendo' : inLeido ? 'leido' : 'none',
                        rating: inLeido?.calificacion
                    });
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
        { value: 'quiero_leer', label: 'Quiero Leerlo' },
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

        console.log('Changing reading state to:', newState);
        console.log('Current state:', readingState);
        console.log('Book ID:', book.id);

        try {
            // ✅ CASE 1: User wants to mark as "leído"
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
                    console.log('Book marked as read successfully');
                    setReadingState(newState);
                    setShowDropdown(false);
                    navigate(`/libros/${book.id}/resena`);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Error al marcar como leído');
                }
            }
            // ✅ CASE 2: Book already in library - UPDATE state
            else if (readingState && readingState !== 'leido') {
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
                    console.log('Reading state updated successfully');
                    setReadingState(newState);
                    setShowDropdown(false);
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Error al actualizar el estado de lectura');
                }
            }
            // ✅ CASE 3: Book not in library - ADD it
            else {
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
                    console.log('Book added to library successfully');
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

        console.log('Setting rating to:', newRating);
        console.log('Book ID:', book.id);

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
                console.log('Rating saved successfully');
                setRating(newRating);
                // Navigate to review page after rating
                console.log('Navigating to review page');
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
                    {/* ✅ Book cover image */}
                    <img
                        src={book.cover_url || "https://placehold.co/300x450"}
                        alt={book.title}
                        className="img-fluid rounded shadow"
                        style={{ height: '300px', objectFit: 'cover' }}
                    />

                    <div className="d-flex flex-column gap-2 mt-3">
                        {/* ✅ Amazon buy button */}
                        {book.amazon_asin && (
                    <a
                        href = {`https://www.amazon.com/dp/${book.amazon_asin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-warning"
            >
                        Comprar este libro
                    </a>
        )}

                    {/* ✅ Link to genre page */}
                    <Link
                        to={`/generosTodos/${genreSlug}`}
                        className="btn btn-outline-light"
                    >
                        Ver más libros como este
                    </Link>

                    {/* ✅ Star Rating */}
                    {renderStars()}

                    {/* ✅ Reading State Dropdown */}
                    <div className="dropdown mb-3" style={{ position: 'relative' }}>
                        <button
                            className="btn btn-success dropdown-toggle w-100"
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            disabled={isLoadingUserData}
                        >
                            {isLoadingUserData ? 'Cargando...' : getReadingStateLabel()}
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
                                            disabled={isLoadingUserData}
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
                {/* ✅ Backend returns English names, so use them directly */}
                <h1>{book.title}</h1>

                <h3 className="text-muted">{book.author}</h3>

                <span className="badge bg-light text-dark mb-3">{book.genre}</span>

                {/* Display current rating if exists */}
                {rating > 0 && (
                    <div className="mb-2">
                        <Link
                            to={`/libros/${book.id}/resena`}
                            className="text-decoration-none"
                        >
                            <span style={{ color: '#ffc107' }}>
                                {'★'.repeat(rating)}
                            </span>
                            <span style={{ color: '#e0e0e0' }}>
                                {'★'.repeat(5 - rating)}
                            </span>
                            <span className="ms-2 text-light">Ver/editar reseña</span>
                        </Link>
                    </div>
                )}

                <p className="lead mt-3">{book.description}</p>
            </div>
        </div>
        </div >
    );
}