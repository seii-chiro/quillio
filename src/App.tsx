import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home"

const App = () => {
  const router = createBrowserRouter([
    {
      index: true,
      element: <Home />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App