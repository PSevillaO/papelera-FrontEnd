
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import './Customers.css'
import { CustomersTable } from "./CustomersTable";


const URL = import.meta.env.VITE_SERVER_URL;

export default function Customers() {
  const { register, handleSubmit, setValue } = useForm();
  const [customerId, setCustomerId] = useState()
  const [dbCustomers, setdbCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    getCustomers();
  }, [limit]) // eslint-disable-line react-hooks/exhaustive-deps


  async function getCustomers(page = 0) {
    try {
      const response = await axios.get(`${URL}/customers?page=${page}&limit=${limit}`);
      const customers = response.data.customers;
      const total = response.data.total

      setdbCustomers(customers);
      setTotal(total);

    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "No se pudieron obtener los Proveedores",
        icon: 'error'
      })
    }
  }

  async function submitedData(data) {
    try {
      const formData = new FormData();

      formData.append("nombre", data.nombre);
      formData.append("razon_social", data.razon_social);
      formData.append("direccion", data.direccion);
      formData.append("cuit", data.cuit);
      formData.append("horario", data.horario);
      formData.append("telefono", data.telefono);
      formData.append("email", data.email);
      formData.append("obs", data.obs);

      // Si estoy editando hace un put 
      if (customerId) {

        const response = await axios.put(`${URL}/customers/${customerId}`, formData)


        Swal.fire({
          title: "Proveedor Editado",
          text: `El Proveedor ${response.data.customers?.nombre} fue editado correctamente`,
          icon: "success"
        });
        getCustomers();
        setCustomerId(null);
        setFormValue();
        return;
      }
      // Si no edito hago un post 

      const response = await axios.post(`${URL}/customers/`, formData);

      console.log(response)
      Swal.fire({
        title: "Proveedor Creado",
        text: `El Proveedor ${response.data.customers?.nombre} fue creado correctamente`,
        icon: "success"
      });
      getCustomers();
      setFormValue();
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "No se creo el Proveedor",
        text: "Alguno de los datos ingresados no son correctos",
        icon: "error"
      });
    }
  }

  function setFormValue(customer) {
    setCustomerId(customer?._id || null)

    setValue("nombre", customer?.nombre || "")
    setValue("razon_social", customer?.razon_social || "")
    setValue("direccion", customer?.direccion || "")
    setValue("cuit", customer?.cuit || "")
    setValue("horario", customer?.horario || "")
    setValue("telefono", customer?.telefono || "")
    setValue("email", customer?.email || "")
    setValue("obs", customer?.obs || "")

  }

  async function deleteCustomers(id) {
    Swal.fire({
      title: "Desea borrar el Proveedor",
      text: "Realmente desea borrar el Proveedor",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar"
    }).then(async function (resultado) {
      try {
        if (resultado.isConfirmed) {
          const response = await axios.delete(`${URL}/customers/${id}`)
          Swal.fire({
            title: "Proveedor Borrado",
            text: `El Proveedor ${response.data.customers?.nombre} fue borrado correctamente`,
            icon: "success"
          }
          )
          getCustomers();
        }
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: "Error al borrar el proveedor",
          text: `El proveedor no pudo ser borrado`,
          icon: "error"
        })
      }
    }
    )
  }


  async function handleSearch(e) {
    try {
      const search = e.target.value
      if (search.length <= 2) {
        return getCustomers();
      }
      const response = await axios.get(`${URL}/customers/search/${search}`)
      const customers = response.data.customers;
      setdbCustomers(customers);
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="main-container form">
      <div className="input-form">
        <h2 className="input-title">
          Clientes
          {customerId && (
            <button className="btn-salir" onClick={() => setFormValue()}>
              <span className="fa-solid fa-xmark" aria-hidden="true"></span>
            </button>
          )}
        </h2>
        <form action="customers-form" onSubmit={handleSubmit(submitedData)} encType="multipart/form-data" >
          <div className="main-input">
            <div className="form-group">
              <input id="nombre" type="text" className="form-input" placeholder=" " {...register("nombre")} />
              <label className="form-lbl" htmlFor="nombre">Nombre</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="razon_social" type="text" className="form-input" placeholder=" " {...register("razon_social")} />
              <label className="form-lbl" htmlFor="razon_social">Razon Social</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="direccion" type="text" className="form-input" placeholder=" "  {...register("direccion")} />
              <label className="form-lbl" htmlFor="direccion">Direccion</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="cuit" type="text" className="form-input" placeholder=" " {...register("cuit")} />
              <label className="form-lbl" htmlFor="cuit">CUIT</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="horario" type="text" className="form-input" placeholder=" " {...register("horario")} />
              <label className="form-lbl" htmlFor="horario">Horario</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="telefono" type="text" className="form-input" placeholder=" "  {...register("telefono")} />
              <label className="form-lbl" htmlFor="telefono">Telefono</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="email" type="email" className="form-input" placeholder=" " {...register("email")} />
              <label className="form-lbl" htmlFor="email">E-mail</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="obs" type="text" className="form-input" placeholder=" " {...register("obs")} />
              <label className="form-lbl" htmlFor="obs">Obs</label>
              <span className="form-line"></span>
            </div>

          </div>

          <div className="btn-submit">

            <button type="submit" className={customerId ? "btn-form btn-Edit" : "btn-form btn-create"} >
              {
                customerId ? "Editar" : "Crear"
              }</button>
          </div>
        </form >
      </div>
      <div className="main-table">
        <div className="flex-between">
          <i className="fa-solid fa-magnifying-glass"></i>
          <div className="input-group input-search">
            <input type="text" onKeyUp={handleSearch} />
          </div>
        </div>
        <CustomersTable customers={dbCustomers} deleteCustomers={deleteCustomers} setFormValue={setFormValue} />
        <div className="pagination-container">
          <div className="page-container">
            {Array.from({ length: Math.ceil(total / limit) }).map((_, idx) => (
              <button key={idx} onClick={() => getCustomers(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="limit-container">
            <select className="selc" onChange={(e) => setLimit(e.target.value)}>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    </div >
  )
}

