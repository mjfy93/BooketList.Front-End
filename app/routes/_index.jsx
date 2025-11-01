import { useLoaderData, Link, useParams } from "react-router";




export async function loader() {
  const response = await fetch('http://127.0.0.1:5000/api/books')



  return response.json()
}

export default function Home() {
    const data = useLoaderData();

   console.log(data);






  return (
<>  
        <div className="row">
          <div className="welcomeContainer col-8" >
            <h1>BooketList - Encuentra tu próximo libro </h1>
            <p>¡Bienvenidos y Bienvenidas!</p>
            <p>BooketList es el lugar de encuentro para todos los que alguna vez se dijeron a sí mismos: "No sé qué leer".</p>
            <p>Acá, encontrarás un compendio de todos los libros que toda persona amante de la literatura debe leer antes de morir. Tenemos libros para todos los gustos y de todos los géneros, guarda tus favoritos, agrega reseñas y calificaciones y date el per</p>
          </div>

          <div className="loginContainer col-4">
            <form>
              <h2>Iniciar sesión</h2>
              <div className="mb-3">
                <label htmlFor="correoElectrónico" className="form-label">Correo electrónico</label>
                <input type="email" className="form-control" id="correoElectrónico" aria-describedby="emailHelp" />

              </div>
              <div className="mb-3">
                <label htmlFor="contraseña" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="contraseña" />
              </div>

              <button type="submit" className="btn btn-light">Iniciar sesión</button>
              <p>¿No tienes una cuenta? <Link to={'/register'}>Crea una cuenta.</Link></p>
            </form>
          </div>

        </div>
    
//Si ya se inició sesión:


      <div className="homeContainer text-start my-5 px-4">

        <div className="card" >
          <div className="card-body">
            <h5 className="card-title">BooketList</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">¡Bienvenido/a #nombreDeUsuario!</h6>
            <p className="card-text">¡Comienza a explorar! </p>
            <h6>Lecturas actuales:</h6>
            <div className="container text-center">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                <div className="col">
                  <div className="card" >
                    <img src="https://placehold.co/100" className="card-img-top" alt="portada" />
                    <div className="card-body">
                      <h5 className="card-title">Título </h5>
                      <p className="card-text">Autor</p>
                      <a href="/detalle" className="btn btn-light">Más información</a>
                    </div>
                  </div>
                </div>
                <a href="/biblioteca" className="card-link">Mi Biblioteca</a>
                <a href="/libros" className="card-link">Encuentra tu siguiente libro favorito</a>
              </div>
            </div>
          </div>
      </div>
    </div >
      </>


      )
}