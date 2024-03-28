import { useState } from "react"
import Swal from "sweetalert2"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../assets/context/userContext"
import PropTypes from 'prop-types';

const URL = import.meta.env.VITE_SERVER_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    return savedUser || null;
  });
  const [admin, setAdmin] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    return savedUser?.role === "ADMIN_ROLE"
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });


  const navigate = useNavigate();

  async function login(data) {
    try {
      const response = await axios.post(`${URL}/login`, data)
      const { token, user } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("currentUser", JSON.stringify(user))

      const isAdmin = user.role === "ADMIN_ROLE"
      setAdmin(isAdmin)
      setUser(user);
      setToken(token);

      Swal.fire({
        title: 'Login Correcto',
        text: 'Sera redireccionado en breve',
        icon: 'success',
        timer: 1500
      }).then(() => {
        navigate("/")
      })

    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "Error al ingresar",
        text: "Alguno de los datos ingresados no son correctos",
        icon: "error"
      })
    }

  }

  function logout() {
    Swal.fire({
      title: "Logout",
      text: "Se deslogueo correctamente!",
      icon: "success",
      timer: 1000
    }
    ).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('order');
      setUser(null);
      navigate("/");
    });
  }

  return (
    <UserContext.Provider value={{ user, admin, token, login, logout }}>
      {children}
    </UserContext.Provider>
  )

}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};