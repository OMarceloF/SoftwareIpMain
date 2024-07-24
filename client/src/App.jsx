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
        path: 'dashboardGraph',
        element: <DashboardGraph />
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
