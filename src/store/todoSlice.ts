import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  createTodo as createTodoApi,
  deleteTodo as deleteTodoApi,
  fetchTodos as fetchTodosApi,
  updateTodo as updateTodoApi,
} from "../api/todos";

import { getApiErrorMessage } from "@/api/client";
import type { Todo, TodoResponse, TodoState } from "@/types";

type FetchTodosArgs = {
  page: number;
  limit: number;
  filter: string;
};

type UpdateTodoArgs = {
  id: number;
  text?: string;
  completed?: boolean;
};

export const getTodos = createAsyncThunk<
  TodoResponse,
  FetchTodosArgs,
  { rejectValue: string }
>("todos/fetchAll", async ({ page, limit, filter }, { rejectWithValue }) => {
  try {
    const data = await fetchTodosApi(page, limit, filter);

    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const addTodo = createAsyncThunk<Todo, string, { rejectValue: string }>(
  "todos/add",
  async (text, { rejectWithValue }) => {
    try {
      const data = await createTodoApi(text);

      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const deleteTodo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("todos/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteTodoApi(id);

    return id;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const updateTodo = createAsyncThunk<
  Todo,
  UpdateTodoArgs,
  { rejectValue: string }
>("todos/update", async ({ id, ...changes }, { rejectWithValue }) => {
  try {
    const data = await updateTodoApi(id, changes);

    return data;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const initialState: TodoState = {
  todos: [],
  page: 1,
  limit: 10,
  total: 0,
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
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(getTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Ошибка загрузки";
    });

    builder.addCase(addTodo.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.todos.unshift(action.payload);
      state.total += 1;
    });
    builder.addCase(addTodo.rejected, (state, action) => {
      state.error = action.payload ?? "Ошибка создания задачи";
    });

    builder.addCase(deleteTodo.pending, (state) => {
      state.error = null;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.error = action.payload ?? "Ошибка удаления задачи";
    });

    builder.addCase(updateTodo.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id,
      );

      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.error = action.payload ?? "Ошибка обновления задачи";
    });
  },
});

export const { setPage } = todoSlice.actions;
export default todoSlice.reducer;
