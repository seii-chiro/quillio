import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home"
import RootLayout from "./layouts/RootLayout"
import ProtectedLayout from "./layouts/ProtectedLayout"
import "./App.css"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyBlogs from "./pages/MyBlogs"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          element: <ProtectedLayout />,
          children: [
            {
              index: true,
              element: <Home />
            },
            {
              path: "my-blogs",
              element: <MyBlogs />
            }
          ]
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        }
      ]
    },
    {
      path: "*",
      element: <div>404 Not Found</div>
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App