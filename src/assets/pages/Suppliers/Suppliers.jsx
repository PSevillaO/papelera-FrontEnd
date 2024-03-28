
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import './Suppliers.css'
import { SuppliersTable } from "./SuppliersTable";


const URL = import.meta.env.VITE_SERVER_URL;

export default function Suppliers() {
  const { register, handleSubmit, setValue } = useForm();
  const [supplierId, setSupplierId] = useState()
  const [dbSuppliers, setdbSuppliers] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    getSuppliers();
  }, [limit]) // eslint-disable-line react-hooks/exhaustive-deps


  async function getSuppliers(page = 0) {
    try {
      const response = await axios.get(`${URL}/suppliers?page=${page}&limit=${limit}`);
      const suppliers = response.data.suppliers;
      const total = response.data.total

      setdbSuppliers(suppliers);
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
      formData.append("direccion", data.direccion);
      formData.append("telefono", data.telefono);
      formData.append("email", data.email);


      // Si estoy editando hace un put 
      if (supplierId) {

        const response = await axios.put(`${URL}/suppliers/${supplierId}`, formData)


        Swal.fire({
          title: "Proveedor Editado",
          text: `El Proveedor ${response.data.suppliers?.nombre} fue editado correctamente`,
          icon: "success"
        });
        getSuppliers();
        setSupplierId(null);
        setFormValue();
        return;
      }
      // Si no edito hago un post 

      const response = await axios.post(`${URL}/suppliers/`, formData);

      console.log(response)
      Swal.fire({
        title: "Proveedor Creado",
        text: `El Proveedor ${response.data.suppliers?.nombre} fue creado correctamente`,
        icon: "success"
      });
      getSuppliers();
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

  function setFormValue(supplier) {
    setSupplierId(supplier?._id || null)

    setValue("nombre", supplier?.nombre || "")
    setValue("direccion", supplier?.direccion || "")
    setValue("telefono", supplier?.telefono || "")
    setValue("email", supplier?.email || "")

  }

  async function deleteSuppliers(id) {
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
          const response = await axios.delete(`${URL}/suppliers/${id}`)
          Swal.fire({
            title: "Proveedor Borrado",
            text: `El Proveedor ${response.data.suppliers?.nombre} fue borrado correctamente`,
            icon: "success"
          }
          )
          getSuppliers();
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
        return getSuppliers();
      }
      const response = await axios.get(`${URL}/suppliers/search/${search}`)
      const suppliers = response.data.suppliers;
      setdbSuppliers(suppliers);
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="main-container form">
      <div className="input-form">
        <h2 className="input-title">
          Proveedores
          {supplierId && (
            <button className="btn-salir" onClick={() => setFormValue()}>
              <span className="fa-solid fa-xmark" aria-hidden="true"></span>
            </button>
          )}
        </h2>
        <form action="suppliers-form" onSubmit={handleSubmit(submitedData)} encType="multipart/form-data" >
          <div className="main-input">
            <div className="form-group">
              <input id="nombre" type="text" className="form-input" placeholder=" " {...register("nombre")} />
              <label className="form-lbl" htmlFor="nombre">Nombre</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="direccion" type="text" className="form-input" placeholder=" "  {...register("direccion")} />
              <label className="form-lbl" htmlFor="direccion">Direccion</label>
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
          </div>

          <div className="btn-submit">

            <button type="submit" className={supplierId ? "btn-form btn-Edit" : "btn-form btn-create"} >
              {
                supplierId ? "Editar" : "Crear"
              }</button>
          </div>
        </form >
      </div>
      <div className="main-table">
        <div className="flex-between">
          {/* <h2>Tabla de usuario</h2> */}
          <i className="fa-solid fa-magnifying-glass"></i>
          <div className="input-group input-search">
            <input type="text" onKeyUp={handleSearch} />
          </div>
        </div>
        <SuppliersTable suppliers={dbSuppliers} deleteSuppliers={deleteSuppliers} setFormValue={setFormValue} />
        <div className="pagination-container">
          <div className="page-container">
            {Array.from({ length: Math.ceil(total / limit) }).map((_, idx) => (
              <button key={idx} onClick={() => getSuppliers(idx)}>
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
