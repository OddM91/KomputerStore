console.log("Hello World!")
let workPayment = 0;
let bank = 0;
let loan = 0;
let globalItem = null;

let btnWorkAction = document.getElementById("btnWorkAction")
let btnBankAction = document.getElementById("btnBankAction")
let txtWorkPayArea = document.getElementById("txtWorkPay")
let computerDisplayArea = document.getElementById("computorDisplay")
let computerDropDown = document.getElementById("computerDropDown")

let btnBankLoanAction = document.getElementById("btnBankLoanAction")
let txtBankLoanArea = document.getElementById("txtBankBalance")

btnWorkAction.addEventListener("click", handleWorkAction)
btnBankAction.addEventListener("click", handleBankAction)
btnBankLoanAction.addEventListener("click", handleLoanAction)
computerDropDown.addEventListener("change", function(){
    displayComputers(computerDropDown.value-1);
})

loadComputer()

function handleWorkAction(){
    console.log("Zug zug")
    workPayment += 100
    updatePay()
    console.log(globalItem)
}

function handleBankAction(){
    console.log("IM RICH!")
    if(loan > 0){
        let payback = workPayment*0.1
        if(payback > loan){
            bank += workPayment-loan
            loan = 0
        }
        else{
            loan -= payback;
            bank += workPayment - payback
        }
    }else{
        bank += workPayment
    }
    workPayment = 0
    updatePay()
    updateBalance()
}

function updatePay(){
    txtWorkPayArea.innerText = `Pay: ${new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(workPayment)}`
}

function updateBalance(){
    txtBankLoanArea.innerText = `Balance: ${new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(bank)}`
    if(loan > 0){
        txtBankLoanArea.innerText += `\nLoan: ${new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(loan)}`
    }
}

function handleLoanAction(){
    console.log("Yikes...")
    if(loan > 0){
        alert("You already have a loan dummy!")
        return
    }
    loan = prompt("How much would you like to loan?")
    if(loan > bank*2){
        alert("You can not loan more than double of your balance!")
        loan = 0
        return
    }
    bank += parseInt(loan)
    updateBalance()
}

function loadComputer(){
    fetch(" https://hickory-quilled-actress.glitch.me/computers")
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log("Here is the title of the first one: " + data[0].title)
        globalItem = data;
    }).then(function () {
        makeComputerDropDown()
        displayComputers(0)
    })
    .catch(function (error){
        console.error("Something went wrong", error);
    })
    
}

function displayComputers(index){
    computerDisplayArea.innerText = `Title: ${globalItem[index].title}, \nDescription: ${globalItem[index].description}, \nSpecs: ${globalItem[index].specs}, \nPrice: ${globalItem[index].price}, \nStock: ${globalItem[index].stock}, \nActive: ${globalItem[index].active}, \nImage: ${globalItem[index].image}`
}

function makeComputerDropDown(){
    let result = ``;
    globalItem.forEach(element => {
        result += `<option value="${element.id}">${element.title}</option>`
    });
    computerDropDown.innerHTML = result;
}