import { useState } from "react";

import { type Task, TaskManager } from "../TaskManager";

const taskList = new TaskManager();
export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>(taskList.getTasks());

  const addTask = (text: string) => {
    taskList.addTask(text);
    setTasks(taskList.getTasks());
  };

  const deleteTask = (id: number) => {
    taskList.deleteTask(id);
    setTasks(taskList.getTasks());
  };

  const toggleTask = (id: number) => {
    taskList.toggleTask(id);
    setTasks(taskList.getTasks());
  };

  const editTask = (id: number, newText: string) => {
    taskList.editTask(id, newText);
    setTasks(taskList.getTasks());
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
    editTask,
  };
}
