
import PropTypes from 'prop-types';

export const UsersTableRow = ({ supp, deleteUsers, setFormValue }) => {

    return (
        <tr key={supp._id}>
            <td>{supp.nombre}</td>
            <td>{supp.email}</td>
            <td>{supp.role}</td>
            <td>
                <button className='btn-edit' onClick={() => setFormValue(supp)}>
                    <span className="fa-regular fa-pen-to-square" aria-hidden="true"></span>
                </button>
                <button className='btn-delete' onClick={() => deleteUsers(supp._id)}>
                    <span className="fa-solid fa-trash" aria-hidden="true"></span>
                </button>
            </td>
        </tr>
    )

}

UsersTableRow.propTypes = {
    supp: PropTypes.object.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};