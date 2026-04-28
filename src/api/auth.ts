import axios from "axios";

const API_URL = "http://localhost:3001";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (
  email: string,
  password: string,
  age?: number,
) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    ...(age !== undefined && { age }),
  });
  return response.data;
};
