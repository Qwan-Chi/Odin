export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoResponse {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TodoState {
  todos: Todo[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  email: string;
  age?: number | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type AuthStatus = "idle" | "loading" | "failed";

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;
  passwordChangeStatus: AuthStatus;
  passwordChangeMessage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  age?: number;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}
