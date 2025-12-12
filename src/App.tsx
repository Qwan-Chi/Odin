import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Moon, Sun, Calendar, Check } from "lucide-react";
import { useState } from "react";
import { TaskManager, type Task } from "./TaskManager";

const taskList = new TaskManager();

function App() {
  const [isDark, setIsDark] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(taskList.getTasks());
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [newTaskText, setNewTaskText] = useState("");
  const [isError, setIsError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // Переключение темы
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  // Фильтрация задач
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Применяем фильтр
    if (filter === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (filter === "active") {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Применяем сортировку
    if (sortOrder === "newest") {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  function editTask(id: number, text: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                O
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Odin</h1>
                <p className="text-sm text-muted-foreground">
                  Планировщик задач
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {completedCount} / {totalCount} выполнено
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Форма добавления задачи */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Новая задача
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Введите текст задачи..."
                className="flex-1"
              />
              <Button
                className="px-6"
                onClick={() => {
                  if (newTaskText.trim() === "") {
                    setIsError(true);
                    return;
                  }
                  taskList.addTask(newTaskText);
                  setNewTaskText("");
                  setTasks([...taskList.getTasks()]);
                  setIsError(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>
            {isError && (
              <p className="text-sm text-muted-foreground mt-3">
                Подсказка: поле не может быть пустым
              </p>
            )}
          </CardContent>
        </Card>

        {/* Фильтры и сортировка */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Показать:
            </span>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Все ({tasks.length})
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Активные ({tasks.filter((t) => !t.completed).length})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Готовые ({completedCount})
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-muted-foreground">
              Сортировка:
            </span>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Новые сначала</SelectItem>
                <SelectItem value="oldest">Старые сначала</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Список задач */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {filter === "all"
                  ? "Нет задач. Добавьте новую задачу!"
                  : filter === "completed"
                  ? "Нет выполненных задач"
                  : "Нет активных задач"}
              </p>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className={`transition-all hover:shadow-md ${
                  task.completed ? "opacity-75" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Чекбокс */}
                    <Checkbox
                      onCheckedChange={() => {
                        taskList.toggleTask(task.id);
                        setTasks([...taskList.getTasks()]);
                      }}
                      checked={task.completed}
                      className="h-5 w-5"
                    />

                    {/* Текст задачи */}
                    <div className="flex-1 min-w-0">
                      {" "}
                      {editingId === task.id ? (
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="h-7 text-sm"
                        />
                      ) : (
                        <p
                          className={`text-base ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {task.text}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {task.createdAt.toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex gap-2">
                      {editingId === task.id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                          onClick={() => {
                            taskList.editTask(task.id, editingText);
                            setTasks([...taskList.getTasks()]);
                            setEditingId(null);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => {
                            setEditingText(task.text);
                            setEditingId(task.id);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          taskList.deleteTask(task.id);
                          setTasks([...taskList.getTasks()]);
                        }}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Статистика внизу */}
        {filteredTasks.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Показано задач: {filteredTasks.length} из {totalCount}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Odin — современный планировщик задач</p>
          <p className="mt-1">Все данные сохраняются в localStorage</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
