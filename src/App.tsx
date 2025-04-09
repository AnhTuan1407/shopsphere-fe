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
import AddressPage from './pages/AddressPage';
import SignUpSeller from './pages/SignUpSeller';
import SignInSeller from './pages/SignInSeller';
import SellerDashboard from './pages/SellerDashboard';
import SellerLayout from './layouts/SellerLayout';
import SellerProductManagement from './pages/SellerProductManagement';
import SellerCategoryManagement from './pages/SellerCategoryManagement';
import SellerOrderManagement from './pages/SellerOrderManagement';

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
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "seller/sign-in", element: <SignInSeller /> },
      { path: "seller/sign-up", element: <SignUpSeller /> },
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
          },
          {
            path: "/profile/address",
            element: <AddressPage />
          }
        ],
      },
    ],
  },
  {
    path: "/seller",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <SellerLayout />,
        children: [
          {
            index: true,
            element: <SellerDashboard />
          },
          {
            path: "/seller/products",
            element: <SellerProductManagement />
          },
          {
            path: "/seller/categories",
            element: <SellerCategoryManagement />
          },
          {
            path: "/seller/orders",
            element: <SellerOrderManagement />
          },
          {
            path: "/seller/dashboard",
            element: <SellerDashboard />
          },
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