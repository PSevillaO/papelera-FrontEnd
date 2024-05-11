import { NavLink } from 'react-router-dom';
import './Header.css';
import { useState } from 'react';

export default function Header() {
    const [isActiveProduct, setIsActiveProduct] = useState(false);

    return (
        <header className='header'>
            <NavLink to="/" onClick={() => setIsActiveProduct(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            <NavLink to="/suppliers" onClick={() => setIsActiveProduct(false)} className='nav-link'>Proveedores</NavLink>
            <NavLink to="/customers" onClick={() => setIsActiveProduct(false)} className='nav-link'>Clientes</NavLink>

            <div className="dropdown">
                <div className={`nav-link ${isActiveProduct ? 'active' : ''}`}>Productos</div>
                <div className="dropdown-content">
                    <NavLink to="/products" onClick={() => setIsActiveProduct(true)} className='nav-link dropdown-item'>Productos</NavLink>
                    <NavLink to="/categories" onClick={() => setIsActiveProduct(true)} className='nav-link dropdown-item'>Categorías</NavLink>
                    <NavLink to="/prices" onClick={() => setIsActiveProduct(true)} className='nav-link dropdown-item'>Precios</NavLink>
                </div>
            </div>

            <NavLink to="/orders" onClick={() => setIsActiveProduct(false)} className='nav-link'>Pedidos</NavLink>
            <NavLink to="/deliveries" onClick={() => setIsActiveProduct(false)} className='nav-link'>Entregas</NavLink>
            <NavLink to="/stock" onClick={() => setIsActiveProduct(false)} className='nav-link'>Stock</NavLink>
            <NavLink to="/account" onClick={() => setIsActiveProduct(false)} className='nav-link'>Pagos</NavLink>

            <NavLink to="/users" onClick={() => setIsActiveProduct(false)} className='nav-link'>Usuarios</NavLink>
            <NavLink to="/login" onClick={() => setIsActiveProduct(false)} className='nav-link'>Login</NavLink>
        </header>
    )
}
