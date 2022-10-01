"use strict";

/////////////////////////////////////////////////////////////
// Data
/////////////////////////////////////////////////////////////

const accounts = [
  {
    owner: "Nasim Helal",
    movements: [2500, 500, -750, 1200, 3200, -1500, 500, 1200, -1750, 1800],
    interestRate: 1.5, // %
    password: 1234,
    movementsDates: [
      "2021-11-18T21:31:17.178Z",
      "2021-12-23T07:42:02.383Z",
      "2022-01-28T09:15:04.904Z",
      "2022-04-01T10:17:24.185Z",
      "2022-07-08T14:11:59.604Z",
      "2022-09-10T17:01:17.194Z",
      "2022-09-12T23:36:17.929Z",
      "2022-09-15T12:51:31.398Z",
      "2022-09-19T06:41:26.190Z",
      "2022-09-21T08:11:36.678Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Mowsumi Helal",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -300, 1500, -1850],
    interestRate: 1.3, // %
    password: 5678,
    movementsDates: [
      "2021-12-11T21:31:17.671Z",
      "2021-12-27T07:42:02.184Z",
      "2022-01-05T09:15:04.805Z",
      "2022-02-14T10:17:24.687Z",
      "2022-03-12T14:11:59.203Z",
      "2022-05-16T17:01:17.392Z",
      "2022-08-10T23:36:17.522Z",
      "2022-09-03T12:51:31.491Z",
      "2022-09-18T06:41:26.394Z",
      "2022-09-21T08:11:36.276Z",
    ],
    currency: "EUR",
    locale: "en-GB",
  },
];

/////////////////////////////////////////////////////////////
// Elements
/////////////////////////////////////////////////////////////

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");
//////////////////////////////////////////////
//show currency
///////////////////////////////////////////////
function showCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

/////////////////////////////////////////////////////////////////////////
//Display movements
/////////////////////////////////////////////////////////////////////////
function displayMovements(account, sort = false) {
  containerMovements.innerHTML = "";
  const moves = sort
    ? account.movements.slice(0).sort((a, b) => a - b)
    : account.movements;

  moves.forEach((move, index) => {
    const movetype = move > 0 ? "deposit" : "withdrawal";
    const moveWithCurrency = showCurrency(
      move,
      account.locale,
      account.currency
    );
    const html = `
<div class="movements-row">
        <div class="movements-type movements-type-${movetype}">${
      index + 1
    } deposit</div>
        <div class="movements-date">5 days ago</div>
        <div class="movements-value">${moveWithCurrency}</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

/////////////////////////////////////////////////////////////////////////
//Display summary
/////////////////////////////////////////////////////////////////////////
function displaySummary(account) {
  //display income
  const income = account.movements
    .filter((move) => move > 0)
    .reduce((total, deposit) => total + deposit, 0);

  labelSumIn.textContent = showCurrency(
    income,
    account.locale,
    account.currency
  );
  //display outcome
  const outcome = account.movements
    .filter((move) => move < 0)
    .reduce((total, withdrawal) => total + withdrawal, 0);
  labelSumOut.textContent = showCurrency(
    Math.abs(outcome),
    account.locale,
    account.currency
  );
  //display interest
  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((total, finalInterest) => finalInterest + total, 0);
  labelSumInterest.textContent = showCurrency(
    interest,
    account.locale,
    account.currency
  );
}

/////////////////////////////////////////////////////////////////////////
//Display current balance
/////////////////////////////////////////////////////////////////////////

function displayBalance(account) {
  account.balance = account.movements.reduce((total, move) => total + move, 0);
  labelBalance.textContent = showCurrency(
    account.balance,
    account.locale,
    account.currency
  );
}

/////////////////////////////////////////////////////////////////////////
//update ui
/////////////////////////////////////////////////////////////////////////
function updateUi(currentAccount) {
  displayMovements(currentAccount);
  displaySummary(currentAccount);
  displayBalance(currentAccount);
}

/////////////////////////////////////////////////////////////////////////
//username creation
/////////////////////////////////////////////////////////////////////////

function createusername(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word.at(0))
      .join("");
  });
}
createusername(accounts);

/////////////////////////////////////////////////////////////////////////
//login
/////////////////////////////////////////////////////////////////////////
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.password === +inputLoginPassword.value) {
    setTimeout(() => {
      labelWelcome.textContent = `Welcome back,${currentAccount.owner
        .split(" ")
        .at(0)}`;
      containerApp.style.opacity = 1;
      //update UI
      updateUi(currentAccount);
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = "Oops, login failed";
      containerApp.style.opacity = 0;
    }, 3000);
  }
  //clear fields
  inputLoginUsername.value = inputLoginPassword.value = "";
  inputLoginPassword.blur();
});
/////////////////////////////////////////////////////////////////////////
//Transfer
/////////////////////////////////////////////////////////////////////////
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  const transferAmount = +inputTransferAmount.value;

  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    currentAccount.username !== receiverAccount.username &&
    receiverAccount
  ) {
    setTimeout(() => {
      //trasnfer balance
      currentAccount.movements.push(-transferAmount);
      receiverAccount.movements.push(transferAmount);
      //update ui
      updateUi(currentAccount);
      //clear fields
      inputTransferTo.value = inputTransferAmount.value = "";
      inputTransferAmount.blur();
      // welcome success messge
      labelWelcome.textContent = `${transferAmount}$ is transfer to ${receiverAccount.owner}`;
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = `Transfer failed   `;
    }, 3000);
  }
});
/////////////////////////////////////////////////
///loan
/////////////////////////////////////////////////
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const loanAmount = +inputLoanAmount.value;

  if (
    loanAmount > 0 &&
    currentAccount.movements.some((move) => move >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      //add loan to current account
      currentAccount.movements.push(loanAmount);
      //update ui
      updateUi(currentAccount);
      //show confirmation sms
      labelWelcome.textContent = "loan successfull";
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = "loan is not successfull";
    }, 3000);
  } //clear field
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});
////////////////////////////////////////////
//close account
///////////////////////////////////////////////
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.password === +inputClosePassword.value
  ) {
    const deletableAccountIndex = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    setTimeout(() => {
      //delete
      accounts.splice(deletableAccountIndex, 1);
      //hide ui
      containerApp.style.opacity = 0;
      //sms
      labelWelcome.textContent = `account deleted `;
    }, 3000);
  } else {
    setTimeout(() => {
      labelWelcome.textContent = `account is not deleted `;
    }, 3000);
  }

  //clear fields
  inputCloseUsername.value = inputClosePassword.value = "";
  inputClosePassword.blur();
});

////////////////////////////////////////////////////////
//sorting
//////////////////////////////////////////////////
let sortedMove = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortedMove);
  sortedMove = !sortedMove;
});
