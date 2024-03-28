import { Routes, Route } from 'react-router-dom'
import './App.css'
import AdminRoutes from './assets/Guard/AdminRoutes/AdminRoutes'
import Header from './assets/Layout/Header/Header'
import Footer from './assets/Layout/Footer/Footer'
import Home from './assets/pages/Home/Home'
import User from './assets/pages/User/Users'
import Product from './assets/pages/Product/Product'
import Suppliers from './assets/pages/Suppliers/Suppliers'
import Customers from './assets/pages/Customers/Customers'
import Categories from './assets/pages/Categories/Categories'
import Price from './assets/pages/Price/Price'
import Orders from './assets/pages/Orders/Orders'
import Stock from './assets/pages/Stock/Stock'
import Deliveries from './assets/pages/Deliveries/Deliveries'
import Account from './assets/pages/Account/Account'
import Login from './assets/pages/Login/Login'
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  return (
    <>
      <Header />

      <main className='main'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/customers' element={<Customers />} />
          <Route path='/products' element={<Product />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/prices' element={<Price />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/stock' element={<Stock />} />
          <Route path='/deliveries' element={<Deliveries />} />
          <Route path='/account' element={<Account />} />
          <Route path='/users' element={<AdminRoutes><User /></AdminRoutes>} />
          <Route path='/login' element={<AdminRoutes> <Login /> </AdminRoutes>} />

        </Routes>
      </main>

      <Footer />

    </>
  )
}

export default App
