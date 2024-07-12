import React, {useState} from "react";
import './Register.css';
import '../../App.css';
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';

// Importando Assets
import video from '../../LoginAssets/videoFundo.mp4';
import logo from '../../LoginAssets/logoIPSemFundo.png';

// Importando Icones
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import { FaUser } from "react-icons/fa";

const Register = () => {
  // UseState para armazenar os inputs
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigateTo = useNavigate()

  const createUser = (e) => {
    e.preventDefault()
    // Pedindo ao Axios para criar uma API e conectar ao servidor
    Axios.post('http://localhost:3002/register', {
      // criando variaveis para enviar ao servidor
      Email: email,
      UserName: userName,
      Password: password
    }).then(() => {
      // Redirecionar para a pag de login
      navigateTo('/')

      // Limpar os campos
      setEmail('')
      setUserName('')
      setPassword('')
    })
  }

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">O Futuro da Educação Tecnológica</h2>
            <p>Lorem ipsum dolor sit amet.</p>
          </div>

          <div className="footerDiv flex">
            <span className="text">Quer Logar?</span>
            <Link to={'/'}>
            <button className="btn">Entrar</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo" />
            <h3>Registre uma conta</h3>
          </div>

          <form className="form grid">
            <div className="inputDiv">
              <label htmlFor="name">Nome</label>
              <div className="input flex">
                <FaUser className="icon"/>
                <input type="name" id="name" placeholder="Digite o nome" onChange={(event) =>{
                  setUserName(event.target.value)
                }} />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="email">E-mail</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input type="text" id="email" placeholder="Digite o email" onChange={(event) =>{
                  setEmail(event.target.value)
                }} />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Senha</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon' />
                <input type="password" id="password" placeholder="Digite a Senha" onChange={(event) =>{
                  setPassword(event.target.value)
                }} />
              </div>
            </div>

            <button type="submit" className="btn flex" onClick={createUser}>
              <span>Registro</span>
              <AiOutlineSwapRight className='icon' />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;