
import axios from "axios";
import { useState } from "react";

import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import './Price.css'



const URL = import.meta.env.VITE_SERVER_URL;

export default function Price() {
  const { register, handleSubmit } = useForm();
  const [precios, setPrecios] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);


  const combinePriceAndProduct = (price, product) => ({
    cod_prod: price.cod_prod,
    Descripcion: price.Descripcion,
    unid_v: price.unid_v,
    precio_: price.precio,
    ...product
  });

  // Combinar precios y productos
  const combinedData = precios.map(price => {
    const product = dbProducts.find(product => product.articulo === price.cod_prod);
    return product ? combinePriceAndProduct(price, product) : null;
  }).filter(data => data !== null);

  async function submitedData(data) {
    console.log(data)
    try {
      const formData = new FormData();

      formData.append("nombre", data.nombre);
      formData.append("archivo", data.archivo[0]);


      const response = await axios.post(`${URL}/price`, formData)
      setPrecios(response.data.data)

      const respuesta = await axios.get(`${URL}/products?&limit=1000`);
      const products = respuesta.data.products;
      setDbProducts(products);



      Swal.fire({
        title: "Planilla Subida",
        text: `Se cargo el aechivo correctamente`,
        icon: "success"
      });

      return;

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="main-container form">
      {console.log(combinedData)}
      <div className="input-form">
        <h2 className="input-title">
          Precios
        </h2>
        <form action="users-form" onSubmit={handleSubmit(submitedData)} encType="multipart/form-data" >
          <div className="main-input">
            <div className="form-group">
              <input id="nombre" type="text" className="form-input" placeholder=" " {...register("nombre")} />
              <label className="form-lbl" htmlFor="nombre">Nombre</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="archivo" type="file" className="form-input" placeholder=" " {...register("archivo")} />
              <label className="form-lbl" htmlFor="archivo">Archivo</label>
              <span className="form-line"></span>
            </div>

          </div>
          <div className="btn-submit">
            <button type="submit" className="btn-form btn-create" >
              Subir
            </button>
          </div>
        </form >
      </div>
      <div className="main-table">
        <table className="price-table">
          <thead>
            <tr>
              <th className='th1'>Articulo</th>
              <th className='th2'>Descripcion</th>
              <th className='th3'>Precio</th>
              <th className='th3'>Bulto</th>
              <th className='th3'>Lista</th>
              <th className='th4'>Precio Actual</th>
              <th className='th2'>Producto</th>
            </tr>
          </thead>
          <tbody>
            {
              combinedData.map(price => (
                <tr key={price.articulo}>
                  <td className="col-01">{price.cod_prod}</td>
                  <td className="col-02">{price.Descripcion}</td>
                  <td className="col-03">{price.precio_}</td>
                  <td className="col-03">{price.bulto}</td>
                  <td className="col-03">{(price.precio_ / price.bulto).toFixed(2)}</td>
                  <td className="col-04">{price.precio}</td>
                  <td className="col-05">{price.descripcion}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>
    </div >
  )
}

