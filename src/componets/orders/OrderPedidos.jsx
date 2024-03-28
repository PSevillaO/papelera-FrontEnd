import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import PropTypes from 'prop-types';
// import Events from '../../assets/pages/Orders/events';

export default function OrderPedidos({ selectedCustomer, historialPedidoActualizado }) {
    // let numeroPedido = 0;
    const [apiOrders, setApiOrders] = useState([]);
    const [pedido, setPedido] = useState(null);
    const [fechaCreacion, setFechaCreacion] = useState(null);
    const [fechaEntrega, setFechaEntrega] = useState(null);

    useEffect(() => {
        // Solo llamamos fetchPedidos si selectedCustomer está definido
        if (selectedCustomer && selectedCustomer.customer_id) {
            fetchPedidos(selectedCustomer.customer_id);
        }
    }, [selectedCustomer, historialPedidoActualizado]);


    useEffect(() => {
        const fetchAndUpdatePedidos = async () => {
            // Solo llamamos fetchPedidos si selectedCustomer está definido
            if (selectedCustomer && selectedCustomer.customer_id) {
                await fetchPedidos(selectedCustomer.customer_id);
            }
        };
        fetchAndUpdatePedidos();
        // Escucha el evento y actualiza los pedidos
        const handleUpdatePedidos = () => {
            fetchAndUpdatePedidos();
        };

        window.addEventListener('updatePedidos', handleUpdatePedidos);

        return () => {
            // Limpia el listener cuando el componente se desmonta
            window.removeEventListener('updatePedidos', handleUpdatePedidos);
        };
    }, [selectedCustomer]);


    // Función para realizar la llamada a la API de pedidos
    const fetchPedidos = async (customerId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/orders/${customerId}`);
            setApiOrders(response.data);
            const [firstOrder] = response.data; // Tomar solo el primer pedido

            // Actualizar los estados solo si hay datos
            if (firstOrder) {
                setPedido(firstOrder.pedido);
                setFechaCreacion(formatFecha(firstOrder.fecha_creacion));
                setFechaEntrega(formatFecha(firstOrder.fecha_entrega));
            } else {
                // Si no hay datos, establecer los estados en null
                setPedido(null);
                setFechaCreacion(null);
                setFechaEntrega(null);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    function pintaPedidos() {
        return apiOrders.map((order) => (
            <tr key={order.orders_id}>
                <td>{order.nombre}</td>
                <td>{order.Precio}</td>
                <td>{order.quantity}</td>
                <td>{order.quantity * order.Precio}</td>
            </tr>
        ));

    }

    OrderPedidos.propTypes = {
        selectedCustomer: PropTypes.object,
        historialPedidoActualizado: PropTypes.object,
    };

    // Función para formatear la fecha
    const formatFecha = (fecha) => {
        if (!fecha) return null;

        const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
        return new Date(fecha).toLocaleDateString('es-AR', options);
    };

    const total = apiOrders.reduce((acc, order) => {
        return acc + order.quantity * order.Precio;
    }, 0);

    return (
        <div className='Pedidos-history'>
            <h6> Pedido: {pedido}</h6>
            <h6> Fecha de Creación: {fechaCreacion}</h6>
            <h6> Fecha de Entrega: {fechaEntrega}</h6>
            <Table striped bordered hover size="sm" className='pedidos-table'>
                <tbody>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>cantidad</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                    {pintaPedidos()}
                    <tr>
                        <td colSpan="3">Total</td>
                        <td>{total}</td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}
