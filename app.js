console.log("Hello World!")
let workPayment = 0;
let bank = 0;
let loan = 0;

let btnWorkAction = document.getElementById("btnWorkAction")
let btnBankAction = document.getElementById("btnBankAction")
let txtWorkPayArea = document.getElementById("txtWorkPay")

let btnBankLoanAction = document.getElementById("btnBankLoanAction")
let txtBankLoanArea = document.getElementById("txtBankBalance")

btnWorkAction.addEventListener("click", handleWorkAction)
btnBankAction.addEventListener("click", handleBankAction)
btnBankLoanAction.addEventListener("click", handleLoanAction)

function handleWorkAction(){
    console.log("Zug zug")
    workPayment += 100
    updatePay()
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