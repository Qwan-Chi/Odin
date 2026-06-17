import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  changePassword as changePasswordApi,
  fetchUserProfile as fetchUserProfileApi,
  loginUser as loginUserApi,
  registerUser as registerUserApi,
} from "@/api/auth";
import { getApiErrorMessage } from "@/api/client";
import {
  clearStoredTokens,
  getAccessToken,
  getRefreshToken,
  setStoredTokens,
} from "@/api/tokenStorage";
import type {
  AuthState,
  AuthTokens,
  ChangePasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types";

type AuthSuccessPayload = AuthTokens & {
  user: User;
};

const loadProfileAfterAuth = async (tokens: AuthTokens) => {
  setStoredTokens(tokens);

  const user = await fetchUserProfileApi();

  return {
    ...tokens,
    user,
  };
};

export const registerUser = createAsyncThunk<
  AuthSuccessPayload,
  RegisterCredentials,
  { rejectValue: string }
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    const tokens = await registerUserApi(credentials);

    return await loadProfileAfterAuth(tokens);
  } catch (error) {
    clearStoredTokens();

    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  AuthSuccessPayload,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const tokens = await loginUserApi(credentials);

    return await loadProfileAfterAuth(tokens);
  } catch (error) {
    clearStoredTokens();

    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  clearStoredTokens();
});

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    return await fetchUserProfileApi();
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const changePassword = createAsyncThunk<
  string,
  ChangePasswordPayload,
  { rejectValue: string }
>("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await changePasswordApi(payload);

    return response.message;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const initialState: AuthState = {
  user: null,
  token: getAccessToken(),
  refreshToken: getRefreshToken(),
  status: "idle",
  error: null,
  passwordChangeStatus: "idle",
  passwordChangeMessage: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessage: (state) => {
      state.error = null;
      state.passwordChangeMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = "failed";
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload ?? "Ошибка регистрации";
    });

    builder.addCase(loginUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = "failed";
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload ?? "Ошибка входа";
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      state.passwordChangeStatus = "idle";
      state.passwordChangeMessage = null;
    });

    builder.addCase(fetchUserProfile.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload;
      state.token = getAccessToken();
      state.refreshToken = getRefreshToken();
      state.error = null;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? "Ошибка загрузки профиля";
    });

    builder.addCase(changePassword.pending, (state) => {
      state.passwordChangeStatus = "loading";
      state.passwordChangeMessage = null;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.passwordChangeStatus = "idle";
      state.passwordChangeMessage = action.payload;
      state.error = null;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.passwordChangeStatus = "failed";
      state.passwordChangeMessage = null;
      state.error = action.payload ?? "Ошибка смены пароля";
    });
  },
});

export const { clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
