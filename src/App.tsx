import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";
import PageLayout from "./components/layout/PageLayout";
import { Suspense } from "react";
import Loader from "./components/ui/Loader";
import NotFoundPage from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
// import Dashboard from "./pages/dashboard/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <PageLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        ),
      },
      // {
      //   path: "/dashboard",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <Dashboard />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: "/login",
      //   element: <Login />,
      // },
      // {
      //   path: "/register",
      //   element: <Register />,
      // },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
