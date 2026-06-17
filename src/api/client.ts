import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import {
  clearStoredTokens,
  getAccessToken,
  getRefreshToken,
  setStoredTokens,
} from "./tokenStorage";
import type { AuthTokens } from "@/types";

const API_URL = "http://localhost:3001";

export const API_ERROR_EVENT = "odin:api-error";
export const AUTH_EXPIRED_EVENT = "odin:auth-expired";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ApiErrorResponse = {
  error?: unknown;
  message?: unknown;
};

const emitEvent = <T>(eventName: string, detail?: T) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token: string,
) => {
  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set("Authorization", `Bearer ${token}`);
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return "Неизвестная ошибка";
};

const api = axios.create({
  baseURL: API_URL,
});

let refreshPromise: Promise<AuthTokens> | null = null;

const refreshAccessToken = (refreshToken: string) => {
  refreshPromise ??= axios
    .post<AuthTokens>(`${API_URL}/auth/refresh`, { refreshToken })
    .then((response) => {
      setStoredTokens(response.data);

      return response.data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    setAuthorizationHeader(config, accessToken);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      emitEvent(API_ERROR_EVENT, getApiErrorMessage(error));
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const refreshToken = getRefreshToken();
    const url = originalRequest?.url ?? "";
    const errorMessage = getApiErrorMessage(error);
    const canRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      refreshToken &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register") &&
      !url.includes("/auth/refresh");

    if (canRefresh) {
      originalRequest._retry = true;

      try {
        const tokens = await refreshAccessToken(refreshToken);

        setAuthorizationHeader(originalRequest, tokens.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        clearStoredTokens();
        emitEvent(AUTH_EXPIRED_EVENT);
        emitEvent(API_ERROR_EVENT, "Сессия истекла. Войдите заново.");

        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register") &&
      !url.includes("/auth/refresh") &&
      errorMessage !== "Invalid old password"
    ) {
      clearStoredTokens();
      emitEvent(AUTH_EXPIRED_EVENT);
      emitEvent(API_ERROR_EVENT, "Сессия истекла. Войдите заново.");

      return Promise.reject(error);
    }

    emitEvent(API_ERROR_EVENT, errorMessage);

    return Promise.reject(error);
  },
);

export default api;
