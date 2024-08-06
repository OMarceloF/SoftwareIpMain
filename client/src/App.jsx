import './App.css'
import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Review from './Components/Dashboard/Review/Review'
import Aulas from './Components/Dashboard/Review/Components/Aulas'
import Diario from './Components/Dashboard/Review/Components/Diario'
import Planos from './Components/Dashboard/Review/Components/Planos'
import Propostas from './Components/Dashboard/Review/Components/Propostas'
import Inventario from './Components/Dashboard/Review/Components/Inventario'
import Contato from './Components/Dashboard/Review/Components/Contato'
import Guide from './Components/Dashboard/Review/Components/Guide'
import Feira from './Components/Dashboard/Review/Components/Feira'
import Unidades from './Components/Dashboard/Unidades/Unidades'
import CriarUnidades from './Components/Dashboard/Unidades/Components/CriarUnidades'
import DashboardGraph from './Components/Dashboard/Dashboard/DashboardGraph'
import EscolherUnidade from './Components/Dashboard/Dashboard/EscolherUnidade'
import ReviewCoordenadores from './Components/Dashboard/Review/ReviewCoordenadores'
import EscolherCoordenador from './Components/Dashboard/Review/EscolherCoordenador'
import AulaCor from './Components/Dashboard/Review/ComponentsCor/AulaCor'
import ContatoCor from './Components/Dashboard/Review/ComponentsCor/ContatoCor'
import DiariosCor from './Components/Dashboard/Review/ComponentsCor/DiariosCor'
import FeiraCor from './Components/Dashboard/Review/ComponentsCor/FeiraCor'
import FotosEVideosCor from './Components/Dashboard/Review/ComponentsCor/FotosEVideosCor'
import GuideCor from './Components/Dashboard/Review/ComponentsCor/GuideCor'
import PlanosDeAula from './Components/Dashboard/Review/ComponentsCor/PlanosDeAulaCor'
import PropostasCor from './Components/Dashboard/Review/ComponentsCor/PropostasCor'
import DashboardEscolha from './Components/Dashboard/Review/DashboardEscolha'
import DashboardGraphCor from './Components/Dashboard/Dashboard/DashboardGraphCor'

// Importando React Router DOM
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import FotosEVideos from './Components/Dashboard/Review/Components/FotosEVideos'

// Criando uma rota
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: 'review',
        element: <Review />,
        children: [
          {
            path: 'planosDeAula',
            element: <Planos />
          },
          {
            path: 'aulas',
            element: <Aulas />
          },
          {
            path: 'diario',
            element: <Diario />
          },
          {
            path: 'fotosEVideos',
            element: <FotosEVideos />
          },
          {
            path: 'propostas',
            element: <Propostas />
          },
          {
            path: 'inventario',
            element: <Inventario />
          },
          {
            path: 'contato',
            element: <Contato />
          },
          {
            path: 'guide',
            element: <Guide />
          },
          {
            path: 'feira',
            element: <Feira />
          }
        ]
      },
      {
        path: 'escolherCoordenador',
        element: <EscolherCoordenador />,
        children: [
          {
            path: 'reviewCoordenadores',
            element: <ReviewCoordenadores />,
            children: [
              {
                path: 'aulaCor',
                element: <AulaCor />
              },
              {
                path: 'contatoCor',
                element: <ContatoCor />
              },
              {
                path: 'diariosCor',
                element: <DiariosCor />
              },
              {
                path: 'feiraCor',
                element: <FeiraCor />
              },
              {
                path: 'fotosEVideosCor',
                element: <FotosEVideosCor />
              },
              {
                path: 'guideCor',
                element: <GuideCor />
              },
              {
                path: 'planosDeAulaCor',
                element: <PlanosDeAula />
              },
              {
                path: 'propostasCor',
                element: <PropostasCor />
              }
            ]
          },
        ]
      },
      {
        path: 'dashboardEscolha',
        element: <DashboardEscolha />,
        children: [
          {
            path: 'escolherUnidade',
            element: <EscolherUnidade />,
            children: [
              {
                path: 'dashboardGraph',
                element: <DashboardGraph />
              },
            ]
          },
          {
            path: 'dashboardGraphCor',
            element: <DashboardGraphCor />
          }
        ]
      },
      {
        path: 'unidades',
        element: <Unidades />,
        children: [
          {
            path: 'criarunidade',
            element: <CriarUnidades />
          }
        ]
      }
    ]
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
