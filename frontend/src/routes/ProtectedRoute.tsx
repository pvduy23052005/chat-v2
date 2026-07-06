import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/auth/useAuth";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/auth/login");
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
