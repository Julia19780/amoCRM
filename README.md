# AmoCRM Сделки - Тестовое задание

Веб-приложение для отображения сделок из AmoCRM с возможностью просмотра детальной информации.

## Требования

- Доступ к аккаунту AmoCRM
- Актуальный токен доступа к API AmoCRM
- Веб-сервер (например, Live Server в VS Code)
- Доступ к CORS-прокси сервису

## Установка и настройка

1. Клонируйте репозиторий:

```bash
git clone <url-репозитория>
```

2. Откройте файл `script.js` и замените следующие константы на ваши данные:

```javascript
const ACCESS_TOKEN = 'ваш-токен-доступа';
const SUBDOMAIN = 'ваш-поддомен';
```

3. Получите доступ к CORS-прокси:

- Перейдите на https://cors-anywhere.herokuapp.com/corsdemo
- Нажмите кнопку "Request temporary access to the demo server"

4. Запустите проект:

- Если используете VS Code:
  - Установите расширение "Live Server"
  - Кликните правой кнопкой мыши по `index.html`
  - Выберите "Open with Live Server"
- Или используйте любой другой веб-сервер

## Функциональность

- Отображение списка сделок в виде таблицы
- Для каждой сделки показывается:
  - ID сделки
  - Название
  - Бюджет
  - Контакт
  - Телефон
- При клике на сделку отображается детальная информация:
  - ID сделки
  - Название сделки
  - Дата ближайшей задачи
  - Статус задачи (цветовая индикация)

## Особенности реализации

- Ограничение запросов к API (не более 2 запросов в секунду)
- Обработка ошибок при отсутствии данных
- Цветовая индикация статуса задач:
  - Красный - задача просрочена или отсутствует
  - Зеленый - задача на сегодня
  - Желтый - задача на будущее

## Поддержка

При возникновении проблем:

1. Проверьте актуальность токена доступа
2. Убедитесь в наличии доступа к CORS-прокси
3. Проверьте консоль браузера на наличие ошибок

```

```
