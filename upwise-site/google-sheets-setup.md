# Підключення форми Upwise до Google Таблиць

Займе 5 хвилин, без коду на бекенді — усе через сам Google.

## 1. Створи таблицю
Відкрий [Google Sheets](https://sheets.new) і назви перший аркуш, наприклад, `Заявки`.
У перший рядок встав заголовки колонок:

```
Час | Ім'я | Прізвище | Email | Телефон | Роль
```

## 2. Відкрий Apps Script
У таблиці: **Розширення (Extensions) → Apps Script**.
Видали весь код-заглушку і встав цей:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Заявки");
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.firstName || "",
    data.lastName || "",
    data.email || "",
    data.phone || "",
    data.role || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Натисни 💾 **Зберегти** (назви проєкт, наприклад, "Upwise Waitlist").

## 3. Опублікуй як Web App
**Deploy → New deployment**:
- Тип: **Web app**
- Execute as: **Me**
- Who has access: **Anyone**

Натисни **Deploy**, підтверди дозволи (Google попередить, що скрипт не перевірений — це нормально для власного скрипта, тисни "Advanced" → "Go to ... (unsafe)" → Allow).

Скопіюй посилання, яке з'явиться — це **Web app URL**, виглядає так:
```
https://script.google.com/macros/s/AKfycb........./exec
```

## 4. Встав URL у код сайту
У файлі `upwise-landing-final.jsx` на початку знайди:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

Заміни на щойно скопійоване посилання.

## 5. Готово
Після відправки форми на сайті новий рядок з'явиться прямо в таблиці `Заявки` — ім'я, прізвище, email, телефон і роль (батько/вчитель).

---

### Якщо потрібно оновити скрипт пізніше
Після будь-якої зміни коду в Apps Script — знову **Deploy → Manage deployments → ✏️ → New version → Deploy**, щоб зміни підʼїхали на той самий URL.

### Порада
Можна одразу зробити 2 окремі аркуші — "Батьки" і "Вчителі" — і в `doPost` розкидати рядки по різних аркушах залежно від `data.role`. Скажи, якщо хочеш такий варіант — підправлю скрипт.
