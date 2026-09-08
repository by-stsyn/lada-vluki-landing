# Инструкции по настройке лендинга Geely

## 1. Настройка счетчиков и аналитики

### Яндекс Метрика

1. Получите ID вашего счётчика Яндекс Метрики (формат: 12345678)
2. Откройте файл `index.html`
3. Найдите строку `ym(YOUR_METRIKA_ID, "init", {` (две строки: одна в скрипте, одна в noscript)
4. Замените `YOUR_METRIKA_ID` на ваш реальный ID:

```javascript
// Было:
ym(YOUR_METRIKA_ID, "init", {

// Стало:
ym(98765432, "init", {
```

5. Также замените в noscript теге:

```html
<!-- Было: -->
<img src="https://mc.yandex.ru/watch/YOUR_METRIKA_ID" ... />

<!-- Стало: -->
<img src="https://mc.yandex.ru/watch/98765432" ... />
```

### Calltouch

1. Получите ID вашего счётчика Calltouch
2. Откройте файл `index.html`
3. Найдите строку с `YOUR_CALLTOUCH_ID`
4. Замените на ваш ID:

```javascript
// Было:
})(window,document,"ct","YOUR_CALLTOUCH_ID");

// Стало (пример):
})(window,document,"ct","site-123456");
```

## 2. Настройка email уведомлений

### Требования

Для отправки email уведомлений используется сервис Resend.com.

### Шаги настройки:

1. **Создайте аккаунт на Resend.com:**
   - Перейдите на https://resend.com
   - Зарегистрируйтесь или войдите в аккаунт

2. **Получите API ключ:**
   - В панели Resend перейдите в раздел "API Keys"
   - Создайте новый API ключ
   - Скопируйте его (формат: `re_...`)

3. **Настройте домен (опционально, но рекомендуется):**
   - В Resend добавьте домен `geely-pragmatika.ru`
   - Добавьте DNS записи, как указано в Resend
   - Дождитесь верификации домена

4. **Добавьте API ключ в Supabase:**

   Выполните команду в терминале:
   ```bash
   npx supabase secrets set RESEND_API_KEY=re_ваш_ключ_здесь
   ```

   Или через Supabase Dashboard:
   - Откройте ваш проект в Supabase Dashboard
   - Перейдите в Edge Functions → Settings
   - Добавьте секрет `RESEND_API_KEY` со значением вашего API ключа

### Список получателей

Email уведомления отправляются на следующие адреса:
- call@terravto.ru
- a.bliznyukov@terravto.ru
- n.pastyreva@geely-pragmatika.ru

Для изменения списка получателей:
1. Откройте файл `supabase/functions/send-lead-email/index.ts`
2. Найдите константу `RECIPIENT_EMAILS` (строка 20)
3. Измените список email адресов
4. Передеплойте функцию: `npx supabase functions deploy send-lead-email`

### Проверка работы

После настройки API ключа:
1. Зайдите на сайт
2. Отправьте тестовую заявку
3. Проверьте почту всех получателей
4. Если письма не пришли, проверьте логи Edge Function в Supabase Dashboard

## 3. Управление изображениями

Подробная инструкция находится в файле `IMAGE_MANAGEMENT.md`.

Краткая версия:
- Все изображения в папке `public/`
- Для замены фото модели: добавьте файлы в `public/название-модели/`
- Обновите пути в файле `src/App.tsx` в массиве `cars`

## 4. Деплой изменений

После внесения любых изменений:

```bash
# 1. Соберите проект
npm run build

# 2. Если изменяли Edge Functions
npx supabase functions deploy send-lead-email

# 3. Если изменяли базу данных
npx supabase db push
```

## 5. Тестирование

### Локальное тестирование

```bash
npm run dev
```

Откройте http://localhost:5173

### Проверочный список:

- [ ] Яндекс Метрика работает (проверить в панели метрики)
- [ ] Calltouch инициализируется (проверить в консоли браузера)
- [ ] Все изображения загружаются
- [ ] Формы отправляются успешно
- [ ] Email уведомления приходят на все адреса
- [ ] Лендинг корректно отображается на мобильных устройствах
- [ ] Плавная прокрутка к секциям работает
- [ ] Калькулятор кредита работает корректно

## 6. Полезные команды

```bash
# Запуск в dev режиме
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр production сборки
npm run preview

# Деплой Edge Function
npx supabase functions deploy send-lead-email

# Просмотр логов Edge Function
npx supabase functions logs send-lead-email

# Добавление секретов
npx supabase secrets set KEY_NAME=value

# Просмотр секретов
npx supabase secrets list
```

## 7. Решение проблем

### Email не отправляются

1. Проверьте, что API ключ Resend настроен:
   ```bash
   npx supabase secrets list
   ```

2. Проверьте логи Edge Function:
   ```bash
   npx supabase functions logs send-lead-email
   ```

3. Убедитесь, что домен верифицирован в Resend (если используете кастомный домен)

### Счётчики не работают

1. Проверьте, что ID счётчиков заменены в `index.html`
2. Откройте консоль браузера (F12) и проверьте на ошибки
3. Проверьте, что скрипты загрузились (вкладка Network)

### Изображения не загружаются

1. Проверьте, что файлы находятся в папке `public/`
2. Проверьте пути в `src/App.tsx`
3. Убедитесь, что имена файлов совпадают (включая регистр)
4. Пересоберите проект: `npm run build`

## 8. Структура проекта

```
project/
├── public/              # Публичные файлы (изображения, логотипы)
│   ├── monjaro/        # Фото модели Monjaro
│   ├── geely.png       # Изображение по умолчанию
│   └── logo-brand.svg  # Логотип Geely
├── src/
│   ├── components/     # React компоненты
│   ├── lib/           # Библиотеки (Supabase client)
│   ├── App.tsx        # Главный компонент (здесь данные моделей)
│   └── main.tsx       # Точка входа
├── supabase/
│   ├── functions/     # Edge Functions
│   │   └── send-lead-email/  # Функция отправки email
│   └── migrations/    # Миграции базы данных
├── index.html         # HTML шаблон (счётчики здесь)
└── package.json       # Зависимости проекта
```

## 9. Контакты и поддержка

Если возникли вопросы:
1. Проверьте документацию
2. Проверьте логи в Supabase Dashboard
3. Проверьте консоль браузера на ошибки

## 10. Чеклист первоначальной настройки

Перед запуском в продакшен:

- [ ] Заменить ID Яндекс Метрики в `index.html`
- [ ] Заменить ID Calltouch в `index.html`
- [ ] Настроить Resend API ключ
- [ ] Добавить RESEND_API_KEY в Supabase secrets
- [ ] Проверить список email получателей
- [ ] Загрузить все изображения моделей
- [ ] Обновить пути к изображениям в коде
- [ ] Протестировать отправку форм
- [ ] Проверить получение email на всех адресах
- [ ] Собрать проект: `npm run build`
- [ ] Задеплоить на сервер
