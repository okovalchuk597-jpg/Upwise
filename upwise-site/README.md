# Upwise — готовий до деплою проєкт

## Що всередині
Повністю готовий Next.js проєкт з твоїм сайтом Upwise. Нічого копіювати вручну не треба — усе вже на місці.

## Локальний запуск (перевірити перед деплоєм)
```bash
npm install
npm run dev
```
Відкрий http://localhost:3000

## Деплой на Vercel (безкоштовно, ~5 хв)
1. Завантаж цю папку на GitHub (створи новий репозиторій на github.com і залий файли)
2. Зайди на vercel.com → увійди через GitHub
3. Import Project → обери репозиторій → Deploy
4. Отримаєш живе посилання типу `upwise-site.vercel.app`

## Перед запуском не забудь
Відкрий `app/page.js`, знайди рядок:
```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```
і встав своє реальне посилання зі скрипта Google Таблиць (інструкція — `google-sheets-setup.md`).
