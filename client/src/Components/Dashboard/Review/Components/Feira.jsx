import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Feira.css';
import axios from 'axios';

const Feira = () => {
    const [unidade, setUnidade] = useState('');
    const [cronograma, setCronograma] = useState('');
    const [estrutural, setEstrutural] = useState('');
    const [apresentacao, setApresentacao] = useState('');
    const [observacoes, setObservacoes] = useState('');
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
        axios.get(`https://softwareipmain-production.up.railway.app/getUsername/${email}`)
            .then(response => {
                const nomeCoordenador = response.data.name;
                setCoordenador(nomeCoordenador);

                // Buscar as unidades e filtrar apenas as que pertencem ao coordenador logado
                axios.get('https://softwareipmain-production.up.railway.app/unidades')
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
        const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

        if (!unidade || !cronograma || !estrutural || !apresentacao || !observacoes) {
            setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return;
        }

        setErrorMessage('');

        const formData = {
            date: currentDate,  // 🔹 Agora a data é adicionada automaticamente
            unidade,
            cronograma,
            estrutural,
            apresentacao,
            comentarios: observacoes
        };

        axios.post('https://softwareipmain-production.up.railway.app/feira', formData)
            .then(() => {
                setSuccessMessage('Dados enviados com sucesso!');
                
                // 🔹 Resetando corretamente os campos do formulário
                setUnidade('');
                setCronograma('');
                setEstrutural('');
                setApresentacao('');
                setObservacoes('');

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
                    <label htmlFor="unidade">Unidade:</label>
                    <select
                        id="unidade"
                        value={unidade}
                        onChange={(e) => setUnidade(e.target.value)}
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
                                checked={cronograma === 'Sim'}
                                onChange={(e) => setCronograma(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={cronograma === 'Não'}
                                onChange={(e) => setCronograma(e.target.value)}
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
                                checked={estrutural === 'Sim'}
                                onChange={(e) => setEstrutural(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={estrutural === 'Não'}
                                onChange={(e) => setEstrutural(e.target.value)}
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
                                checked={apresentacao === 'Sim'}
                                onChange={(e) => setApresentacao(e.target.value)}
                            />
                            Sim
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Não"
                                checked={apresentacao === 'Não'}
                                onChange={(e) => setApresentacao(e.target.value)}
                            />
                            Não
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="observacoes">Observações</label>
                    <input
                        type="text"
                        id="observacoes"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                    />
                </div>

                <button type="submit">Enviar</button>
            </form>
        </>
    );
};

export default Feira;
