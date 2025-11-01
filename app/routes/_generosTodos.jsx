import { index } from "@react-router/dev/routes";
import { useLoaderData, Link, useParams, data } from "react-router";




export async function loader() {
    const response = await fetch(`http://127.0.0.1:5000/api/books/genres`)



    return response.json()
}

export async function librosPorGenero(index) {
    const genero = loader(index)

    const responseLibros = await fetch(`http://127.0.0.1:5000/api/books/genres/${genero}`)
    

    return responseLibros.json()
    
    
}

export default function Genero() {
    const data = useLoaderData();

    const genresInfo = Object.entries(data.genres)
    
    
    

    return (
        <div className="container text-start">

                    <h1 className="m-1">Todos los Géneros</h1>
                    <h3>Descubre todos los géneros literarios en nuestro catalogo</h3>
                    <div>
                    {genresInfo.map((item) => (
                        <div className="container">
                            <h2>{item[1]}</h2>
                            <div className="bookstand">
                                <div className="overflow-auto h-25">
                                    <div className="d-flex flex-nowrap gap-4 pb-3">
                                        <div className="flex-shrink-1" >
                                            <img src="https://placehold.co/150" className="img-fluid img-thumbnail" alt="Book" />
                                            <h5>Titulo</h5>
                                            <h6 className="text-wrap">Autor</h6>
                                            <a href="/detalle" type="button" className="btn btn-light">Más información</a>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">

                                            <a href="/genero" type="button" className="btn btn-light ">Más libros de #este género </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

            )
}