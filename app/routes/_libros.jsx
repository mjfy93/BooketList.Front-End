import { useLoaderData, Link, useParams } from "react-router";
import { API_BASE_URL } from "../utils/api";




export async function loader() {
    const response = await fetch(`${API_BASE_URL}/api/books`)



    return response.json()
}



export default function Libros() {
    const data = useLoaderData();

    console.log(data);

    const sortedData = [...data].sort((a, b) =>
        a.titulo_libro.localeCompare(b.titulo_libro)
    );


    return (
        <div className="containerLibros" id="top">
            <h1>Biblioteca</h1>
            <h3>Acá podrás explorar todos los libros en nuestra colección</h3>

            <div className="container text-center" >
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-2">
                    {sortedData.map((item) => (
                        <div className="col" key={item.id_libros}>
                            <div className="card h-100 ">
                                <img src={item.enlace_portada_libro}
                                    className="card-img-top"
                                    alt="portada"
                                    style={{ height: '400px', objectFit: 'contain' }} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{item.titulo_libro} </h5>
                                    <p className="card-text">{item.autor.nombre_autor} {item.autor.apellido_autor}</p>
                                    <Link to={`/detalle/${item.id_libros}`}

                                        className="link-dark link-underline link-underline-opacity-0 btn btn-light mt-auto">
                                        Más información
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <a href="#top" className="text-light">Volver al inicio</a>
        </div>
    )
}