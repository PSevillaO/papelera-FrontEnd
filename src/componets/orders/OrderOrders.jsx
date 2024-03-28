import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import OrderProducts from './OrderProducts';
import Swal from "sweetalert2"
// import OrderPedidos from './OrderPedidos';
import Events from '../../assets/pages/Orders/events';
import 'animate.css';


export function OrderOrders(Customer) {
    const [searchValue, setSearchValue] = useState('');
    const [articleValue, setArticleValue] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const quantityInputRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [setHistorialPedidoActualizado] = useState(0);


    const handleInputChange = (event) => {
        const value = event.target.value || '';
        const lowercaseValue = value.toLowerCase();
        setSearchValue(lowercaseValue);
    };

    // const handleArticleChange = (event) => {
    //     const value = event.target.value || '';
    //     const lowercaseValue = value.toLowerCase();
    //     setArticleValue(lowercaseValue);
    // };


    //Verifica si el producto ya se encuentra cargado
    const handleProductSelect = (product) => {
        const isProductSelected = selectedProducts.some(
            (selectedProduct) => selectedProduct.product_id === product.product_id
        );
        if (!isProductSelected) {
            setSelectedProducts([...selectedProducts, { ...product, quantity }]);
            setQuantity(1);
            setSearchValue('');
            setArticleValue('');
            focusQuantityInput();
        }
    }

    const handleAddToOrder = () => {
        const firstFilteredProduct = filteredProducts.find(product => product.articulo === articleValue) || filteredProducts[0];

        if (quantity > 0 && firstFilteredProduct) {
            const isProductSelected = selectedProducts.some(
                (selectedProduct) => selectedProduct.product_id === firstFilteredProduct.product_id
            );

            if (!isProductSelected) {
                setSelectedProducts((prevProducts) => [
                    ...prevProducts,
                    { ...firstFilteredProduct, quantity },
                ]);
                setQuantity(1);
                setSearchValue('');
                setArticleValue('');
                focusQuantityInput();
            }
        }
    };


    const BorraPedido = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.product_id !== productId);
        setSelectedProducts(updatedProducts);
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10) || 0;
        setQuantity(value);
    };

    const focusQuantityInput = () => {
        if (quantityInputRef.current) {
            quantityInputRef.current.focus();
            quantityInputRef.current.setSelectionRange(0, 1);
        }
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {

            console.log("Enter ", e)
            e.preventDefault();
            handleAddToOrder();
        }
    };

    useEffect(() => {
        if (quantityInputRef.current) {
            quantityInputRef.current.focus();
            quantityInputRef.current.setSelectionRange(0, 1);
        }
    }, [selectedProducts]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/products');
                const data = await response.json();
                setProducts(data);

                const filteredData = data.filter((product) =>
                    (product.nombre && product.nombre.toLowerCase().includes(searchValue)) ||
                    (product.articulo && product.articulo.toLowerCase().includes(searchValue))
                );

                setFilteredProducts(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [searchValue]);

    useEffect(() => {
        const filteredData = products.filter((product) =>
            (product.nombre && product.nombre.toLowerCase().includes(searchValue)) ||
            (product.articulo && product.articulo.toLowerCase().includes(articleValue))
        );

        setFilteredProducts(filteredData);
    }, [searchValue, articleValue]);

    const total = selectedProducts.reduce((acc, product) => {
        return acc + product.quantity * product.price;
    }, 0);


    // Función para limpiar productos seleccionados y otros estados
    const limpiarProductosSeleccionados = () => {
        setSelectedProducts([]);
        setQuantity(1);
        setSearchValue('');
        setArticleValue('');
    };


    const GrabaPedido = async () => {
        try {
            if (!Customer.selectedCustomer) {
                Swal.fire({
                    title: "Se debe cargar un Cliente",
                    showClass: {
                        popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster `
                    },
                    hideClass: {
                        popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster `
                    }
                });
                return;
            }

            // busco el maximo pedido y le sumo 1 
            const pedidoMaximo = await axios.get('http://localhost:4000/api/orders');
            // Aquí deberías tener la lógica para obtener la fecha actual en el formato que necesitas.
            const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const pedidosData = selectedProducts.map((element) => ({
                product_id: element.product_id,
                pedido: pedidoMaximo.data[0].pedido + 1,
                customer_id: Customer.selectedCustomer.customer_id,
                precio: element.price,
                quantity: element.quantity,
                fecha_creacion: fechaActual,
                fecha_entrega: fechaActual,
                obs: "Obs ",
            }));
            if (pedidosData.length !== 0) {
                Swal.fire({
                    title: "Crear el pedido?",
                    text: `Desea crear el Pedido`,
                    icon: "warning",
                    confirmButtonText: "Confirmar",
                    showCancelButton: true,
                }).then(async result => {
                    if (result.isConfirmed) {
                        // Haciendo la solicitud POST usando Axios
                        await axios.post('http://localhost:4000/api/orders/multiple', { pedidosData });

                        window.dispatchEvent(Events.updatePedidos);
                        limpiarProductosSeleccionados();
                        setHistorialPedidoActualizado(prevState => prevState + 1);
                    }
                })
            }else{
                Swal.fire({
                    title: "Se debe cargar un Producto",
                    showClass: {
                        popup: `
                        animate__animated
                        animate__fadeInUp
                        animate__faster `
                    },
                    hideClass: {
                        popup: `
                        animate__animated
                        animate__fadeOutDown
                        animate__faster `
                    }
                });
            }
        } catch (error) {
            console.error('Error al grabar pedido:', error);
        }
    };

    return (
        <>
            <div className='order'>
                <InputGroup size="sm" className="mb-3 text-clients">
                    <Form.Control
                        ref={quantityInputRef}
                        placeholder="Cantidad"
                        type="text"
                        onChange={handleQuantityChange}
                        value={quantity}
                    />
                    <Form.Control
                        placeholder="Pedido"
                        onChange={handleInputChange}
                        value={searchValue}
                        onKeyDown={handleEnterPress}
                    />
                </InputGroup>
                <Table striped bordered hover size="sm" className='table-products'>
                    <tbody>
                        <tr>
                            <th>Cantidad</th>
                            <th>Nombre</th>
                            <th>Detalle</th>
                            <th>Precio</th>
                            <th>Categoria</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                        {selectedProducts
                            .reduce((unique, product) => {
                                // Utilizamos un conjunto para garantizar productos únicos
                                const productIds = unique.map((p) => p.product_id);
                                if (!productIds.includes(product.product_id)) {
                                    unique.push(product);
                                }
                                return unique;
                            }, [])
                            .map((product) => (
                                <tr key={product.product_id}>
                                    <td>{product && product.quantity}</td>
                                    <td>{product && product.nombre}</td>
                                    <td>{product && product.detalle}</td>
                                    <td>{product && product.price}</td>
                                    <td>{product && product.category_name}</td>
                                    <td>{product && product.quantity * product.price}</td>
                                    <td>
                                        <div className="todo-actions">
                                            <button
                                                className='btn-danger'
                                                onClick={() => BorraPedido(product.product_id)}
                                            >
                                                ☠️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        <tr>
                            <td colSpan="5">Total</td>
                            <td>{total}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                    <Button
                        onClick={() => GrabaPedido()}
                        variant="primary" size='sm' >Aceptar</Button>
                </div>
                {/* Pasa historialPedidoActualizado como una propiedad a OrderPedidos */}
                {/* <OrderPedidos selectedCustomer={Customer.selectedCustomer} historialPedidoActualizado={historialPedidoActualizado} /> */}

            </div>

            <div className='main-product'>
                <OrderProducts
                    searchValue={searchValue}
                    articleValue={articleValue}
                    onProductSelect={handleProductSelect}
                    products={filteredProducts}
                />
            </div>
        </>
    );
}
