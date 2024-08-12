import './Unidades.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Unidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState(null);
    const [name, setName] = useState('');
    const [userRole, setUserRole] = useState('');

    const location = useLocation();

    useEffect(() => {
        const email = localStorage.getItem('emailStorage');
        const role = localStorage.getItem('role'); // Obter o valor de userRole do localStorage

        console.log('User Role from localStorage:', role); // Log para verificar o valor de userRole

        if (role) {
            setUserRole(role);
        } else {
            setUserRole(''); // Define uma role padrão se não estiver presente
        }

        axios.get('http://localhost:3002/unidades')
            .then(response => {
                const sortedUnidades = response.data.sort((a, b) => a.cidade.localeCompare(b.cidade));
                setUnidades(sortedUnidades);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });

        if (email) {
            axios.get(`http://localhost:3002/getUsername/${email}`)
                .then(response => {
                    setName(response.data.name);
                    localStorage.setItem('nameStorage', response.data.name);
                })
                .catch(error => {
                    console.error('Erro ao buscar o name:', error);
                });
        }
    }, []);

    // Filtro para mostrar apenas as unidades que possuem o mesmo coordenador que o usuário logado, a menos que o userRole seja 'admin'
    const filteredUnidades = unidades.filter(unidade => {
        const matchBySearchTerm = unidade.cidade.toLowerCase().startsWith(searchTerm.toLowerCase());
        const matchByCoordenador = userRole === 'admin' || unidade.coordenador === name;

        console.log('Unidade:', unidade);
        console.log('Match by search term:', matchBySearchTerm);
        console.log('Match by coordenador:', matchByCoordenador);

        return matchBySearchTerm && matchByCoordenador;
    });

    const openModal = (content, unidade) => {
        setModalContent(content);
        setSelectedUnidade(unidade);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent('');
        setSelectedUnidade(null);
    };

    return (
        <>
            {location.pathname === "/dashboard/unidades" ? (
                <>
                    <h2>Unidades</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar unidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <div className="list-container">
                        {filteredUnidades.map((unidade, index) => (
                            <div key={index} className="list-item">
                                <span>{unidade.cidade}</span>
                                <div>
                                    <button
                                        className="info-button"
                                        onClick={() => openModal('informações', unidade)}
                                    >
                                        Informações
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to={"/dashboard/unidades/criarunidade"}><button>Adicionar Nova Unidade</button></Link>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                {modalContent === 'informações' && selectedUnidade && (
                                    <>
                                        <h2>{selectedUnidade.cidade}</h2>
                                        <div className="info-item">
                                            <span>Endereço: {selectedUnidade.endereco}</span>
                                            <span className="edit-icon">✏️</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Telefone de Contato: {selectedUnidade.telefone}</span>
                                            <span className="edit-icon">✏️</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Coordenador: {selectedUnidade.coordenador}</span>
                                            <span className="edit-icon">✏️</span>
                                        </div>
                                    </>
                                )}
                                <button onClick={closeModal}>Fechar</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default Unidades;
