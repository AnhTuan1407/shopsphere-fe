import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import CartLayout from './layouts/CartLayout';
import MainLayout from "./layouts/MainLayout";
import OrderLayout from './layouts/OrderLayout';
import ProfileLayout from './layouts/ProfileLayout';
import PrivateRoute from './middlewares/PrivateRoute';
import CartPage from './pages/CartPage';
import DetailProduct from './pages/DetailProduct';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import ProfileOrderPage from './pages/ProfileOrderPage';
import ProfilePage from './pages/ProfilePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products/:id", element: <DetailProduct /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn /> },
    ],
  },
  {
    path: "/cart",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <CartLayout />,
        children: [{ path: ":id", element: <CartPage /> }],
      },
    ],
  },
  {
    path: "/order",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <OrderLayout />,
        children: [{ path: "", element: <OrderPage /> }],
      },
    ],
  },
  {
    path: "/profile",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            element: <ProfilePage />
          },
          {
            path: "/profile/orders",
            element: <ProfileOrderPage />
          }
        ],
      },
    ],
  },
];

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
      <RouterProvider router={router} />
    </>
  );
};

export default App;