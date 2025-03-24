import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";
import HomePage from './pages/HomePage';
import DetailProduct from './pages/DetailProduct';

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
        path: "/product/:id",
        element: <DetailProduct />
      }
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
      <RouterProvider router={router} />
    </>
  );
};

export default App;