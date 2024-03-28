
import PropTypes from 'prop-types';
import { CustomersTableRow } from "./CustomersTableRow"

export const CustomersTable = ({ customers, deleteCustomers, setFormValue }) => {
    return (
        <>
            <table className="customers-table">
                <thead>
                    <tr>
                        <th className='th1'>Nombre</th>
                        <th className='th2'>Razon Social</th>
                        <th className='th3'>Direccion</th>
                        <th className='th4'>CUIT</th>
                        <th className='th5'>Horario</th>
                        <th className='th6'>Telefono</th>
                        <th className='th7'>Email</th>
                        <th className='th8'>Obs</th>
                        <th className='th9'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        customers.map(supp => (
                            <CustomersTableRow key={supp._id} supp={supp} deleteCustomers={deleteCustomers} setFormValue={setFormValue} />
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

CustomersTable.propTypes = {
    customers: PropTypes.array.isRequired,
    deleteCustomers: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};