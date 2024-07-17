import React, { useEffect, useState } from "react";
import './Login.css';
import '../../App.css';
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

// Importando Assets
import video from '../../LoginAssets/videoFundo.mp4';
import logo from '../../LoginAssets/logoIPSemFundo.png';

// Importando Icones
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

const Login = () => {
  // UseState
  const [loginEmail, loginSetEmail] = useState('')
  const [loginPassword, loginSetPassword] = useState('')
  const navigateTo = useNavigate()

  // Função para mostrar mensagem de erro
  const [loginStatus, setLoginStatus] = useState('')
  const [statusHolder, setstatusHolder] = useState('message')

  const loginUser = (e) => {
    // Prever erros
    e.preventDefault()
    // Pedindo ao Axios para criar uma API e conectar ao servidor
    Axios.post('http://localhost:3002/login', {
      // criando variaveis para enviar ao servidor
      LoginEmail: loginEmail,
      LoginPassword: loginPassword
    }).then((response) => {
      console.log()
      if(response.data.message || loginEmail === '' || loginPassword === ''){
        // Se as credenciais não baterem
        navigateTo('/') // Recarregar na pag de login
        setLoginStatus('Credenciais não encontradas!') // Mostrar mensagem de erro
      }
      else {
        navigateTo('/dashboard') // Entrar para o dashboard
      }
    })
  }

  useEffect(() => {
    if(loginStatus !== ''){
      setstatusHolder('showMessage') // Mostrar mensagem de erro
      setTimeout(() => {
        setstatusHolder('message') // Esconder mensagem de erro depois de 4s
      }, 4000)
    }
  }, [loginStatus])

  // Limpar o formulário depois de clicar em enviar
  const onSubmit = () => {
    loginSetEmail('')
    loginSetPassword('')
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
            <span className="text">Criar Novas Contas</span>
            <Link to={'/register'}>
            <button className="btn">Registrar</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo" />
            <h3>Entre em sua conta</h3>
          </div>

          <form className="form grid" onSubmit={onSubmit}>
            <span className={statusHolder}>{loginStatus}</span>
            <div className="inputDiv">
              <label htmlFor="email">E-mail</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input type="text" id="email" placeholder="Digite seu email" onChange={(event) => {
                  loginSetEmail(event.target.value)
                }}/>
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Senha</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon' />
                <input type="password" id="password" placeholder="Digite sua Senha" onChange={(event) => {
                  loginSetPassword(event.target.value)
                }} />
              </div>
            </div>

            <button type="submit" className="btn flex" onClick={loginUser}>
              <span>Entrar</span>
              <AiOutlineSwapRight className='icon' />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; 