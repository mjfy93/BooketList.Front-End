import { useLoaderData, Link } from "react-router";

export async function loader() {

    const genresResponse = await fetch('http://127.0.0.1:5000/api/books/genres');
    const genresData = await genresResponse.json();


    const genresWithBooks = await Promise.all(
        genresData.genres.map(async (genre) => {

            const genreSlug = genre.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, '-');

            const booksResponse = await fetch(
                `http://127.0.0.1:5000/api/books/genre/${genreSlug}`
            );
            const books = await booksResponse.json();

            return {
                name: genre,
                slug: genreSlug,
                books: books
            };
        })
    );

    return { genres: genresWithBooks };
}

export default function Genero() {
    const { genres } = useLoaderData();

    return (
        <div className="container text-start">
            <h1 className="m-1">Todos los Géneros</h1>
            <h3>Descubre todos los géneros literarios en nuestro catálogo</h3>

            <div>
                {genres.map((genre, index) => (
                    <div className="container my-4" key={index}>
                        <h2>{genre.name}</h2>
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
                                            <h5 className="text-truncate" style={{ maxWidth: '150px' }}>
                                                {book.title}
                                            </h5>
                                            <h6 className="text-wrap">{book.author}</h6>
                                            <Link
                                                to={`/detalle/${book.id}`}
                                                className="btn btn-light btn-sm"
                                            >
                                                Más información
                                            </Link>
                                        </div>
                                    ))}

                                    <div className="d-flex align-items-center justify-content-center">
                                        <Link
                                            to={`/generosTodos/${genre.slug}`}
                                            className="btn btn-light"
                                        >
                                            Más {genre.name}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}