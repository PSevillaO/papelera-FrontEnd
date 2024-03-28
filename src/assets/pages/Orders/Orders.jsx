
import { useState, useEffect } from 'react';
import './orders.css'
// import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import OrderDatos from '../../../componets/orders/OrderDatos';

// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
import { OrderOrders } from '../../../componets/orders/OrderOrders';
import OrderPedidos from '../../../componets/orders/OrderPedidos';


export default function Orders() {
  // Estado para almacenar los datos de la API
  const [apiData, setApiData] = useState([]);

  // Estado para almacenar el valor del input
  const [searchValue, setSearchValue] = useState('');
  // Estado para almacenar los datos del cliente seleccionado
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
      const response = await axios.get('http://localhost:4000/api/customers');
      setApiData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
      <tr key={customer.customer_id} onClick={() => handleRowClick(customer)}>
        <td>{customer.customer_id}</td>
        <td>{customer.nombre}</td>
      </tr>
    ));
  }


  // const defaultProps = {
    // options: apiData,
    // getOptionLabel: (option) => option.nombre,
  // };

  return (
    <>
      <div className='main-orders'>
        <div className='main-clients'>
          <InputGroup size="sm" className="mb-3 text-clients" >
            { <Form.Control
              placeholder="Cliente"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={searchValue}/> }
            {/* <Autocomplete
              {...defaultProps}
              id="auto-select"
              autoSelect
              size="small"
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Clientes" variant="standard" onKeyPress={handleKeyPress} onChange={handleInputChange} />
              )} /> */}
          </InputGroup>
          <div className='table-container'>
            <Table striped bordered hover size="sm" className='client-table'>
              <tbody>
                {pintaTabla()}
              </tbody>
            </Table>
          </div>

          <OrderDatos selectedCustomer={selectedCustomer} />

        </div>

        <div className='detalle-custommer'>
          <OrderOrders selectedCustomer={selectedCustomer} />
        </div>

        <aside className='aside-orders'>
          <OrderPedidos selectedCustomer={selectedCustomer} />
        </aside>
      </div>
    </>
  )
}

