import './App.css'
import Dashboard from './Components/Dashboard/Dashboard'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Review from './Components/Dashboard/Review/Review'

// Importando React Router DOM
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

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
        element: <Review />
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
