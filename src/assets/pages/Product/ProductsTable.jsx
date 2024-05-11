
import PropTypes from 'prop-types';
import { ProductsTableRow } from "./ProductsTableRow"

export const ProductsTable = ({ products, deleteProducts, setFormValue, categoryNameFilter }) => {
    return (
        <>
            <table className="product-table">
                <thead>
                    <tr>
                        <th className='ptth1'>Articulo</th>
                        <th className='ptth2'>Descripcion</th>
                        <th className='ptth3'>Detalle</th>
                        <th className='ptth4'>Presentacion</th>
                        <th className='ptth5'>Unidad</th>
                        <th className='ptth6'>Bulto</th>
                        <th className='ptth7'>Precio</th>
                        <th className='ptth8'>Categoria</th>
                        <th className='ptth9'>Stock</th>
                        <th className='ptth10'>Proveedor</th>
                        <th className='ptth11'>Active</th>
                    </tr>
                </thead>
                <tbody>
                    {products
                        .filter(prod => categoryNameFilter ? prod.category?.nombre === categoryNameFilter : true)
                        .map(prod => (
                            <ProductsTableRow key={prod._id} prod={prod} deleteProducts={deleteProducts} setFormValue={setFormValue} />
                        ))
                    }
                </tbody>

            </table>
        </>
    )
}

ProductsTable.propTypes = {
    products: PropTypes.array.isRequired,
    deleteProducts: PropTypes.func.isRequired,
    setFormValue: PropTypes.func.isRequired,
    categoryNameFilter: PropTypes.string,
};