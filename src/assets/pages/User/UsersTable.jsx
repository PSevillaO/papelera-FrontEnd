
import PropTypes from 'prop-types';
import { UsersTableRow } from "./UsersTableRow"

export const UsersTable = ({ users, deleteUsers, setFormValue }) => {
    return (
        <>
            <table className="users-table">
                <thead>
                    <tr>
                        <th className='th1'>Nombre</th>
                        <th className='th2'>Email</th>
                        <th className='th3'>Role</th>
                        <th className='th4'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(supp => (
                            <UsersTableRow key={supp._id} supp={supp} deleteUsers={deleteUsers} setFormValue={setFormValue} />
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    deleteUsers: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};