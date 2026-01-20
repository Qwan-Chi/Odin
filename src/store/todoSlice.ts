import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { createTodo, fetchTodos } from "../api/todos";

export const getTodos = createAsyncThunk(
  "todos/fetchAll",
  async ({
    page,
    limit,
    filter,
  }: {
    page: number;
    limit: number;
    filter: string;
  }) => {
    const data = await fetchTodos(page, limit, filter);
    return data;
  },
);

export const addTodo = createAsyncThunk("todos/add", async (text: string) => {
  const data = await createTodo(text);
  return data;
});

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoState {
  todos: Todo[];
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload.data;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(getTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Ошибка загрузки";
    });

    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.todos.unshift(action.payload);
    });
  },
});

export const { setPage } = todoSlice.actions;
export default todoSlice.reducer;
