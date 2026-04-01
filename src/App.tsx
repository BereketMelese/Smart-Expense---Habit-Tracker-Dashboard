import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Expenses from "./pages/dashboard/Expenses";
import Habits from "./pages/dashboard/Habits";
import Profile from "./pages/dashboard/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFoundPage from "./pages/NotFound";
import PageLayout from "./components/layout/PageLayout";
import Loader from "./components/ui/Loader";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "expenses",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Expenses />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "habits",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Habits />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
        ],
      },
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
