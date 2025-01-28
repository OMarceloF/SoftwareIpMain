import React, { useEffect, useState } from "react";
import './Login.css';
import '../../App.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [statusHolder, setStatusHolder] = useState('message');
  const navigateTo = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    // Verificação de campos vazios
    if (!loginEmail || !loginPassword) {
      setLoginStatus('Credenciais não encontradas!');
      return;
    }

    // Pedindo ao Axios para criar uma API e conectar ao servidor
    Axios.post('http://localhost:3002/login', {
      LoginEmail: loginEmail,
      LoginPassword: loginPassword
    }).then((response) => {
      if (response.data.message) {
        // Se as credenciais não baterem
        setLoginStatus(response.data.message); // Mostrar mensagem de erro
      } else {
        // Após o login bem-sucedido, buscar o papel do usuário
        axios.get(`http://localhost:3002/getRole/${loginEmail}`)
          .then(roleResponse => {
            const userRole = roleResponse.data.role; 
            localStorage.setItem('emailStorage', loginEmail); // Salvar email no localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', userRole); // Salva o papel do usuário no localStorage
            navigateTo('/dashboard'); // Entrar para o dashboard
          })
          .catch(error => {
            console.error('Erro ao buscar o role:', error);
          });
      }
    }).catch((error) => {
      setLoginStatus('Dados não encontrados!'); // Mostrar mensagem de erro
    });
  }

  useEffect(() => {
    if (loginStatus !== '') {
      setStatusHolder('showMessage'); // Mostrar mensagem de erro
      setTimeout(() => {
        setStatusHolder('message'); // Esconder mensagem de erro depois de 4s
      }, 4000);
    }
  }, [loginStatus]);

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>

          <div className="textDiv">
            <h2 className="title">O Futuro da Educação Tecnológica</h2>
            <p>Trazendo inovação</p>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo" />
            <h3>Entre em sua conta</h3>
          </div>

          <form className="form grid" onSubmit={loginUser}>
            <span className={statusHolder}>{loginStatus}</span>
            <div className="inputDiv">
              <label htmlFor="email">E-mail</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input type="text" id="email" placeholder="Digite seu email" value={loginEmail} onChange={(event) => {
                  setLoginEmail(event.target.value);
                }} />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Senha</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon' />
                <input type="password" id="password" placeholder="Digite sua Senha" value={loginPassword} onChange={(event) => {
                  setLoginPassword(event.target.value);
                }} />
              </div>
            </div>

            <button type="submit" className="btn flex">
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
