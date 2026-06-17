import type { RootState } from "./index";

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
export const selectTodosState = (state: RootState) => state.todos;
