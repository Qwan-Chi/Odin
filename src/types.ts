export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoState {
  todos: Todo[];
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}
