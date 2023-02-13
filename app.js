let workPayment = 0;
let bank = 0;
let loan = 0;
let allComputers = [];

const btnWorkAction = document.getElementById("btnWorkAction");
const btnBankAction = document.getElementById("btnBankAction");
const txtWorkPayArea = document.getElementById("txtWorkPay");
const computerDisplayArea = document.getElementById("computorDisplay");
const computerDropDown = document.getElementById("computerDropDown");
const repayLoanArea = document.getElementById("RepayLoanArea");
const btnBuyComputerAction = document.getElementById("btnBuyComputerAction");
const btnBankLoanAction = document.getElementById("btnBankLoanAction");
const txtBankLoanArea = document.getElementById("txtBankBalance");
const computerSelectedArea = document.getElementById("computerSelectedArea");

btnWorkAction.addEventListener("click", handleWorkAction);
btnBankAction.addEventListener("click", handleBankAction);
btnBankLoanAction.addEventListener("click", handleLoanAction);
btnBuyComputerAction.addEventListener("click", handleBuyComputerAction);

computerDropDown.addEventListener("change", () =>
  displayComputers(computerDropDown.value - 1)
);

loadComputer();

function handleWorkAction() {
  console.log("Zug zug");
  workPayment += 100;
  updatePay();
}

function handleBankAction() {
  console.log("IM RICH!");
  if (loan > 0) {
    let payback = workPayment * 0.1;
    if (payback > loan) {
      bank += workPayment - loan;
      loan = 0;
      repayLoanArea.innerHTML = "";
    } else {
      loan -= payback;
      bank += workPayment - payback;
    }
  } else {
    bank += workPayment;
  }
  workPayment = 0;
  updatePay();
  updateBalance();
}

function updatePay() {
  txtWorkPayArea.innerText = `Pay: ${new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
  }).format(workPayment)}`;
}

function updateBalance() {
  txtBankLoanArea.innerText = `Balance: ${new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
  }).format(bank)}`;
  if (loan > 0) {
    txtBankLoanArea.innerText += `\nLoan: ${new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
    }).format(loan)}`;
  }
}

function handleLoanAction() {
  console.log("Yikes...");
  if (loan > 0) {
    alert("You already have a loan dummy!");
    return;
  }
  loan = prompt("How much would you like to loan?");
  if (isNaN(loan) || !loan) {
    alert("Loan is obviously a number...");
    loan = 0;
    return;
  }
  if (loan > bank * 2) {
    alert("You can not loan more than double of your balance!");
    loan = 0;
    return;
  }
  bank += parseInt(loan);
  let repayLoanButton = document.createElement("button");
  repayLoanButton.innerText = "Repay Loan";
  repayLoanButton.addEventListener("click", handleRepayLoan);
  repayLoanButton.id = "repayLoanButton";
  repayLoanArea.append(repayLoanButton);
  updateBalance();
}

function loadComputer() {
  fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      allComputers = data;
    })
    .then(function () {
      makeComputerDropDown();
      displayComputers(0);
    })
    .catch(function (error) {
      console.error("Something went wrong", error);
    });
}

function displayComputers(index) {
  currentPC = allComputers[index];
  computerSelectedArea.innerHTML = "";
  computerDisplayArea.innerHTML = "";
  let computerFeatures = document.createElement("div");
  let computerFeatureTitle = document.createElement("h3");
  computerFeatureTitle.innerText = "Features: ";
  computerFeatures.append(computerFeatureTitle);
  let computerFeatureList = document.createElement("ul");
  computerFeatureList.id = "featureList";
  computerFeatures.append(computerFeatureList);
  for (feature of currentPC.specs) {
    let featureItem = document.createElement("li");
    featureItem.innerText += `${feature}`;
    computerFeatureList.append(featureItem);
  }

  computerSelectedArea.append(computerFeatures);
  let computerImage = document.createElement("img");
  computerImage.src = `https://hickory-quilled-actress.glitch.me/${currentPC.image}`;
  computerImage.width = 300;
  computerDisplayArea.append(computerImage);
  let computerTitle = document.createElement("h2");
  computerTitle.innerText = `${currentPC.title}`;
  computerDisplayArea.append(computerTitle);
  let computerText = document.createElement("p");
  computerText.innerText = `${currentPC.description}`;
  computerDisplayArea.append(computerText);
  let computerPrice = document.createElement("h3");
  computerPrice.innerText = `${currentPC.price} NOK`;
  computerDisplayArea.append(computerPrice);
}

function makeComputerDropDown() {
  allComputers.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.id;
    optionElement.innerText = element.title;
    computerDropDown.append(optionElement);
  });
}

function handleRepayLoan() {
  if (workPayment > loan) {
    bank += workPayment - loan;
    loan = 0;
  } else {
    loan -= workPayment;
  }
  workPayment = 0;
  if (loan == 0) {
    repayLoanArea.innerHTML = "";
  }
  updateBalance();
  updatePay();
}

function handleBuyComputerAction() {
  let computerIndex = computerDropDown.value - 1;
  let priceOfCurrentPC = allComputers[computerIndex].price;
  if (priceOfCurrentPC > bank) {
    alert("You can not affort this PC. Work harder!");
    return;
  }

  bank -= priceOfCurrentPC;
  updateBalance();
  alert(
    `Thank you for your patronage. Hope you and your ${allComputers[computerIndex].title} will live happily ever after!`
  );
}
