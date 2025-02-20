// Add these at the top of script.js
const genzSounds = {
  add: new Audio('https://assets.mixkit.co/active_storage/sfx/257/257-preview.mp3'),
  delete: new Audio('https://assets.mixkit.co/active_storage/sfx/263/263-preview.mp3'),
  hover: new Audio('https://assets.mixkit.co/active_storage/sfx/244/244-preview.mp3')
};

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const expenseDate = document.getElementById('expense-date');
const expenseList = document.getElementById('expenses');
const totalAmountElement = document.getElementById('total-amount');
const searchInput = document.getElementById('search');
const filterCategory = document.getElementById('filter-category');
const exportBtn = document.getElementById('export-btn');
const budgetLimitInput = document.getElementById('budget-limit');
const setBudgetBtn = document.getElementById('set-budget');
const budgetWarning = document.getElementById('budget-warning');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
let budgetLimit = localStorage.getItem('budgetLimit') || 0;

// Render expenses
function renderExpenses(filteredExpenses = expenses) {
  expenseList.innerHTML = '';
  filteredExpenses.forEach((expense, index) => {
    const expenseItem = document.createElement('li');
    expenseItem.innerHTML = `
      <span>${expense.name} (${expense.category}) - ${expense.date}</span>
      <span>$${expense.amount.toFixed(2)}</span>
      <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(expenseItem);
  });
  totalAmountElement.textContent = totalAmount.toFixed(2);
  checkBudget();
}

// Add Expense
expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = expenseName.value;
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;
  const date = expenseDate.value;

  if (name === '' || isNaN(amount) || category === '' || date === '') {
    alert('Please fill in all fields.');
    return;
  }

  const expense = { name, amount, category, date };
  expenses.push(expense);
  totalAmount += amount;

  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  genzSounds.add.play();
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#1dd1a1', '#48dbfb']
  });

  expenseName.value = '';
  expenseAmount.value = '';
  expenseCategory.value = '';
  expenseDate.value = '';
});

// Edit Expense
function editExpense(index) {
  const expense = expenses[index];
  expenseName.value = expense.name;
  expenseAmount.value = expense.amount;
  expenseCategory.value = expense.category;
  expenseDate.value = expense.date;

  expenses.splice(index, 1);
  totalAmount -= expense.amount;
  renderExpenses();
}

// Modify the deleteExpense function
function deleteExpense(index) {
  genzSounds.delete.play();
  const deletedExpense = expenses.splice(index, 1)[0];
  totalAmount -= deletedExpense.amount;
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
}

// Search Expenses
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(searchTerm)
  );
  renderExpenses(filteredExpenses);
});

// Filter by Category
filterCategory.addEventListener('change', () => {
  const category = filterCategory.value;
  const filteredExpenses = category
    ? expenses.filter(expense => expense.category === category)
    : expenses;
  renderExpenses(filteredExpenses);
});

// Export as CSV
exportBtn.addEventListener('click', () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    expenses.map(expense => `${expense.name},${expense.amount},${expense.category},${expense.date}`).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'expenses.csv');
  document.body.appendChild(link);
  link.click();
});

// Budget Limit
setBudgetBtn.addEventListener('click', () => {
  const limit = parseFloat(budgetLimitInput.value);
  if (!isNaN(limit)) {
    budgetLimit = limit;
    localStorage.setItem('budgetLimit', budgetLimit);
    checkBudget();
  }
});

function checkBudget() {
  if (totalAmount > budgetLimit && budgetLimit > 0) {
    budgetWarning.classList.add('visible');
  } else {
    budgetWarning.classList.remove('visible');
  }
}

// Initial Render
renderExpenses();
budgetLimitInput.value = budgetLimit;
checkBudget();

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const container = document.querySelector('.container');

// Check local storage for theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.add(savedTheme);
container.classList.add(savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Toggle Theme
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  body.classList.toggle('light');
  container.classList.toggle('dark');
  container.classList.toggle('light');

  const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
  themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
});

// Add hover effects to buttons
document.querySelectorAll('.genz-button').forEach(button => {
  button.addEventListener('mouseenter', () => {
    genzSounds.hover.play();
  });
});