# Odin — менеджер задач ✅

To-do приложение с JWT-авторизацией, разработанное в три этапа (пет-проект).

> Рабочий код находится на ветке `feature/pet-project-3`. Ветка `main` содержит заглушку.

## Этапы разработки

1. **Блок 1** — базовый CRUD задач с сохранением в `localStorage`, валидация ввода, тёмная/светлая тема, сортировка и фильтрация
2. **Блок 2** — переход на REST API (вместо localStorage), пагинация, миграция состояния на **Redux Toolkit**
3. **Блок 3** — JWT-авторизация: регистрация, вход, защищённые маршруты, профиль, смена пароля, авто-обновление токена

## Технологии

| Категория | Технологии |
|-----------|-----------|
| Фреймворк | **React 19** + **TypeScript 5.9** |
| Сборка | **Vite 7** |
| State | **Redux Toolkit 2** + React-Redux 9 |
| Роутинг | **React Router DOM 6** (ProtectedRoute / GuestRoute) |
| UI | **TailwindCSS 4** + **shadcn/ui** (Radix UI) |
| HTTP | **axios** (интерсепторы, refresh-token) |
| Линтинг | ESLint 9 + typescript-eslint |

## Запуск

```bash
git clone https://github.com/Qwan-Chi/Odin.git
cd Odin
git checkout feature/pet-project-3
npm install
npm run dev
```

> ⚠️ Требуется backend на `http://localhost:3001` (предоставляется курсом, не входит в репозиторий).

## Структура проекта

```
src/
├── api/                # axios-клиент, auth, todos, tokenStorage
├── components/         # AuthRoutes, shadcn/ui-примитивы
├── pages/              # Home, Login, Register, Profile, NotFound
├── store/              # configureStore, authSlice, todoSlice
├── hooks/              # useTaskManager
└── types.ts            # TypeScript-типы
```

## Лицензия

MIT
