import { createBrowserRouter, RouterProvider, Navigate } from "react-router"
import Home from "./pages/Home"
import RootLayout from "./layouts/RootLayout"
import ProtectedLayout from "./layouts/ProtectedLayout"
import "./App.css"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MyBlogs from "./pages/MyBlogs"
import ReadBlog from "./pages/ReadBlog"
import Profile from "./pages/Profile"

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
              element: <Navigate to="blogs" replace />
            },
            {
              path: "blogs",
              element: <Home />
            },
            {
              path: "blogs/:id",
              element: <ReadBlog />
            },
            {
              path: "my-blogs",
              element: <MyBlogs />
            },
            {
              path: "profile",
              element: <Profile />
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
      element: <div className="text-center mt-8 text-2xl font-semibold">404 Not Found</div>
    }
  ], { basename: "/quillio" })

  return (
    <RouterProvider router={router} />
  )
}

export default App