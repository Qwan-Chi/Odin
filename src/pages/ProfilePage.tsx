import { type FormEvent, useEffect, useState } from "react";
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
import {
  changePassword,
  clearAuthMessage,
  fetchUserProfile,
  logoutUser,
} from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthState } from "@/store/selectors";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    user,
    status,
    error,
    passwordChangeStatus,
    passwordChangeMessage,
  } = useAppSelector(selectAuthState);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isProfileLoading = status === "loading" && !user;
  const isPasswordLoading = passwordChangeStatus === "loading";
  const errorMessage = formError ?? error;
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Неизвестно";

  useEffect(() => {
    if (!user) {
      void dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/login", { replace: true }));
  };

  const validatePasswordForm = () => {
    if (oldPassword.length < 6) {
      return "Старый пароль должен быть не короче 6 символов";
    }

    if (newPassword.length < 6) {
      return "Новый пароль должен быть не короче 6 символов";
    }

    if (newPassword !== confirmPassword) {
      return "Новый пароль и подтверждение не совпадают";
    }

    return null;
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validatePasswordForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    dispatch(clearAuthMessage());

    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Ошибка уже сохранена в Redux и показана под формой.
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
            <p className="text-muted-foreground">
              Данные аккаунта и смена пароля.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">К задачам</Link>
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Данные пользователя</CardTitle>
              <CardDescription>
                Профиль загружается через защищённый `/auth/me`.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isProfileLoading ? (
                <p className="text-sm text-muted-foreground">Загрузка...</p>
              ) : (
                <>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs uppercase text-muted-foreground">
                      Email
                    </p>
                    <p className="mt-1 font-medium">{user?.email}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs uppercase text-muted-foreground">
                      Возраст
                    </p>
                    <p className="mt-1 font-medium">
                      {user?.age ?? "Не указан"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs uppercase text-muted-foreground">
                      Дата регистрации
                    </p>
                    <p className="mt-1 font-medium">{createdAt}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Смена пароля</CardTitle>
              <CardDescription>
                Введите текущий пароль и новый пароль с подтверждением.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <label className="block space-y-2 text-sm font-medium">
                  <span>Старый пароль</span>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    autoComplete="current-password"
                    aria-invalid={Boolean(errorMessage)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium">
                  <span>Новый пароль</span>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errorMessage)}
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium">
                  <span>Подтверждение нового пароля</span>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errorMessage)}
                  />
                </label>

                {errorMessage && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}

                {passwordChangeMessage && (
                  <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-300">
                    {passwordChangeMessage}
                  </p>
                )}

                <Button disabled={isPasswordLoading} type="submit">
                  {isPasswordLoading ? "Сохраняем..." : "Сменить пароль"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
