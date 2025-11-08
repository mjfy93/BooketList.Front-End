import { useLoaderData, Link } from "react-router";
import { API_BASE_URL } from "../utils/api";

export async function loader() {
    const genresResponse = await fetch(`${API_BASE_URL}/api/books/genres`);  // Fixed: added ()
    const genresData = await genresResponse.json();

    const genresWithBooks = await Promise.all(
        genresData.genres.map(async (genre) => {
            const genreSlug = genre.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, '-');
            const booksResponse = await fetch(
                `${API_BASE_URL}/api/books/genre/${genreSlug}`
            );
            const books = await booksResponse.json();
            return {
                name: genre,
                slug: genreSlug,
                books: books.slice(0, 6)
            };
        })
    );

    return { genres: genresWithBooks };
}

export default function Genero() {
    const { genres } = useLoaderData();

    // Sort genres alphabetically by name
    const sortedGenres = [...genres].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const sortedGenresWithBooks = sortedGenres.map(genre => ({
        ...genre,
        books: [...genre.books].sort((a, b) =>
            a.title.localeCompare(b.title)
        )
    }));
    return (
        <div className="container text-start" id="top">
            <h1 className="m-1">Todos los Géneros</h1>
            <h3>Descubre todos los géneros literarios en nuestro catálogo</h3>
            <div>
                {sortedGenresWithBooks.map((genre, index) => (  // Changed to sortedGenres
                    <div className="container my-4" key={index} style={{ width: '1000px' }}>
                        <Link to={`/generosTodos/${genre.slug}`} style={{ color: "white", textDecoration: "none" }}>
                            <h2>{genre.name}</h2>
                        </Link>
                        <div className="bookstand">
                            <div className="overflow-auto h-25">
                                <div className="d-flex flex-nowrap gap-4 pb-3">
                                    {genre.books.map((book) => (
                                        <div className="flex-shrink-0" key={book.id}>
                                            <img
                                                src={book.cover_url || "https://placehold.co/150"}
                                                className="img-fluid img-thumbnail"
                                                alt={book.title}
                                                style={{ width: '150px', height: '200px', objectFit: 'cover' }}
                                            />
                                            <h5 className="text-truncate" style={{ maxWidth: '200px' }}>
                                                {book.title}
                                            </h5>
                                            <h6 className="text-truncate" style={{ maxWidth: '200px' }}>{book.author}</h6>
                                            <Link
                                                to={`/detalle/${book.id}`}  // Fixed: added {}
                                                className="btn btn-light btn-sm"
                                            >
                                                Más información
                                            </Link>
                                        </div>
                                    ))}
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Link
                                            to={`/generosTodos/${genre.slug}`}  // Fixed: added {}
                                            className="btn btn-light"
                                        >
                                            Más {genre.name}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href="#top" className="text-light">Volver al inicio</a>
                    </div>
                ))}
            </div>
        </div>
    );
}