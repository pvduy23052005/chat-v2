"use client";

import ProtectedRoute from "@core/routes/ProtectedRoute";
import MainLayout from "@core/layouts/MainLayout";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
