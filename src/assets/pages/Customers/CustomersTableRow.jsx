
import PropTypes from 'prop-types';

export const CustomersTableRow = ({ supp, deleteCustomers, setFormValue }) => {

    return (
        <tr key={supp._id}>
            <td>{supp.nombre}</td>
            <td>{supp.razon_social}</td>
            <td>{supp.direccion}</td>
            <td>{supp.cuit}</td>
            <td>{supp.horario}</td>
            <td>{supp.telefono}</td>
            <td>{supp.email}</td>
            <td>{supp.obs}</td>
            <td>
                <button className='btn-edit' onClick={() => setFormValue(supp)}>
                    <span className="fa-regular fa-pen-to-square" aria-hidden="true"></span>
                </button>
                <button className='btn-delete' onClick={() => deleteCustomers(supp._id)}>
                    <span className="fa-solid fa-trash" aria-hidden="true"></span>
                </button>
            </td>
        </tr>
    )

}

CustomersTableRow.propTypes = {
    supp: PropTypes.object.isRequired,
    deleteCustomers: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};