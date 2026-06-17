import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { API_ERROR_EVENT, AUTH_EXPIRED_EVENT } from "@/api/client";
import { GuestRoute, ProtectedRoute } from "@/components/AuthRoutes";
import { fetchUserProfile, logoutUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthState } from "@/store/selectors";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(selectAuthState);
  const requestedProfileRef = useRef(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      requestedProfileRef.current = false;
      return;
    }

    if (!user && !requestedProfileRef.current) {
      requestedProfileRef.current = true;
      void dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    const handleAuthExpired = () => {
      void dispatch(logoutUser());
    };

    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      setApiError(customEvent.detail);
      window.setTimeout(() => setApiError(null), 5000);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    window.addEventListener(API_ERROR_EVENT, handleApiError);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
      window.removeEventListener(API_ERROR_EVENT, handleApiError);
    };
  }, [dispatch]);

  return (
    <>
      {apiError && (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-destructive/30 bg-destructive px-4 py-3 text-sm text-white shadow-lg">
          {apiError}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
