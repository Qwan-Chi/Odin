import { configureStore } from "@reduxjs/toolkit";

import todoReducer from "./todoSlice";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

// Типы для TypeScript, чтобы он понимал структуру нашего хранилища
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
