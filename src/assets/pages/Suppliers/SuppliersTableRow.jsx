
import PropTypes from 'prop-types';

export const SuppliersTableRow = ({ supp, deleteSuppliers, setFormValue }) => {

    return (
        <tr key={supp._id}>
            <td>{supp.nombre}</td>
            <td>{supp.direccion}</td>
            <td>{supp.telefono}</td>
            <td>{supp.email}</td>
            <td>
                <button className='btn-edit' onClick={() => setFormValue(supp)}>
                    <span className="fa-regular fa-pen-to-square" aria-hidden="true"></span>
                </button>
                <button className='btn-delete' onClick={() => deleteSuppliers(supp._id)}>
                    <span className="fa-solid fa-trash" aria-hidden="true"></span>
                </button>
            </td>
        </tr>
    )

}

SuppliersTableRow.propTypes = {
    supp: PropTypes.object.isRequired,
    deleteSuppliers: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};