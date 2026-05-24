import api from "./client";
import type { Todo, TodoResponse } from "@/types";

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: string,
) => {
  const response = await api.get<TodoResponse>("/todos", {
    params: { page, limit, filter },
  });

  return response.data;
};

export const createTodo = async (text: string) => {
  const response = await api.post<Todo>("/todos", { text });

  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await api.delete<Todo>(`/todos/${id}`);

  return response.data;
};

export const updateTodo = async (
  id: number,
  updates: { text?: string; completed?: boolean },
) => {
  const response = await api.put<Todo>(`/todos/${id}`, updates);

  return response.data;
};

export const toggleTodoStatus = async (id: number) => {
  const response = await api.patch<Todo>(`/todos/${id}/toggle`);

  return response.data;
};
