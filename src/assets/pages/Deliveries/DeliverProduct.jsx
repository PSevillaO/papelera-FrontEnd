import PropTypes from 'prop-types';
import './Deliveries.css';

export default function DeliverProduct({ orders }) {
    // Función para agrupar productos por su ID
    const groupProducts = (orders) => {
        const groupedProducts = new Map();
        orders.forEach(order => {
            order.products.forEach(product => {
                const productId = product.product._id;
                if (groupedProducts.has(productId)) {
                    // Si el producto ya está en el mapa, sumamos la cantidad y el precio
                    const existingProduct = groupedProducts.get(productId);
                    existingProduct.quantity += product.quantity;
                    existingProduct.price += product.price;
                } else {
                    // Si es la primera vez que encontramos el producto, lo añadimos al mapa
                    groupedProducts.set(productId, {
                        ...product,
                        quantity: product.quantity,
                        price: product.price
                    });
                }
            });
        });
        return Array.from(groupedProducts.values());
    };

    return (
        <div className="deliver-product-container">
            <h2>Lista de Productos</h2>
            <div className="deliver-product-list">
                <table>
                    <thead>
                        <tr>
                            <th className='dpth1'>Articulo</th>
                            <th className='dpth2'>Descripcion</th>
                            <th className='dpth3'>Stock</th>
                            <th className='dpth4'>Cant</th>
                            <th className='dpth5'>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupProducts(orders).map((product, index) => (
                            <tr key={`${product.product._id}-${index}`}>
                                <td>{product.product.articulo}</td>
                                <td>{product.product.descripcion}</td>
                                <td align="center">{product.stock}</td>
                                <td align="center">{product.quantity}</td>
                                <td align="right">{product.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

DeliverProduct.propTypes = {
    orders: PropTypes.array.isRequired
};
