import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import HomePage from './pages/HomePage';
import DetailProduct from './pages/DetailProduct';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AuthLayout from './layouts/AuthLayout';
import CartPage from './pages/CartPage';
import CartLayout from './layouts/CartLayout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderPage from './pages/OrderPage';
import OrderLayout from './layouts/OrderLayout';

const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/products/:id",
        element: <DetailProduct />
      },
    ]
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />
      },
      {
        path: "sign-in",
        element: <SignIn />
      }
    ]
  },
  {
    path: "/",
    element: <CartLayout />,
    children: [
      {
        path: "cart/:id",
        element: <CartPage />
      },
    ]
  },
  {
    path: "/",
    element: <OrderLayout />,
    children: [
      {
        path: "order",
        element: <OrderPage />
      },
    ]
  }
]

const router = createBrowserRouter([
  {
    element: (
      <Outlet />
    ),
    children: appRoutes
  }
])

const App = () => {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;