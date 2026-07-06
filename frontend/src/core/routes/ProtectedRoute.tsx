"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@core/hooks/useAuth";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.push("/auth/login");
    }
  }, [isLogin, router]);

  if (!isLogin) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
