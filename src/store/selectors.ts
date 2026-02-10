import type { RootState } from "./index";

export const selectTodosState = (state: RootState) => state.todos;
