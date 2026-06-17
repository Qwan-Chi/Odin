import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Calendar,
  Check,
  Edit2,
  LogOut,
  Moon,
  Plus,
  Sun,
  Trash2,
  UserCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logoutUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthState, selectTodosState } from "@/store/selectors";
import {
  addTodo,
  deleteTodo,
  getTodos,
  setPage,
  updateTodo,
} from "@/store/todoSlice";

function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(selectAuthState);
  const {
    todos: tasks,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,
  } = useAppSelector(selectTodosState);

  const addTask = (text: string) => {
    dispatch(addTodo(text));
  };

  const deleteTask = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const toggleTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);

    if (task) {
      dispatch(updateTodo({ id, completed: !task.completed }));
    }
  };

  const editTask = (id: number, newText: string) => {
    dispatch(updateTodo({ id, text: newText }));
  };

  const [isDark, setIsDark] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [newTaskText, setNewTaskText] = useState("");
  const [isError, setIsError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    dispatch(getTodos({ page, limit, filter }));
  }, [dispatch, filter, limit, page]);

  const emptyStateMessage = (() => {
    if (filter === "all") return "Нет задач. Добавьте новую задачу!";
    if (filter === "completed") return "Нет выполненных задач";
    return "Нет активных задач";
  })();

  const addNewTask = () => {
    if (newTaskText.trim() === "") {
      setIsError(true);
      return;
    }
    addTask(newTaskText);
    setNewTaskText("");
    setIsError(false);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const changeFilter = (nextFilter: string) => {
    setFilter(nextFilter);
    dispatch(setPage(1));
  };

  const handleLogout = () => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/login", { replace: true }));
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    if (filter === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (filter === "active") {
      filtered = filtered.filter((task) => !task.completed);
    }

    if (sortOrder === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = total || tasks.length;
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
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
              <Button asChild variant="outline">
                <Link to="/profile">
                  <UserCircle className="h-4 w-4" />
                  {user?.email ?? "Профиль"}
                </Link>
              </Button>
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
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
                disabled={loading}
                onClick={() => {
                  addNewTask();
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

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Показать:
            </span>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => changeFilter("all")}
              >
                Все
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => changeFilter("active")}
              >
                Активные
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => changeFilter("completed")}
              >
                Готовые
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

        {error && (
          <Card className="mb-6 border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </Card>
        )}

        <div className="space-y-3">
          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">Загрузка задач...</p>
            </Card>
          ) : filteredTasks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {emptyStateMessage}
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
                    <Checkbox
                      onCheckedChange={() => {
                        toggleTask(task.id);
                      }}
                      checked={task.completed}
                      className="h-5 w-5"
                    />

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
                        {(() => {
                          const formattedDate = new Date(
                            task.createdAt,
                          ).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });
                          return (
                            <>
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formattedDate}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingId === task.id ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                          onClick={() => {
                            editTask(task.id, editingText);
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
                          deleteTask(task.id);
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

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => dispatch(setPage(page - 1))}
            >
              Назад
            </Button>
            <span className="text-sm text-muted-foreground">
              Страница {page} из {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => dispatch(setPage(page + 1))}
            >
              Вперёд
            </Button>
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Показано задач: {filteredTasks.length} из {totalCount}
          </div>
        )}
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Odin — современный планировщик задач</p>
          <p className="mt-1">Данные задач хранятся на сервере и защищены JWT</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
