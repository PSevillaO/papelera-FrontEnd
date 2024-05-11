import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from 'prop-types';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import OrderProducts from './OrderProducts';
import Swal from "sweetalert2"
import Events from '../../assets/pages/Orders/events';
import 'animate.css';



const URL = import.meta.env.VITE_SERVER_URL;

const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export function OrderOrders({ Customer, onPedidosActualizados, dataOrder }) {
    const [searchValue, setSearchValue] = useState('');
    const [articleValue, setArticleValue] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const quantityInputRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState(getTomorrowDate());
    const [pedidoActualizado, setPedidoActualizado] = useState(0);
    const [editProductId, setEditProductId] = useState(null); // Nuevo estado para almacenar el ID del producto que se está editando
    const [editPrice, setEditPrice] = useState(null); // Nuevo estado para almacenar el precio editado

    const [isEdited, setIsEdited] = useState(false);// estado para ver si edito


    const handleInputChange = (event) => {
        const value = event.target.value || '';
        const lowercaseValue = value.toLowerCase();
        setSearchValue(lowercaseValue);
    };

    const handleProductSelect = (product) => {
        const isProductSelected = selectedProducts.some(
            (selectedProduct) => selectedProduct._id === product._id
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
                (selectedProduct) => selectedProduct._id === firstFilteredProduct._id
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


    const BorraPedidos = () => {
        setSelectedProducts([]);
        setIsEdited(false);  // al notener pedidos no tiene que dejar editar
    }


    const BorraPedido = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product._id !== productId);
        setSelectedProducts(updatedProducts);
    };

    const EditarPrecio = (productId) => {
        setEditProductId(productId); // Establecer el ID del producto que se está editando
        const product = selectedProducts.find(product => product._id === productId);
        setEditPrice(product && (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)); // Establecer el precio actual del producto en el 
        console.log(product)
    }

    const handleEditPriceChange = (event) => {
        const value = parseFloat(event.target.value) || 0;
        setEditPrice(value);
    };

    const handleEditSave = (productId) => {
        setSelectedProducts(prevProducts => prevProducts.map(product => {
            if (product._id === productId) {
                // Obtenemos el precio del producto antes de aplicar el porcentaje
                const originalPrice = product.precio / (1 + product.category.porcentaje / 100);

                // Verificamos si hay un precio editado, de lo contrario mantenemos el precio existente
                const editedPrice = editPrice !== null ? parseFloat(editPrice) : originalPrice;

                return { ...product, precio: editedPrice, quantity: quantity, isEdited: true };
            }

            return product;
        }));

        setEditProductId(null);
        setEditPrice(null);
        setQuantity(1);
    };


    const handleEditPriceCancel = () => {
        setEditProductId(null);
        setEditPrice(null);
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
                const response = await axios.get(`${URL}/products?limit=100`);
                const data = response.data.products
                if (data) {
                    setProducts(data);
                }
                const filteredData = data.filter((product) =>
                    (product.descripcion && product.descripcion.toLowerCase().includes(searchValue)) ||
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
            (product.descripcion && product.descripcion.toLowerCase().includes(searchValue)) ||
            (product.articulo && product.articulo.toLowerCase().includes(articleValue))
        );
        setFilteredProducts(filteredData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, articleValue]);


    // esto es el que viene de OrderPedidos
    useEffect(() => {
        if (dataOrder && ((dataOrder.orders && dataOrder.orders.length > 0) || (dataOrder.products && dataOrder.products.length > 0))) {
            const selectedProducts = (dataOrder.orders || [dataOrder]).flatMap(order =>
                order.products.map(productItem => {
                    const product = productItem.product;
                    const category = product.category || {}; // Si product.category es undefined, asigna un objeto vacío
                    const porcentaje = category.porcentaje || 0; // Si category.porcentaje es undefined, asigna 0

                    return {
                        _id: product._id,
                        articulo: product.articulo,
                        descripcion: product.descripcion,
                        precio: product.precio,
                        quantity: productItem.quantity,
                        stock: product.stock,
                        isEdited: false,
                        category: {
                            porcentaje: porcentaje,
                            _id: category._id
                        }
                    };
                })
            );
            // console.log(selectedProducts)
            setSelectedProducts(selectedProducts);
            setIsEdited(true);  //esto es para ver si puedo editar, aca cambio estado 
        }
    }, [dataOrder]);


    const total = selectedProducts.reduce((acc, product) => {
        // console.log(product.precio)
        return acc + product.quantity * (product.isEdited ? product.precio : (((product.category.porcentaje / 100) * product.precio) + product.precio));

    }, 0);

    const limpiarProductosSeleccionados = () => {
        setSelectedProducts([]);
        setQuantity(1);
        setSearchValue('');
        setArticleValue('');
    };

    const EditaPedidos = () => {
        try {
            if (isEdited) {
                const pedidoData = {
                    products: selectedProducts.map(product => ({
                        product: product._id,
                        quantity: product.quantity,
                        stock: product.stock,
                        price: product.isEdited ? product.precio : (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)
                    })),
                    customer: Customer._id,
                    deliveryDate: deliveryDate,
                    status: "Pending"
                }
                if (pedidoData.products.length !== 0) {
                    Swal.fire({
                        title: "Edita el pedido?",
                        text: `Desea Editar el Pedido`,
                        icon: "warning",
                        confirmButtonText: "Confirmar",
                        showCancelButton: true,
                    }).then(async result => {
                        if (result.isConfirmed) {
                            await axios.put(`${URL}/orders/${dataOrder._id}`, { pedidoData });

                            window.dispatchEvent(Events.updatePedidos);
                            limpiarProductosSeleccionados();
                            setPedidoActualizado(prevState => prevState + 1);
                            onPedidosActualizados(pedidoActualizado);
                            setIsEdited(false);
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Se debe cargar un Producto",
                        showClass: {
                            popup: `animate__animated animate__fadeInUp animate__faster`
                        },
                        hideClass: {
                            popup: `animate__animated animate__fadeOutDown animate__faster`
                        }
                    });
                }
            } else {
                Swal.fire({
                    title: "No se puede editar",
                    showClass: {
                        popup: `animate__animated animate__fadeInUp animate__faster`
                    },
                    hideClass: {
                        popup: `animate__animated animate__fadeOutDown animate__faster`
                    }
                });
            }

        } catch (error) {
            console.error('Error al grabar pedido:', error);
        }



    }


    const GrabaPedido = async () => {
        try {
            if (!Customer) {
                Swal.fire({
                    title: "Se debe cargar un Cliente",
                    showClass: {
                        popup: `animate__animated animate__fadeInUp animate__faster`
                    },
                    hideClass: {
                        popup: `animate__animated animate__fadeOutDown animate__faster`
                    }
                });
                return;
            }

            // aca busco el orden
            const response = await axios.get(`${URL}/orders/orden/${deliveryDate}`);
            const latestOrderNumber = response.data.latestOrderNumber;
            // Verificar si se obtuvo correctamente el último orden
            if (latestOrderNumber === null) {
                console.error('No se pudo obtener el último orden.');
                return;
            }

            const pedidoData = {
                products: selectedProducts.map(product => ({
                    product: product._id,
                    quantity: product.quantity,
                    stock: product.stock,
                    price: product.isEdited ? product.precio : (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)
                })),
                customer: Customer._id,
                deliveryDate: deliveryDate,
                status: "Pending",
                orden: latestOrderNumber
            }

            if (pedidoData.products.length !== 0) {
                Swal.fire({
                    title: "Crear el pedido?",
                    text: `Desea crear el Pedido`,
                    icon: "warning",
                    confirmButtonText: "Confirmar",
                    showCancelButton: true,
                }).then(async result => {
                    if (result.isConfirmed) {
                        await axios.post(`${URL}/orders`, { pedidoData });

                        window.dispatchEvent(Events.updatePedidos);
                        limpiarProductosSeleccionados();
                        setPedidoActualizado(prevState => prevState + 1);
                        onPedidosActualizados(pedidoActualizado);
                        setIsEdited(false); // para evitar el Edit 
                    }
                })
            } else {
                Swal.fire({
                    title: "Se debe cargar un Producto",
                    showClass: {
                        popup: `animate__animated animate__fadeInUp animate__faster`
                    },
                    hideClass: {
                        popup: `animate__animated animate__fadeOutDown animate__faster`
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
                    <div className='order-form1'>
                        <Form.Control
                            ref={quantityInputRef}
                            placeholder="Cantidad"
                            type="text"
                            onChange={handleQuantityChange}
                            value={quantity}
                            className='col-3'
                        />
                    </div>
                    <div className='order-form2'>
                        <Form.Control
                            placeholder="Pedido"
                            onChange={handleInputChange}
                            value={searchValue}
                            onKeyDown={handleEnterPress}
                            className='col-6'
                        />
                    </div>
                    <div className='order-form3'>
                        <Form.Control
                            type='date'
                            placeholder="Fecha de Entrega"
                            className='fs-s col-3'
                            defaultValue={getTomorrowDate()}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                    </div>
                </InputGroup>
                <Table striped bordered hover size="sm" className='table-products'>
                    <tbody>
                        <tr>
                            <th>Articulo</th>
                            <th>Descripcion</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                        {selectedProducts.map((product) => (
                            <tr key={product._id}>
                                <td>{product && product.articulo}</td>
                                <td>{product && product.descripcion}</td>
                                <td align="right">
                                    {editProductId === product._id ? (
                                        <Form.Control
                                            type="number"
                                            value={editPrice}
                                            onChange={handleEditPriceChange}
                                            autoFocus
                                        />
                                    ) : (
                                        // product && (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)
                                        // editPrice !== null ? editPrice : (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)
                                        // isEditedPrecio ? product.precio : (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)
                                        product.isEdited ? product.precio : (((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)
                                    )}
                                </td>
                                <td align="right">
                                    {editProductId === product._id ? (
                                        <Form.Control
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        />
                                    ) : (
                                        product && product.quantity
                                    )}
                                </td>
                                <td align="right">{(product && product.quantity * (product.isEdited ? product.precio : (((product.category.porcentaje / 100) * product.precio) + product.precio))).toFixed(2)}</td>
                                <td>
                                    <div className="todo-actions">
                                        <button className='btn-danger' onClick={() => BorraPedido(product._id)}>☠️</button>
                                        {editProductId === product._id ? (
                                            <>
                                                <button className='btn-primary' onClick={() => handleEditSave(product._id)}>💾</button>
                                                <button className='btn-secondary' onClick={handleEditPriceCancel}>❌</button>
                                            </>
                                        ) : (
                                            <button className='btn-edit' onClick={() => EditarPrecio(product._id)}>✏️</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="4">Total</td>
                            <td align="right">{total.toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
                <div className='btn-graba-pedido'>
                    <Button className='OrderOrders-Btn-new' onClick={GrabaPedido} variant="success" size='sm' >New</Button>
                    {isEdited ? <Button className='OrderOrders-Btn-edit' onClick={EditaPedidos} variant="warning" size='sm' >Editar</Button> : ""}
                    <Button className='OrderOrders-Btn-delete' onClick={BorraPedidos} variant="danger" size='sm' >Borrar</Button>
                </div>
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

OrderOrders.propTypes = {
    Customer: PropTypes.object.isRequired,
    onPedidosActualizados: PropTypes.func.isRequired,
    dataOrder: PropTypes.object.isRequired,
};
