import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthState } from "@/store/selectors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useAppSelector(selectAuthState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const state = location.state as { from?: { pathname?: string } } | null;
  const redirectTo = state?.from?.pathname ?? "/";
  const isLoading = status === "loading";
  const errorMessage = formError ?? error;

  const validateForm = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Введите корректный email";
    }

    if (password.length < 6) {
      return "Пароль должен быть не короче 6 символов";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);

    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      navigate(redirectTo, { replace: true });
    } catch {
      // Ошибка уже сохранена в Redux и показана под формой.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Вход</CardTitle>
          <CardDescription>
            Войдите, чтобы открыть персональный список задач.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm font-medium">
              <span>Email</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errorMessage)}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Пароль</span>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Минимум 6 символов"
                autoComplete="current-password"
                aria-invalid={Boolean(errorMessage)}
              />
            </label>

            {errorMessage && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Входим..." : "Войти"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link className="font-medium text-foreground underline" to="/register">
              Зарегистрироваться
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default LoginPage;
