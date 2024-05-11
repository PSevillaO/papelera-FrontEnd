
import { useState, useEffect } from 'react';
import './orders.css'
// import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import OrderDatos from '../../../componets/orders/OrderDatos';
import { OrderOrders } from '../../../componets/orders/OrderOrders';
import OrderPedidos from '../../../componets/orders/OrderPedidos';

const URL = import.meta.env.VITE_SERVER_URL;


export default function Orders() {
  // Estado para almacenar los datos de la API
  const [apiData, setApiData] = useState([]);

  // Estado para almacenar el valor del input
  const [searchValue, setSearchValue] = useState('');
  // Estado para almacenar los datos del cliente seleccionado
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pedidosActualizados, setPedidosActualizados] = useState(0);

  const [dataOrder, setDataOrder] = useState({});



  const handlePedidoData = (pedidoDatas) => {
    setDataOrder(pedidoDatas);
  };

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchValue(value);
  };

  // Función para manejar la tecla Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && filteredData.length > 0) {
      // Actualiza los datos del cliente seleccionado
      setSelectedCustomer(filteredData[0]);
    }
  };

  // Función para manejar el clic en una fila de la tabla
  const handleRowClick = (customer) => {
    // Actualiza los datos del cliente seleccionado
    setSelectedCustomer(customer);
  };

  // Función para realizar la llamada a la API
  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/customers`);
      setApiData(response.data.customers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const actualizarPedidos = () => {
    setPedidosActualizados(prevState => prevState + 1);
  };




  // Llamada a la API cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar datos según el valor del input
  const filteredData = apiData.filter((customer) =>
    customer.nombre.toLowerCase().includes(searchValue)
  );

  // Función para renderizar la tabla
  function pintaTabla() {
    return filteredData.map((customer) => (
      <tr key={customer._id} onClick={() => handleRowClick(customer)}>
        <td>{customer.nombre}</td>
      </tr>
    ));
  }


  return (
    <>
      <div className='main-orders'>
        <div className='main-clients'>
          <InputGroup size="sm" className="mb-3 text-clients" >
            {<Form.Control
              placeholder="Cliente"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={searchValue} />}
          </InputGroup>
          <div className='table-container'>
            <Table striped bordered hover size="sm" className='client-table'>
              <tbody>
                {pintaTabla()}
              </tbody>
            </Table>
          </div>
          {/* muestra los datos del cliente  */}
          <OrderDatos selectedCustomer={selectedCustomer} />
        </div>

        <div className='detalle-custommer'>
          {/* muestra los datos del pedido, crea el pedido  */}
          {/* <OrderOrders Customer={selectedCustomer} onPedidosActualizados={actualizarPedidos} /> */}
          {selectedCustomer && <OrderOrders Customer={selectedCustomer} onPedidosActualizados={actualizarPedidos} dataOrder={dataOrder} />}
        </div>

        <aside className='aside-orders'>
          {/* muetra los pedidos del cliente selecionado */}
          <OrderPedidos selectedCustomer={selectedCustomer} pedidosActualizados={pedidosActualizados} onPedidoData={handlePedidoData} />
        </aside>
      </div>
    </>
  )
}

