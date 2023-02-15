let workPayment = 0;
let bank = 0;
let loan = 0;
let allComputers = [];

// Loading in txt area and button elements. 
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

// Assigning the functions to the different buttons and dropdowns. 
btnWorkAction.addEventListener("click", handleWorkAction);
btnBankAction.addEventListener("click", handleBankAction);
btnBankLoanAction.addEventListener("click", handleLoanAction);
btnBuyComputerAction.addEventListener("click", handleBuyComputerAction);
computerDropDown.addEventListener("change", () =>
  displayComputers(computerDropDown.value - 1)
);

/** 
 *  Initial fetch of data to display. 
 */
loadComputer();

/**
 * Function for the "Work"-Button. It simply works. 
 */
function handleWorkAction() {
  console.log("Zug zug");
  workPayment += 100;
  updatePay();
}

/**
 * Fucntion for the "Bank"-Button. 
 * It transfers money to the bank, and if you have a loan it uses 10% of the money to pay back the loan. 
 */
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

/**
 * Updates the Pay area. This one is called whenever there is a change in the "Work" area. 
 */
function updatePay() {
  txtWorkPayArea.innerText = `Pay: ${new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
  }).format(workPayment)}`;
}

/**
 * Updates the Banker area. Call it whenever there is a change in the bank. 
 * It also checks if there is a loan and adds text to see how much is left. 
 */
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

/**
 * Used when a loan is taken. It will first check if you are allowed to take a loan. 
 * Loan conditions are: Only 1 loan at the time. And you can only loan double of what you have in the bank. 
 */
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

/**
 * The GET call to fetch all the data about the laptops and display the first one in the array. 
 */
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

/**
 * This one display the laptops. First it makes the Select section where the Features go, then the full display with image. 
 * It will wipe out the last one displayed, and create new elements for itself to go into. 
 * I could obviously have made all these in the HTML, and just edited the inside of the elements instead of making new
 * ones every time, but this is what I went with this time, and I hope I will not lose marks for it. 
 * @param {int} index Specifies the ID of the laptop displayed. 
 */
function displayComputers(index) {
  currentPC = allComputers[index];
  computerSelectedArea.innerHTML = "";
  computerDisplayArea.innerHTML = "";

  // Feature list next to the dropdown
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

  // Details with image. 
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

/**
 * This one makes the dropdown menu of all laptops. 
 * It is called right after the API has been called. 
 */
function makeComputerDropDown() {
  allComputers.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.id;
    optionElement.innerText = element.title;
    computerDropDown.append(optionElement);
  });
}

/**
 * Handles the "Repay Loan"-button. 
 * Checks if there is left over money that will be added to the bank, and if the loan is paid back remove the button. 
 */
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
/**
 * The "BUY NOW"-button. 
 * Checks if you have the funds to buy the current selected laptop and reduces you bank balance if you buy it.
 * And if yuo don't have the funds tells you that you can't buy it. 
 */
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
