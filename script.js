const ACCESS_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJiOGU1YmZhZDM1MzQwMzg0MTZhMzgwZDU4YjE1MzUyMjQ1ZWEwMzUzOTExNjMzNTc3YjQ2OGIxZjRlODBjZWQ1YzU0MTA0ZGNhOTJmMjAyIn0.eyJhdWQiOiJhYTg5MjkzZi1hZmMzLTRlMzYtYjE5YS05MzgzMzU0Mzk3NjAiLCJqdGkiOiIyYjhlNWJmYWQzNTM0MDM4NDE2YTM4MGQ1OGIxNTM1MjI0NWVhMDM1MzkxMTYzMzU3N2I0NjhiMWY0ZTgwY2VkNWM1NDEwNGRjYTkyZjIwMiIsImlhdCI6MTc0MjE1OTc1MiwibmJmIjoxNzQyMTU5NzUyLCJleHAiOjE3NDIyNDYxNTIsInN1YiI6IjEyMjMxMTI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyMjgzOTc4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNzQ2Y2E1ODQtYzk2Ni00NDliLWIyZmYtODc0OWM5ZWMwNDhmIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.bEcSHPL2qn5DpYTLDB4pTpAUDZaD4pj8H1_K7EmN_MoMHxpdgZJVcTcHS-PTrrpsNbXHTkb8zKAG3_CVWWM3_Zr-IO9wMZIB62TCttdVWZWUePLYIHaz5uSA0NrCJEva2QAG-yXg7kbQHTjBpcpNj69vupbnE-tYvYb2qAYoX6X_SjboAdNrq8s10y31M_1T8LhXu4tFKllKn5Z2GrR1Xp7QLFULJm6WxNxz1bBC88-BXKBoFWB59itKIrin-IrBZsKfE0PgDe2zWsrGvknLl-pHCWthSrcv9v3bzfPpfvsTyZMsdSQ1OqHqUvdViGcDkUN16j2f-cwNrGBMvHYkPw';
const SUBDOMAIN = 'mssemakova99';

// Функция для выполнения запросов с ограничением
async function throttleRequests(requests, chunkSize = 2, delay = 1000) {
  const results = [];
  for (let i = 0; i < requests.length; i += chunkSize) {
    const chunk = requests.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map((fn) => fn()));
    results.push(...chunkResults);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return results;
}

// Получение списка сделок
async function fetchDeals() {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://${SUBDOMAIN}.amocrm.ru/api/v4/leads`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Origin: 'http://127.0.0.1:5500',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data._embedded?.leads || [];
  } catch (error) {
    console.error('Ошибка получения сделок:', error);
    return [];
  }
}

// Получение контактов для сделки
async function fetchContacts(dealId) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Добавляем задержку
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://${SUBDOMAIN}.amocrm.ru/api/v4/contacts?with=leads`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Origin: 'http://127.0.0.1:5500',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return (data._embedded?.contacts || []).filter((contact) =>
      contact._embedded?.leads?.some((lead) => lead.id === parseInt(dealId)),
    );
  } catch (error) {
    console.error('Ошибка получения контактов:', error);
    return [];
  }
}

// Получение задач для сделки
async function fetchTasks(dealId) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/https://${SUBDOMAIN}.amocrm.ru/api/v4/tasks?filter[entity_type]=leads&filter[entity_id]=${dealId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Origin: 'http://127.0.0.1:5500',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Получаем ответ как текст
    const text = await response.text();

    // Проверяем, что ответ не пустой
    if (!text) {
      console.log('Пустой ответ от сервера');
      return [];
    }

    try {
      // Пробуем распарсить JSON
      const data = JSON.parse(text);
      if (!data._embedded?.tasks) {
        console.log('Нет задач в ответе:', data);
        return [];
      }
      return data._embedded.tasks;
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      console.log('Полученный текст:', text);
      return [];
    }
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    return [];
  }
}

// Форматирование даты
function formatDate(timestamp) {
  if (!timestamp) return 'Нет данных';
  const date = new Date(timestamp * 1000);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;
}

// Определение цвета статуса
function getStatusColor(task) {
  if (!task) return '#dc3545'; // Красный

  const taskDate = new Date(task.complete_till * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diff = taskDate - today;
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '#dc3545'; // Красный
  if (diffDays === 0) return '#28a745'; // Зеленый
  return '#ffc107'; // Желтый
}

// Отображение сделок
async function renderDeals() {
  const deals = await fetchDeals();
  const contactRequests = deals.map((deal) => () => fetchContacts(deal.id));
  const contactsResults = await throttleRequests(contactRequests);

  const dealsBody = document.getElementById('dealsTableBody');
  dealsBody.innerHTML = '';

  deals.forEach((deal, index) => {
    const contacts = contactsResults[index];
    const contact = contacts[0] || {};

    // Исправляем получение телефона
    const phoneFields = contact.custom_fields_values?.find((field) => field.field_code === 'PHONE');
    const phone = phoneFields?.values?.map((v) => v.value).join(', ') || 'Нет телефона';

    const row = document.createElement('tr');
    row.className = 'deal-row';
    row.dataset.dealId = deal.id;
    row.innerHTML = `
            <td>${deal.id}</td>
            <td>${deal.name}</td>
            <td>${deal.price?.toLocaleString() || 0}</td>
            <td>${contact.name || 'Нет контакта'}</td>
            <td>${phone}</td>
        `;
    dealsBody.appendChild(row);
  });

  // Обработка кликов
  dealsBody.addEventListener('click', async (e) => {
    const row = e.target.closest('.deal-row');
    if (!row) return;

    const dealId = row.dataset.dealId;
    const isExpanded = row.classList.contains('expanded');

    // Закрыть все открытые строки
    document.querySelectorAll('.expanded').forEach((r) => {
      if (r !== row) {
        r.classList.remove('expanded');
        r.innerHTML = r.dataset.originalContent;
      }
    });

    if (isExpanded) {
      row.classList.remove('expanded');
      row.innerHTML = row.dataset.originalContent;
    } else {
      row.dataset.originalContent = row.innerHTML;
      row.innerHTML = `<td colspan="5" class="text-center">
        <div class="spinner" style="display: inline-block;"></div>
      </td>`;
      row.classList.add('expanded');

      const tasks = await fetchTasks(dealId);
      const nearestTask =
        tasks.length > 0 ? tasks.sort((a, b) => a.complete_till - b.complete_till)[0] : null;
      const statusColor = getStatusColor(nearestTask);

      // Получаем название сделки напрямую из оригинального контента
      const dealName = row.dataset.originalContent.split('<td>')[2].split('</td>')[0].trim();

      row.innerHTML = `
        <td colspan="5">
          <div class="p-2">
            <div><strong>ID сделки:</strong> ${dealId}</div>
            <div><strong>Название сделки:</strong> ${dealName}</div>
            <div><strong>Дата задачи:</strong> ${formatDate(nearestTask?.complete_till)}</div>
            <div>
              <strong>Статус задачи:</strong>
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-left: 5px;">
                <circle cx="10" cy="10" r="8" fill="${statusColor}"/>
              </svg>
            </div>
          </div>
        </td>`;
    }
  });
}

// Инициализация
renderDeals();
