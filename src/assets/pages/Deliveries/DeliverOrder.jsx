import PropTypes from 'prop-types';
import formatDate from '../../../utils/formatDate';
import './Deliveries.css'
import { useRef, useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

const URL = import.meta.env.VITE_SERVER_URL;

export default function DeliverOrder({ orders, updateNextStatus, cambiaOrden }) {

    const [orderInputs, setOrderInputs] = useState({});
    const [editingStatus, setEditingStatus] = useState(null); // estado para mostrar y editar el status
    const [editingObs, setEditingObs] = useState(null); // Estado para editar las obserbaciones
    const dragOverCard = useRef(0);
    const dragStartCard = useRef(0);

    async function generaArchivo(id, totalQuantity, totalPrice) {
        try {
            // console.log(totalQuantity, totalPrice)
            const response = await axios.get(`${URL}/orders/excel/${id}`, {
                params: {
                    totalQuantity: totalQuantity,
                    totalPrice: totalPrice
                },
                responseType: 'blob' // Indicamos que esperamos una respuesta binaria (blob)
            });
            // Creamos un objeto URL para el blob de la respuesta
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Creamos un enlace <a> para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nombre-del-archivo.xlsx'); // Nombre que se le dará al archivo
            document.body.appendChild(link);
            link.click();

            // Liberamos la URL del objeto blob
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
        }
    }




    async function cambiaEstado(estado, id) {
        try {
            if (estado === 'Finalizado') {
                Swal.fire({
                    title: "El estado es Finalizado, no se puede cambiar",
                    icon: 'error'
                });
                return;
            }

            let nextStatus = 'Finalizado';

            if (estado === 'Pendiente') {
                nextStatus = 'Procesado';
            }
            if (estado === 'Procesado') {
                nextStatus = 'Enviado';
            }
            if (estado === 'Enviado') {
                nextStatus = 'Entregado';
            }
            if (estado === 'Entregado') {
                nextStatus = 'Pagado';
            }
            if (estado === 'Pagado') {
                nextStatus = 'Finalizado';
            }

            const { value: confirmed } = await Swal.fire({
                title: "Desea Cambiar el estado",
                text: `Cambiar a ${nextStatus}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Cambiar",
                cancelButtonText: "Cancelar"
            });

            if (confirmed) {
                await axios.put(`${URL}/orders/status/${id}`, { status: nextStatus });

                Swal.fire({
                    title: "Estado cambiado",
                    text: `El Estado fue Cambiado a ${nextStatus}`,
                    icon: "success"
                });

                // si el estado resultante es Procesado actualizo el stock
                if (nextStatus === 'Procesado') {
                    await axios.put(`${URL}/orders/stock/${id}`); // solo envio el ID de la orden 
                }

                updateNextStatus(nextStatus);
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error al cambiar el estado",
                text: `El estado no pudo ser cambiado`,
                icon: "error"
            });
        }
    }

    const handleOrderChange = (event, orderId) => {
        const { value } = event.target;
        setOrderInputs(prevState => ({
            ...prevState,
            [orderId]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        cambiaOrden(orderInputs);
        setOrderInputs({});
    };

    const handleStatusDoubleClick = (orderId) => {
        setEditingStatus(orderId);
    };

    const handleStatusChange = async (event, orderId) => {
        const { value } = event.target;

        try {
            await axios.put(`${URL}/orders/status/${orderId}`, { status: value });

            Swal.fire({
                title: "Estado cambiado",
                text: `El Estado fue Cambiado a ${value}`,
                icon: "success"
            });

            updateNextStatus(value);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error al cambiar el estado",
                text: "El estado no pudo ser cambiado",
                icon: "error"
            });
        }

        setEditingStatus(null);
    };

    const handleObsDoubleClick = (orderId) => {
        setEditingObs(orderId);
    };

    const handleObsChange = async (event, orderId) => {
        const { value } = event.target;

        try {
            await axios.put(`${URL}/orders/status/${orderId}`, { obs: value });

            Swal.fire({
                title: "Observaciones actualizadas",
                text: "Las observaciones fueron actualizadas correctamente",
                icon: "success"
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error al actualizar las observaciones",
                text: "Las observaciones no pudieron ser actualizadas",
                icon: "error"
            });
        }

        setEditingObs(null);

    };


    const handleDragStart = (event, order) => {
        dragStartCard.current = order
    };

    const handleDragOver = (event, index, order) => {
        event.preventDefault();
        dragOverCard.current = order;
    };

    const handleDrop = () => {
        const idStart = dragStartCard.current._id;
        const startOrden = dragStartCard.current.orden;
        const overOrden = dragOverCard.current.orden;

        // Lista temporal para almacenar las actualizaciones de orden
        const newOrders = [];
        // Actualizar la orden de la tarjeta de inicio
        newOrders.push({ [idStart]: overOrden });
        // Actualizar la orden de las otras tarjetas
        orders.forEach(order => {
            if (order._id !== idStart) {
                // Verificar si la orden es mayor o igual que overOrden
                if (startOrden < overOrden && order.orden >= startOrden && order.orden <= overOrden) {
                    newOrders.push({ [order._id]: order.orden - 1 });
                } else if (startOrden > overOrden && order.orden >= overOrden && order.orden <= startOrden) {
                    newOrders.push({ [order._id]: order.orden + 1 });
                } else {
                    newOrders.push({ [order._id]: order.orden });
                }
            }
        });
        // Enviar todas las actualizaciones de orden a cambiaOrden
        newOrders.forEach(updatedOrder => cambiaOrden(updatedOrder));
    };



    return (
        <>
            {orders.map((order, index) => (
                <div key={order._id} >
                    <div className='deliver-card-body' draggable
                        onDragStart={(event) => handleDragStart(event, order)}
                        onDragOver={(event) => handleDragOver(event, index, order)}
                        onDrop={handleDrop}
                    >
                        <div className='deliver-card-title'>
                            {order.customer.nombre}
                        </div>
                        <div className='deliver-card-subtitle'>
                            <div className='deliver-card-fecha'>
                                Fecha de entrega: {formatDate(order.deliveryDate)}<br />
                            </div>
                            <div className='deliver-estado-title'>
                                Estado:
                                <div className="deliver-estado" onDoubleClick={() => handleStatusDoubleClick(order._id)}>
                                    {editingStatus === order._id ? (
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(e, order._id)} >
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Procesado">Procesado</option>
                                            <option value="Enviado">Enviado</option>
                                            <option value="Entregado">Entregado</option>
                                            <option value="Pagado">Pagado</option>
                                            <option value="Finalizado">Finalizado</option>
                                        </select>
                                    ) : (
                                        <span>{order.status}</span>
                                    )}
                                </div>
                            </div>
                            <div className='deviver-obs' onDoubleClick={() => handleObsDoubleClick(order._id)}>
                                {editingObs === order._id ? (
                                    <input
                                        type='text'
                                        value={order.obs || ""}
                                        onChange={(e) => handleObsChange(e, order._id)}
                                    />
                                ) : (
                                    <span> Obs: {order.obs || ""}</span>
                                )}
                            </div>
                        </div>
                        <div className='deliver-card-product-list'>
                            <div className='deliver-card-product'>
                                Productos:
                            </div>
                            <div className='deliver-card-table'>
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
                                        {order.products.map((product) => (
                                            <tr key={product.product._id} className={order.status !== 'Pendiente' && product.stock < product.quantity ? 'low-stock' : ''} >
                                                <td>{product.product.articulo}</td>
                                                <td>{product.product.descripcion}</td>
                                                <td align="right">{product.stock}</td>
                                                <td align="right">{product.quantity}</td>
                                                <td align="right">{product.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>Total:</td>
                                            <td></td>
                                            <td></td>
                                            <td align="right">{order.totalQuantity}</td>
                                            <td align="right">{order.totalPrice.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div className="deliver-btn-main">
                            <button className='state-btn' onClick={() => cambiaEstado(order.status, order._id)}>Estado</button>
                            <button className='print-btn' onClick={() => generaArchivo(order._id, order.totalQuantity, order.totalPrice.toFixed(2))}>Archivo</button>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="number"
                                    value={orderInputs[order._id] || order.orden}
                                    onChange={(e) => handleOrderChange(e, order._id)}
                                    readOnly={false} // Permitir la edición del input
                                />
                                <button className='state-btn'>orden</button>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

DeliverOrder.propTypes = {
    orders: PropTypes.array,
    updateNextStatus: PropTypes.func,
    cambiaOrden: PropTypes.func
};
