import './Login.css';
import { useUser } from '../../context/userContext';


export default function Login() {
  const { login } = useUser()


  function handleSubmit(event) {
    event.preventDefault();
    const el = event.target.elements

    const data = {
      email: el.email.value,
      password: el.password.value
    }

    login(data)
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <div className='main-login'>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Ingresar</h1>
          <label>Email</label>
          <input name='email' type="text" placeholder="Correo electrónico" />

          <label> Password</label>
          <input name='password' type="password" placeholder="Contraseña" />

          <button type="submit" className="button"> Ingresar</button>
        </form>
      </div>
    </div>
  )
}

