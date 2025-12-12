export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export class TaskManager {
  private tasks: Task[];

  constructor(initialTasks: Task[] = []) {
    const storage = localStorage.getItem("MyTasks");

    if (storage) {
      const parsedTasks = JSON.parse(storage);

      this.tasks = parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    } else {
      this.tasks = initialTasks;
    }
  }

  // Получить все задачи
  getTasks(): Task[] {
    return this.tasks;
  }

  // Добавить новую задачу
  addTask(textTask: string) {
    this.tasks.push({
      id: this.tasks.length + 1,
      text: textTask,
      completed: false,
      createdAt: new Date(),
    });
    this.saveTasks();
  }

  // Сохранить задачи
  saveTasks() {
    localStorage.setItem("MyTasks", JSON.stringify(this.tasks));
  }

  // Удаление задачи
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }

  // Переключатель задач
  toggleTask(id: number) {
    const task = this.tasks.find((task) => task.id == id);
    if (task) {
      task.completed = !task.completed;
    }
    this.saveTasks();
  }

  // Редактирование задачи
  editTask(id: number, newText: string) {
    const task = this.tasks.find((task) => task.id == id);
    if (task) {
      task.text = newText;
    }
    this.saveTasks();
  }
}
