
import PropTypes from 'prop-types';
import { SuppliersTableRow } from "./SuppliersTableRow"

export const SuppliersTable = ({ suppliers, deleteSuppliers, setFormValue }) => {
    return (
        <>
            <table className="suppliers-table">
                <thead>
                    <tr>
                        <th className='th1'>Nombre</th>
                        <th className='th2'>Direccion</th>
                        <th className='th3'>Telefono</th>
                        <th className='th4'>Email</th>
                        <th className='th5'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        suppliers.map(supp => (
                            <SuppliersTableRow key={supp._id} supp={supp} deleteSuppliers={deleteSuppliers} setFormValue={setFormValue} />
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

SuppliersTable.propTypes = {
    suppliers: PropTypes.array.isRequired,
    deleteSuppliers: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};