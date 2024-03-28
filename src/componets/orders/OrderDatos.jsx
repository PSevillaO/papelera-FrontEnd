// Estos son los datos del cliente en las Ordenes
import PropTypes from 'prop-types';


export default function OrderDatos({ selectedCustomer }) {
    return (
        <div className='customes-data'>
            <div className='d-flex'>
                <h4>Cliente:</h4>
                <h4 className='px-2'>{selectedCustomer ? selectedCustomer.nombre : 'Nombre'}</h4>
            </div>
            <div className='d-flex'>
                <h5>Dirección:</h5>
                <h5 className='px-2'>{selectedCustomer ? selectedCustomer.direccion : 'Direccion'}</h5>
            </div>
            <div className='d-flex'>
                <h6>Cuit:</h6>
                <h6 className='px-2'>{selectedCustomer ? selectedCustomer.cuit : 'Cuit'}</h6>
                <h6 className='px-4'>Horario:</h6>
                <h6>{selectedCustomer ? selectedCustomer.horario : 'Horario'}</h6>
            </div>
        </div>
    );
}

OrderDatos.propTypes = {
    selectedCustomer: PropTypes.shape({
        nombre: PropTypes.string,
        direccion: PropTypes.string,
        cuit: PropTypes.string,
        horario: PropTypes.string,
        // Agrega otras propiedades si es necesario
    }),
};