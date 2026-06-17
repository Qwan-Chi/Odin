import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthState } from "@/store/selectors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector(selectAuthState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = status === "loading";
  const errorMessage = formError ?? error;

  const validateForm = () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Введите корректный email";
    }

    if (password.length < 6) {
      return "Пароль должен быть не короче 6 символов";
    }

    if (age.trim()) {
      const numericAge = Number(age);

      if (!Number.isInteger(numericAge) || numericAge < 0) {
        return "Возраст должен быть положительным целым числом";
      }
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
      await dispatch(
        registerUser({
          email: email.trim(),
          password,
          ...(age.trim() ? { age: Number(age) } : {}),
        }),
      ).unwrap();
      navigate("/", { replace: true });
    } catch {
      // Ошибка уже сохранена в Redux и показана под формой.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>
            Создайте аккаунт. Возраст можно не указывать.
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
                autoComplete="new-password"
                aria-invalid={Boolean(errorMessage)}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium">
              <span>Возраст</span>
              <Input
                type="number"
                min="0"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="Например, 25"
                aria-invalid={Boolean(errorMessage)}
              />
            </label>

            {errorMessage && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Button className="w-full" disabled={isLoading} type="submit">
              {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link className="font-medium text-foreground underline" to="/login">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default RegisterPage;
