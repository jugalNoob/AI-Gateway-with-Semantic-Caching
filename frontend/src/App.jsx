import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Nav from './page/nav/Nav.jsx'
import Home from './page/Home.jsx'
import Aisearch from './page/ai/Aisearch'
import  DashBorad from './page/dash/Dashborad.jsx'



const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    children: [
      { index: true, element: <Home /> },
      { path: 'Aisearch', element: <Aisearch/> },
        { path: 'dash', element: <DashBorad/> },

    ]
  }
])

function App() {
  return (
    
      <RouterProvider router={router} />

  )
}

export default App
