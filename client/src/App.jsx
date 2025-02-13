import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import Review from './Components/Dashboard/Review/Review';
import Aulas from './Components/Dashboard/Review/Components/Aulas';
import Diario from './Components/Dashboard/Review/Components/Diario';
import Planos from './Components/Dashboard/Review/Components/Planos';
import Propostas from './Components/Dashboard/Review/Components/Propostas';
import Inventario from './Components/Dashboard/Review/Components/Inventario';
import Contato from './Components/Dashboard/Review/Components/Contato';
import Guide from './Components/Dashboard/Review/Components/Guide';
import Feira from './Components/Dashboard/Review/Components/Feira';
import Unidades from './Components/Dashboard/Unidades/Unidades';

import Historico from './Components/Dashboard/Historico/Historico';

import HistoricoCor from './Components/Dashboard/Historico/HistoricoCor';
import CriarUnidades from './Components/Dashboard/Unidades/Components/CriarUnidades';
import DashboardGraph from './Components/Dashboard/Dashboard/DashboardGraph';
import EscolherUnidade from './Components/Dashboard/Dashboard/EscolherUnidade';
import ReviewCoordenadores from './Components/Dashboard/Review/ReviewCoordenadores';
import EscolherCoordenador from './Components/Dashboard/Review/EscolherCoordenador';

import EscolherCoordenadorCor from './Components/Dashboard/Historico/EscolhaCoordenadorCor';

import AulaCor from './Components/Dashboard/Review/ComponentsCor/AulaCor';
import ContatoCor from './Components/Dashboard/Review/ComponentsCor/ContatoCor';
import DiariosCor from './Components/Dashboard/Review/ComponentsCor/DiariosCor';
import FeiraCor from './Components/Dashboard/Review/ComponentsCor/FeiraCor';
import FotosEVideosCor from './Components/Dashboard/Review/ComponentsCor/FotosEVideosCor';
import GuideCor from './Components/Dashboard/Review/ComponentsCor/GuideCor';
import PlanosDeAula from './Components/Dashboard/Review/ComponentsCor/PlanosDeAulaCor';
import PropostasCor from './Components/Dashboard/Review/ComponentsCor/PropostasCor';
import DashboardEscolha from './Components/Dashboard/Review/DashboardEscolha';
import DashboardGraphCor from './Components/Dashboard/Dashboard/DashboardGraphCor';
import FotosEVideos from './Components/Dashboard/Review/Components/FotosEVideos';

// Importando React Router DOM
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import ProtectedRoute from './Components/ProtectedRoute'; // Importar o componente ProtectedRoute

// Criando uma rota
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute element={Dashboard} allowedRoles={['user', 'admin', 'supervisor', 'dev']} />,
    children: [
      {
        path: 'review',
        element: <ProtectedRoute element={Review} allowedRoles={['user', 'dev']} />,
        children: [
          {
            path: 'planosDeAula',
            element: <ProtectedRoute element={Planos} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'aulas',
            element: <ProtectedRoute element={Aulas} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'diario',
            element: <ProtectedRoute element={Diario} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'fotosEVideos',
            element: <ProtectedRoute element={FotosEVideos} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'propostas',
            element: <ProtectedRoute element={Propostas} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'inventario',
            element: <ProtectedRoute element={Inventario} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'contato',
            element: <ProtectedRoute element={Contato} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'guide',
            element: <ProtectedRoute element={Guide} allowedRoles={['user', 'dev']} />
          },
          {
            path: 'feira',
            element: <ProtectedRoute element={Feira} allowedRoles={['user', 'dev']} />
          }
        ]
      },
      {
        path: 'escolherCoordenador',
        element: <ProtectedRoute element={EscolherCoordenador} allowedRoles={['supervisor', 'dev']} />,
        children: [
          {
            path: 'reviewCoordenadores',
            element: <ProtectedRoute element={ReviewCoordenadores} allowedRoles={['supervisor', 'dev']} />,
            children: [
              {
                path: 'aulaCor',
                element: <ProtectedRoute element={AulaCor} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'contatoCor',
                element: <ProtectedRoute element={ContatoCor} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'diariosCor',
                element: <ProtectedRoute element={DiariosCor} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'feiraCor',
                element: <ProtectedRoute element={FeiraCor} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'fotosEVideosCor',
                element: <ProtectedRoute element={FotosEVideosCor} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'guideCor',
                element: <ProtectedRoute element={GuideCor} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'planosDeAulaCor',
                element: <ProtectedRoute element={PlanosDeAula} allowedRoles={['supervisor', 'dev']} />
              },
              {
                path: 'propostasCor',
                element: <ProtectedRoute element={PropostasCor} allowedRoles={['supervisor', 'dev']} />
              }
            ]
          }
        ]
      },
      {
        path: 'dashboardEscolha',
        element: <ProtectedRoute element={DashboardEscolha} allowedRoles={['dev', 'admin']} />,
        children: [
          {
            path: 'escolherUnidade',
            element: <ProtectedRoute element={EscolherUnidade} allowedRoles={['dev', 'admin']} />,
            children: [
              {
                path: 'dashboardGraph',
                element: <ProtectedRoute element={DashboardGraph} allowedRoles={['dev', 'admin']} />
              },
            ]
          },
          {
            path: 'dashboardGraphCor',
            element: <ProtectedRoute element={DashboardGraphCor} allowedRoles={['dev', 'admin']} />
          }
        ]
      },
      {
        path: 'historico',
        element: <ProtectedRoute element={Historico} allowedRoles={['user', 'dev']} />
      },
      {
        path: 'historicoCor',
        element: <ProtectedRoute element={HistoricoCor} allowedRoles={['supervisor']} />
      },
      {
        path: 'escolherCoordenadorCor',
        element: <ProtectedRoute element={EscolherCoordenadorCor} allowedRoles={['supervisor', 'dev']}/>,
        children: [
          {
            path: 'historicoCor',
            element: <ProtectedRoute element={HistoricoCor} allowedRoles={['supervisor', 'dev']}/>
          }
        ]
      },
      {
        path: 'unidades',
        element: <ProtectedRoute element={Unidades} allowedRoles={['admin', 'user', 'dev']} />,
        children: [
          {
            path: 'criarunidade',
            element: <ProtectedRoute element={CriarUnidades} allowedRoles={['admin', 'dev']} />
          }
        ]
      }
    ]
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
