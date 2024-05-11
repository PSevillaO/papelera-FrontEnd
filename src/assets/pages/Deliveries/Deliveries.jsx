import { useState, useEffect } from 'react';
import './Deliveries.css';
import axios from 'axios';
import DeliverOrder from './DeliverOrder';
import DeliverProduct from './DeliverProduct';


const URL = import.meta.env.VITE_SERVER_URL;

export default function Deliveries() {
    const [orders, setOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    // const [nextStatus, setNextStatus] = useState('');


    const updateNextStatus = () => {
        // setNextStatus(status);
        fetchData(selectedDate);
    };


    async function cambiaOrden(orderInputs) {
        try {
            const [id, orden] = Object.entries(orderInputs)[0];
            await axios.put(`${URL}/orders/status/${id}`, { orden: orden })
            fetchData(selectedDate);
        } catch (error) {
            console.log(error)
        }
    }

    // Función para obtener la fecha de hoy en el formato yyyy-mm-dd
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const fetchData = async (date) => {
        try {
            const response = await axios.get(`${URL}/orders/date/${date}`);
            const ordersWithTotals = response.data.orders.map(order => {
                const totalQuantity = order.products.reduce((acc, product) => acc + product.quantity, 0);
                const totalPrice = order.products.reduce((acc, product) => acc + product.quantity * product.price, 0);
                return { ...order, totalQuantity, totalPrice };
            });
            setOrders(ordersWithTotals);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    // con esto imprimo todas las ordenes 
    async function ImprimeCard() {
        try {
            console.log(orders)
            // const queryString = `orders=${encodeURIComponent(JSON.stringify(orders))}`;
            const response = await axios.put(`${URL}/orders/printByDay`, { pedidoData: orders },
                { responseType: 'blob' }
            );

            console.log("response print", response);

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
            console.log(error);
        }
    }



    return (
        <div className="main-deliver">
            {/* PEDIDOS */}
            <div className="main-deliver-order">
                <div className="deliver-order-fecha">
                    <div>
                        <label htmlFor="fecha-entrega">Fecha Entrega</label>
                        <input
                            type="date"
                            name='fecha-entrega'
                            id='fecha-entrega'
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div>
                        <button className='print-all-btn' onClick={() => { ImprimeCard() }}>
                            Hoja de Ruta
                        </button>
                    </div>
                </div>
                <div className="deliver-card">
                    <DeliverOrder orders={orders} updateNextStatus={updateNextStatus} cambiaOrden={cambiaOrden} />
                </div>
            </div>
            {/* PRODUCTOS */}
            <div className="main-deliver-products">
                <DeliverProduct orders={orders} />
            </div>
        </div>
    );
}
