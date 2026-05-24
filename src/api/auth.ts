import api from "./client";
import type {
  AuthTokens,
  ChangePasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";

type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await api.post<AuthTokens>("/auth/login", credentials);

  return response.data;
};

export const registerUser = async (credentials: RegisterCredentials) => {
  const response = await api.post<AuthTokens>("/auth/register", credentials);

  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get<User>("/auth/me");

  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await api.post<ChangePasswordResponse>(
    "/auth/change-password",
    payload,
  );

  return response.data;
};
