import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Feira.css';
import axios from 'axios';

const Feira = () => {
    const [unit, setUnit] = useState('');
    const [textQuestion1, setTextQuestion1] = useState('');
    const [textQuestion2, setTextQuestion2] = useState('');
    const [textQuestion3, setTextQuestion3] = useState('');
    const [textQuestion4, setTextQuestion4] = useState('');
    const [yesNoQuestion, setYesNoQuestion] = useState('');
    const [unidades, setUnidades] = useState([]);
    const [coordenador, setCoordenador] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Obtendo o email do usuário logado
    const email = localStorage.getItem('emailStorage');

    useEffect(() => {
        if (!email) {
            setErrorMessage('Usuário não autenticado.');
            return;
        }

        // Buscar o nome do coordenador com base no email
        axios.get(`http://localhost:3002/getUsername/${email}`)
            .then(response => {
                const nomeCoordenador = response.data.name;
                setCoordenador(nomeCoordenador);

                // Buscar as unidades e filtrar apenas as que pertencem ao coordenador logado
                axios.get('http://localhost:3002/unidades')
                    .then(response => {
                        const unidadesFiltradas = response.data.filter(unidade => unidade.coordenador === nomeCoordenador);
                        setUnidades(unidadesFiltradas);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar unidades:', error);
                    });
            })
            .catch(error => {
                console.error('Erro ao obter coordenador:', error);
            });
    }, [email]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!unit || !textQuestion1 || !textQuestion2 || !textQuestion3 || !textQuestion4) {
            setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return;
        }

        setErrorMessage('');

        const formData = {
            unit,
            textQuestion1,
            textQuestion2,
            textQuestion3,
            textQuestion4,
            yesNoQuestion
        };

        axios.post('http://localhost:3002/inventario', formData)
            .then(() => {
                setSuccessMessage('Dados enviados com sucesso!');
                setUnit('');
                setTextQuestion1('');
                setTextQuestion2('');
                setTextQuestion3('');
                setTextQuestion4('');
                setYesNoQuestion('');

                setTimeout(() => {
                    setSuccessMessage('');
                }, 4000);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
    };

    return (
        <>
            <h2>Acompanhamento de Feiras</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="unit">Unidade:</label>
                    <select
                        id="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        <option value="">Selecione uma unidade</option>
                        {unidades.map((unidade, index) => (
                            <option key={index} value={unidade.cidade}>{unidade.cidade}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Cronograma</label>
                    <div className='inputsInventario'>
                        <label>
                            <input
                                type="radio"
                                value="Sim"
                                checked={textQuestion1 === 'Sim'}
                                onChange={(e) => setTextQuestion1(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={textQuestion1 === 'Não'}
                                onChange={(e) => setTextQuestion1(e.target.value)}
                            />
                            Não
                        </label>
                    </div>
                </div>

                <div>
                    <label>Estrutural</label>
                    <div className='inputsInventario'>
                        <label>
                            <input
                                type="radio"
                                value="Sim"
                                checked={textQuestion2 === 'Sim'}
                                onChange={(e) => setTextQuestion2(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={textQuestion2 === 'Não'}
                                onChange={(e) => setTextQuestion2(e.target.value)}
                            />
                            Não
                        </label>
                    </div>
                </div>

                <div>
                    <label>Apresentação</label>
                    <div className='inputsInventario'>
                        <label>
                            <input
                                type="radio"
                                value="Sim"
                                checked={textQuestion3 === 'Sim'}
                                onChange={(e) => setTextQuestion3(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={textQuestion3 === 'Não'}
                                onChange={(e) => setTextQuestion3(e.target.value)}
                            />
                            Não
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="textQuestion4">Observações</label>
                    <input
                        type="text"
                        id="textQuestion4"
                        value={textQuestion4}
                        onChange={(e) => setTextQuestion4(e.target.value)}
                    />
                </div>

                <button type="submit">Enviar</button>
            </form>
        </>
    );
};

export default Feira;
