import { useRoutes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import userRoute from "./userRoute";
import roomRoute from "./roomRoute";
import chatRoute from "./chatRoute";

function AllRoute() {
  const elements = useRoutes([
    // public routes .
    {
      path: "/auth",
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    // private routes.
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [chatRoute, userRoute, roomRoute],
    },
    // 404
    { path: "*", element: <Login /> },
  ]);
  return elements;
}

export default AllRoute;
