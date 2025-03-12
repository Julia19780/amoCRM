const accessToken = 'ВАШ_ACCESS_TOKEN'; // Замените на свой токен
const subdomain =
  'https://github.com/Julia19780/amoCRM/blob/6575abd35ba1949a1da402d8cffb064374b7a439/amo/amo.js'; // Замените на свой поддомен amoCRM

async function fetchDeals() {
  try {
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data._embedded.leads;
  } catch (error) {
    console.error('Error fetching deals:', error);
  }
}

async function fetchContacts(dealId) {
  try {
    const response = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/${dealId}/contacts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data._embedded.contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
}

function getStatusCircle(taskStatus) {
  const statusCircle = document.createElement('span');
  if (taskStatus === 'overdue') {
    statusCircle.style.backgroundColor = 'red';
  } else if (taskStatus === 'today') {
    statusCircle.style.backgroundColor = 'green';
  } else if (taskStatus === 'future') {
    statusCircle.style.backgroundColor = 'yellow';
  }
  statusCircle.className = 'status-circle';
  return statusCircle;
}

async function displayDeals() {
  const deals = await fetchDeals();
  const tableBody = document.getElementById('dealsTableBody');

  for (const deal of deals) {
    const contacts = await fetchContacts(deal.id);

    for (const contact of contacts) {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${deal.id}</td>
                <td>${deal.name}</td>
                <td>${
                  deal.custom_fields.find((field) => field.name === 'Бюджет').values[0].value
                }</td>
                <td>${contact.name}</td>
                <td>${contact.phone ? contact.phone[0].value : 'Нет номера'}</td>
                <td><button class="btn btn-info btn-sm" onclick="getDealDetails(${
                  deal.id
                }, this)">Детали</button><
            /td>
            `;
      tableBody.appendChild(row);
    }
  }
}
