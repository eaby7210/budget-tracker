const add = document.querySelector(".add");
const amount = document.querySelector(".amount");
const incomeList = document.querySelector("ul.income_list");
const expenseList = document.querySelector("ul.expense-list");
const balance = document.querySelector("#balance");
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");
let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function amountColor(target) {
  const value = target.value;
  if (value < 0) {
    target.style.backgroundColor = "#ffc1c1";
  } else if (value > 0) {
    target.style.backgroundColor = "#caffc3";
  } else {
    target.style.backgroundColor = "#fff";
  }
}

function liTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                <span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}

function addTransationDOM(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += liTemplate(id, source, amount, time);
  } else {
    expenseList.innerHTML += liTemplate(id, source, amount, time);
  }
}

function addTransation(source, amount) {
  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 10000),
    source,
    amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`,
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransationDOM(transaction.id, source, amount, transaction.time);
  updateStats();
}
function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateStats();
}

function getTransaction() {
  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      incomeList.innerHTML += liTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    } else {
      expenseList.innerHTML += liTemplate(
        transaction.id,
        transaction.source,
        transaction.amount,
        transaction.time
      );
    }
  });
}

function updateStats() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);
  const updatedexpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);
  const updateBalance = updatedIncome - updatedexpense;
  balance.textContent = updateBalance;
  income.textContent = updatedIncome;
  expense.textContent = updatedexpense;
}

//-----eventListners below---------

add.addEventListener("submit", (event) => {
  event.preventDefault();
  if (add.source.value.trim() === "" || add.amount.value.trim() === "") {
    return alert("Invalid Entries");
  }
  addTransation(add.source.value.trim(), Number(add.amount.value.trim()));
  add.reset();
});

amount.addEventListener("change", () => {
  amountColor(amount);
});

amount.addEventListener("keyup", () => {
  amountColor(amount);
});
incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
  }
});
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();

    deleteTransaction(Number(event.target.parentElement.dataset.id));
  }
});
//initialise
getTransaction();
updateStats();
