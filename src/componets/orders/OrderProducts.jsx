
import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';

export default function OrderProducts({ searchValue, articleValue, onProductSelect, products }) {
    const [filteredData, setFilteredData] = useState([]);
    

    useEffect(() => {
        setFilteredData(
            products.filter((product) => {
                const productName = product.nombre || '';
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
            <tr key={product.product_id} onClick={() => handleRowClick(product)}>
                <td>{product.nombre}</td>
                <td>{product.detalle}</td>
                <td>{product.price}</td>
                <td>{product.category_name}</td>
                <td>{product.articulo}</td>
            </tr>
        ));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get('http://localhost:4000/api/products');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='table-products'>
            <Table striped bordered hover size="sm" className='client-table'>
                <tbody>
                    {filteredData.length > 0 ? (
                        <>
                            <tr>
                                <th>Nombre</th>
                                <th>Detalle</th>
                                <th>Precio</th>
                                <th>Categoria</th>
                                <th>Articulo</th>
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
        </div>
    );
}

OrderProducts.propTypes = {
    searchValue: PropTypes.string.isRequired,
    articleValue: PropTypes.string.isRequired,
    onProductSelect: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
};
