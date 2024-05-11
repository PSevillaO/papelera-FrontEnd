
import PropTypes from 'prop-types';

export const ProductsTableRow = ({ prod, deleteProducts, setFormValue }) => {

    return (
        <tr key={prod._id}>
            <td>{prod.articulo}</td>
            <td>{prod.descripcion}</td>
            <td>{prod.detalle}</td>
            <td>{prod.presentacion}</td>
            <td>{prod.unidad}</td>
            <td>{prod.bulto}</td>
            <td>{prod.precio}</td>
            <td>{prod.category ? prod.category.nombre : "S/D"}</td>
            <td>{prod.stock}</td>
            <td>
                {prod.suppliers.map((supplier, index) => (
                    <div key={index}>{supplier.nombre}</div>
                ))}
            </td>
            <td>
                <button className='btn-edit' onClick={() => setFormValue(prod)}>
                    <span className="fa-regular fa-pen-to-square" aria-hidden="true"></span>
                </button>
                <button className='btn-delete' onClick={() => deleteProducts(prod._id)}>
                    <span className="fa-solid fa-trash" aria-hidden="true"></span>
                </button>
            </td>
        </tr>
    )

}

ProductsTableRow.propTypes = {
    prod: PropTypes.object.isRequired,
    deleteProducts: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired
};