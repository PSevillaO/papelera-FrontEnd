// muetras os productos tipo tabla 

import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';
const URL = import.meta.env.VITE_SERVER_URL;

export default function OrderProducts({ searchValue, articleValue, onProductSelect, products }) {
    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
        setFilteredData(
            products.filter((product) => {
                const productName = product.descripcion || '';
                const article = product.articulo || '';
                const searchLowerCase = searchValue.toLowerCase();
                const articleLowerCase = article.toLowerCase();

                return (
                    (productName.toLowerCase().includes(searchLowerCase) || articleLowerCase.includes(searchLowerCase)) &&
                    (articleValue === '' || articleLowerCase.includes(articleValue.toLowerCase()))
                );
            })
        );
    }, [searchValue, articleValue, products]);

    const handleRowClick = (product) => {
        onProductSelect(product);
    };

    const pintaTabla = () => {
        return filteredData.map((product) => (
            <tr key={product._id} onClick={() => handleRowClick(product)}>
                <td>{product.articulo}</td>
                <td>{product.descripcion}</td>
                <td>{product.detalle}</td>
                <td>{product.presentacion}</td>
                <td>{(((product.category.porcentaje / 100) * product.precio) + product.precio).toFixed(2)}</td>
                <td>{product.precio}</td>
                {/* <td>{product.category.porcentaje}</td> */}

            </tr>
        ));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${URL}/products`);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='table-products'>
            {/* <div className='table'> */}
            <Table striped bordered hover size="sm" className='client-table'>
                <tbody>
                    {filteredData.length > 0 ? (
                        <>
                            <tr>
                                <th>Articulo</th>
                                <th>Descripcion</th>
                                <th>Detalle</th>
                                <th>Presentacion</th>
                                <th>Lista</th>
                                <th>Proveedor</th>

                                {/* <th>%</th> */}
                            </tr>
                            {pintaTabla()}
                        </>
                    ) : (
                        <tr>
                            <td colSpan="5">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* </div> */}
        </div>
    );
}

OrderProducts.propTypes = {
    searchValue: PropTypes.string.isRequired,
    articleValue: PropTypes.string.isRequired,
    onProductSelect: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
};
