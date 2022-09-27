import { sendRequest } from "./dataAccess.js"

export const ServiceForm = () => {
    let html = 
    `
    <div class="field">
        <label class="label" for="serviceDescription">Description</label>
        <textarea name="serviceDescription" class="input"></textarea>
    </div>
    <div class="field">
        <label class="label" for="serviceAddress">Address</label>
        <input type="text" name="serviceAddress" class="input" />
    </div>
    <div class="field">
        <label class="label" for="serviceBudget">Budget</label>
        <input type="number" name="serviceBudget" class="input" />
    </div>
    <div class="field">
        <label class="label" for="serviceDate">Date needed</label>
        <input type="date" name="serviceDate" class="input" />
    </div><br>

    <button class="button" id="submitRequest">Submit Request</button>
    `

    return html
}

const mainContainer = document.querySelector("#container")

mainContainer.addEventListener("click", clickEvent => {
    if (clickEvent.target.id.startsWith("submitRequest")) {
        // Get what the user typed into the form fields
        const userDescription = document.querySelector("textarea[name='serviceDescription']").value
        const userAddress = document.querySelector("input[name='serviceAddress']").value
        const userBudget = document.querySelector("input[name='serviceBudget']").value
        const userDate = document.querySelector("input[name='serviceDate']").value

        // Make an object out of the user input
        const dataToSendToAPI = {
            description: userDescription,
            address: userAddress,
            budget: userBudget,
            neededBy: userDate,
            isComplete: false,
            plumberId: 0
        }

        // Send the data to the API for permanent storage
        sendRequest(dataToSendToAPI)
    }
})

//Click the Submit Request button if user clicks Enter and saveRequest button is not on the DOM
mainContainer.addEventListener("keypress", event => {
    let editButton = document.querySelector(`[id^="saveRequest--"]`)
    if (event.key === "Enter" && editButton === null) {
        event.preventDefault();
        document.getElementById("submitRequest").click()
    }
})



