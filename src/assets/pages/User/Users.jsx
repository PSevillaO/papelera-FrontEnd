
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import './Users.css'
import { UsersTable } from "./UsersTable";


const URL = import.meta.env.VITE_SERVER_URL;

export default function Users() {
  const { register, handleSubmit, setValue } = useForm();
  const [userId, setUserId] = useState()
  const [dbUsers, setdbUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    getUsers();
  }, [limit]) // eslint-disable-line react-hooks/exhaustive-deps


  async function getUsers(page = 0) {
    try {
      const response = await axios.get(`${URL}/users?page=${page}&limit=${limit}`);
      const users = response.data.users;
      const total = response.data.total

      setdbUsers(users);
      setTotal(total);

    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "No se pudieron obtener los Usuarios",
        icon: 'error'
      })
    }
  }

  async function submitedData(data) {
    try {
      const formData = new FormData();

      formData.append("nombre", data.nombre);
      formData.append("email", data.email);
      formData.append("role", data.role);

      // si estamos creando un usuario
      if (!userId) {
        formData.append("password", data.password)
      }

      // Si estoy editando hace un put 
      if (userId) {

        const response = await axios.put(`${URL}/users/${userId}`, formData)


        Swal.fire({
          title: "Usuario Editado",
          text: `El Usuario ${response.data.users?.nombre} fue editado correctamente`,
          icon: "success"
        });
        getUsers();
        setUserId(null);
        setFormValue();
        return;
      }
      // Si no edito hago un post 

      const response = await axios.post(`${URL}/users/`, formData);

      console.log(response)
      Swal.fire({
        title: "Usuario Creado",
        text: `El Usuario ${response.data.users?.nombre} fue creado correctamente`,
        icon: "success"
      });
      getUsers();
      setFormValue();
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "No se creo el Usuario",
        text: "Alguno de los datos ingresados no son correctos",
        icon: "error"
      });
    }
  }

  function setFormValue(user) {
    setUserId(user?._id || null)

    setValue("nombre", user?.nombre || "")
    setValue("email", user?.email || "")
    setValue("role", user?.role || "USER_ROLE")
    setValue("password", user?.password || "")

  }

  async function deleteUsers(id) {
    Swal.fire({
      title: "Desea borrar el Usuario",
      text: "Realmente desea borrar el Usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar"
    }).then(async function (resultado) {
      try {
        if (resultado.isConfirmed) {
          const response = await axios.delete(`${URL}/users/${id}`)
          Swal.fire({
            title: "Usuario Borrado",
            text: `El Usuario ${response.data.users?.nombre} fue borrado correctamente`,
            icon: "success"
          }
          )
          getUsers();
        }
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: "Error al borrar el Usuario",
          text: `El Usuario no pudo ser borrado`,
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
        return getUsers();
      }
      const response = await axios.get(`${URL}/users/search/${search}`)
      const users = response.data.users;
      setdbUsers(users);
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className="main-container form">
      <div className="input-form">
        <h2 className="input-title">
          Clientes
          {userId && (
            <button className="btn-salir" onClick={() => setFormValue()}>
              <span className="fa-solid fa-xmark" aria-hidden="true"></span>
            </button>
          )}
        </h2>
        <form action="users-form" onSubmit={handleSubmit(submitedData)} encType="multipart/form-data" >
          <div className="main-input">
            <div className="form-group">
              <input id="nombre" type="text" className="form-input" placeholder=" " {...register("nombre")} />
              <label className="form-lbl" htmlFor="nombre">Nombre</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="email" type="email" className="form-input" placeholder=" " {...register("email")} />
              <label className="form-lbl" htmlFor="email">E-mail</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="password" type="password" className="form-input" disabled={userId} placeholder=" " {...register("password")} />
              <label className="form-lbl" htmlFor="password">Password</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <select title="Elija un role" id="role" className="form-input" placeholder=" " {...register("role")}>
                <option value="USER_ROLE">Usuario</option>
                <option value="CLIENT_ROLE">Cliente</option>
                <option value="ADMIN_ROLE">Administrador</option>
              </select>
              <label className="form-lbl" htmlFor="role">Role</label>
              <span className="form-line"></span>
            </div>
          </div>
          <div className="btn-submit">
            <button type="submit" className={userId ? "btn-form btn-Edit" : "btn-form btn-create"} >
              {
                userId ? "Editar" : "Crear"
              }
            </button>
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
        <UsersTable users={dbUsers} deleteUsers={deleteUsers} setFormValue={setFormValue} />
        <div className="pagination-container">
          <div className="page-container">
            {Array.from({ length: Math.ceil(total / limit) }).map((_, idx) => (
              <button key={idx} onClick={() => getUsers(idx)}>
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

