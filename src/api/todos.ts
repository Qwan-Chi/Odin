import axios from "axios";

const API_URL = "http://localhost:3001";

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: string
) => {
  const response = await axios.get(`${API_URL}/todos`, {
    params: { page, limit, filter },
  });
  return response.data;
};

export const createTodo = async (text: string) => {
  const response = await axios.post(`${API_URL}/todos`, { text });
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await axios.delete(`${API_URL}/todos/${id}`);
  return response.data;
};

export const updateTodo = async (
  id: number,
  text: string,
  completed?: boolean
) => {
  const response = await axios.put(`${API_URL}/todos/${id}`, {
    text,
    completed,
  });
  return response.data;
};

export const toggleTodoStatus = async (id: number) => {
  const response = await axios.patch(`${API_URL}/todos/${id}/toggle`);
  return response.data;
};
