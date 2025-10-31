import { faStar } from '../utils/faIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Reseña() {
    return (
        <div className="containerResena">
            <h4></h4>
            <div className="libro">

                <div className="card-body d-flex">
                    <img src="https://placehold.co/100" alt="" />
                    <div className='ms-2'>
                        <h5 className="card-title">Título </h5>
                        <p className="card-text">Autor</p>
                    </div>
                </div>
            </div>
            <div className='resena text-center'>
                <div className="mb-3">

                    <label htmlFor="fecha" className='form-label'>Fecha</label>
                    <input type="date" id='fecha' className='form-control' />
                </div>
                <div className="mb-3">
                    <label htmlFor="resena" className="form-label ">Encabezado</label>
                    <input type="text" className="form-control" id="resena" placeholder="" />
                </div>
                <h6>Calificación</h6>
                <span>
                    <FontAwesomeIcon icon={faStar} className='starIcon px-1' />
                    <FontAwesomeIcon icon={faStar} className='starIcon px-1' />
                    <FontAwesomeIcon icon={faStar} className='starIcon px-1' />
                    <FontAwesomeIcon icon={faStar} className='starIcon px-1' />
                    <FontAwesomeIcon icon={faStar} className='starIcon px-1' />
                </span>
                <div className="mb-3">
                    <label htmlFor="textoResena" className="form-label">¿Qué pensaste de este libro?</label>
                    <textarea className="form-control" id="textoResena" rows="5" maxlength="300" placeholder="Máximo 300 carácteres."></textarea>
                </div>
                <button type="submit" className="btn btn-light">Enviar</button>
            </div>
        </div>

    )
}