import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors";

type AuthRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: AuthRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function GuestRoute({ children }: AuthRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
