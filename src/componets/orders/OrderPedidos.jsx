import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';


const URL = import.meta.env.VITE_SERVER_URL;

export default function OrderPedidos({ selectedCustomer, pedidosActualizados, onPedidoData }) {
    const [apiOrders, setApiOrders] = useState([]);
    const [limit, setLimit] = useState(3)


    useEffect(() => {
        if (selectedCustomer && selectedCustomer._id) {
            fetchPedidos(selectedCustomer._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomer, pedidosActualizados, limit]);

    const fetchPedidos = async (customerId) => {
        try {
            const response = await axios.get(`${URL}/orders/${customerId}?limit=${limit}`);
            const data = response.data.orders;

            if (data && data.length > 0) {
                setApiOrders(data);
            } else {
                // Si no hay órdenes para el cliente, establece el estado en un arreglo vacío
                setApiOrders([]);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // No se encontraron órdenes para el cliente
                console.log('No se encontraron órdenes para el cliente:', error);
                setApiOrders([]);
            } else {
                // Para cualquier otro error, imprime el mensaje de error en la consola
                console.error('Error fetching data:', error);
            }
        }
    };

    function copiaOrder(ordenes) {
        // Aca pongo en el estado la orden que seleccione 
        onPedidoData(ordenes)
    }

    const renderOrderCards = () => {

        return apiOrders.map((order) => {
            let totalQuantity = 0;
            let totalPrice = 0;
            order.products.forEach(product => {
                totalQuantity += product.quantity;
                totalPrice += product.price;
            });

            return (
                <Card key={order._id}>
                    <div className='order-card-body'>
                        <div className='order-card-title'>{order.customer.nombre}</div>
                        <div className='order-card-subtitle'>
                            <div className='order-card-fecha'>
                                Fecha de entrega: {formatDate(order.deliveryDate)}<br />
                            </div>
                            Estado: {order.status}
                        </div>
                        <div className='order-card-product-list'>
                            <div className='order-card-product'>
                                Productos:
                            </div>
                            <div className='order-card-table'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className='tho1'>Descripcion</th>
                                            <th className='tho2'>Cant</th>
                                            <th className='tho3'>Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.products.map((product) => (
                                            <tr key={product.product._id}>
                                                <td>{product.product.descripcion}</td>
                                                <td align="right">{product.quantity}</td>
                                                <td align="right">{product.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>Total:</td>
                                            <td align="right">{totalQuantity}</td>
                                            <td align="right">{totalPrice.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div className="order-btn-main">
                            <button className='order-btn' onClick={() => copiaOrder(order)}>Copiar</button>
                        </div>
                    </div>
                </Card>
            );
        });
    };

    return (
        <>
            <div className="limit-container">
                {/* <p>Pedidos...</p> */}
                <select className="selc" onChange={(e) => setLimit(e.target.value)}>
                    <option value={3}>3</option>
                    <option value={10}>10</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div className='Pedidos-history'>
                {renderOrderCards()}
            </div>

        </>
    );
}

OrderPedidos.propTypes = {
    selectedCustomer: PropTypes.object,
    pedidosActualizados: PropTypes.number, // Cambiado a PropTypes.number
    onPedidoData: PropTypes.func.isRequired,
};
