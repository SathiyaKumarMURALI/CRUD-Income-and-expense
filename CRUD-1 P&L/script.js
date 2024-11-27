

let entries = JSON.parse(localStorage.getItem('entries')) || [];

document.addEventListener('DOMContentLoaded', () => {
  updateUI();

  document.getElementById('add-entry').addEventListener('click', addEntry);
  document.getElementById('reset-fields').addEventListener('click', resetFields);
  document.querySelectorAll('.filters input').forEach(filter => {
    filter.addEventListener('change', updateUI);
  });
});

function addEntry() {
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!description || isNaN(amount)) {
    alert('Please provide valid inputs.');
    return;
  }

  entries.push({
    id: Date.now(),
    description,
    amount,
    type: amount > 0 ? 'income' : 'expense',
  });

  localStorage.setItem('entries', JSON.stringify(entries));
  updateUI();
  resetFields();
}

function resetFields() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function updateUI() {
  const filter = document.querySelector('.filters input:checked').value;
  const filteredEntries = filter === 'all' ? entries : entries.filter(e => e.type === filter);

  const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + Math.abs(e.amount), 0);

  document.getElementById('total-income').innerText = `Rs ${income.toFixed(2)}`;
  document.getElementById('total-expense').innerText = `Rs ${expense.toFixed(2)}`;
  document.getElementById('net-balance').innerText = `Rs ${(income - expense).toFixed(2)}`;

  const entriesList = document.getElementById('entries');
  entriesList.innerHTML = '';

  filteredEntries.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${entry.description}: Rs ${entry.amount.toFixed(2)}</span>
      <div class="actions">
        <button onclick="editEntry(${entry.id})">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </div>
    `;
    entriesList.appendChild(li);
  });
}


function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  localStorage.setItem('entries', JSON.stringify(entries));
  updateUI();
}

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  document.getElementById('description').value = entry.description;
  document.getElementById('amount').value = entry.amount;

  deleteEntry(id);
}
