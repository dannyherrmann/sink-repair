import { getRequests, deleteRequest, getPlumbers, sendCompletion, editRequest } from "./dataAccess.js"

export const Requests = () => {

    const requests = getRequests()

    const plumbers = getPlumbers()

    console.log(`PLUMBERS:`,plumbers)

    console.log(`requests --> `, requests)
    
    const convertRequestToListElement = (request) => {
        if (request.isComplete === false && request.plumberId != 0) {
        return `
                <div class="serviceRequest" id="${request.id}"> 
                <li><b>Description: </b>${request.description}</li>
                <li><b>Address: </b>${request.address}</li>
                <li><b>Budget: </b>$${request.budget}</li>
                <li><b>Needed By: </b>${request.neededBy}</li>
                <li><b>Plumber Assigned: </b>${request.plumber.name}</li><br>
                <button class="request__edit" id="editRequest--${request.id}">Edit</button>
                <button class="request__delete" id="request--${request.id}">Delete</button>
                <button class="request__complete" id="completeRequest--${request.id},${request.plumberId}">Complete</button><br><br>
                <select class="plumbers" id="plumbers">
                <option value="">Re-Assign Plumber</option>
                ${plumbers.map(plumber => {return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`}).join("")}
                </select></div>`} 
                
                else if (request.isComplete === false && request.plumberId === 0) { 
                
        return  `
                <div class="serviceRequest" id="${request.id}"> 
                <li><b>Description: </b>${request.description}</li>
                <li><b>Address: </b>${request.address}</li>
                <li><b>Budget: </b>$${request.budget}</li>
                <li><b>Needed By: </b>${request.neededBy}</li><br>
                <button class="request__edit" id="editRequest--${request.id}">Edit</button>
                <button class="request__delete" id="request--${request.id}">Delete</button><br><br>
                <select class="plumbers" id="plumbers">
                <option value="">Assign Plumber</option>
                ${plumbers.map(plumber => {return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`}).join("")}
                </select></div>
                
                `
                }
            
            
            }

    let html = `<ul>${requests.map(convertRequestToListElement).join("")}</ul>`

    return html
}


    const convertRequestToEdit = (request) => {

        let div = request.id

        document.getElementById(div).innerHTML = `

        <div class="editPage">

            <div class="field">
                <label class="label" for="newDescription">Description</label>
                <textarea name="newDescription" class="input">${request.description}</textarea>
            </div>
            <div class="field">
                <label class="label" for="newAddress">Address</label>
                <input type="text" name="newAddress" class="input" value="${request.address}"/>
            </div>

            <div class="field">
                <label class="label" for="newBudget">Budget</label>
                <input type="number" name="newBudget" class="input" value="${request.budget}"/>
            </div>

            <div class="field">
                <label class="label" for="newDate">Date needed</label>
                <input type="date" name="newDate" class="input" value="${request.neededBy}"/>
            </div>
        
            <button class="button" id="saveRequest--${request.id}">Save Request</button>
            <button class="button" id="cancelEdit">Cancel</button>

        </div>
        `
    }

const mainContainer = document.querySelector("#container")

//Delete request below

mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const requestId = parseInt(click.target.id.split("--")[1])
        deleteRequest(requestId)
    }
})

mainContainer.addEventListener(
    "click",
    click => {
        if (click.target.id.startsWith("cancel")) {
            document.dispatchEvent(new CustomEvent("stateChanged"))
        }
    }
)


//Convert service request list element to editable form when user clicks Edit button

mainContainer.addEventListener(
    "click",
    click => {
        if (click.target.id.startsWith("editRequest--")) {
        const requestId = parseInt(click.target.id.split("--")[1])
        console.log(`here is the request ID that will be edited --> #`,requestId)
        const requests = getRequests()
        for (const request of requests) {
            if (request.id === requestId) {
            console.log(request)
            convertRequestToEdit(request)
        }
        }
        }
    })

    mainContainer.addEventListener("click", click => {
        if (click.target.id.startsWith("saveRequest--")) {
            // Get what the user typed into the form fields
            const userDescription = document.querySelector("textarea[name='newDescription']").value
            const userAddress = document.querySelector("input[name='newAddress']").value
            const userBudget = document.querySelector("input[name='newBudget']").value
            const userDate = document.querySelector("input[name='newDate']").value

            const requestId = parseInt(click.target.id.split("--")[1])
            console.log(`requestId to Save: `, requestId)

            // Make an object out of the user input
            const dataToSendToAPI = {
                id: requestId,
                description: userDescription,
                address: userAddress,
                budget: userBudget,
                neededBy: userDate,
            }

            console.log(`dataToSendToAPI`,dataToSendToAPI)
            // Send the data to the API for permanent storage
            editRequest(dataToSendToAPI)
        }
    })

// //Click the Save Request button if user clicks Enter and the saveRequest button is on the DOM
    mainContainer.addEventListener("keypress", event => {
        let button = document.querySelector(`[id^="saveRequest--"]`)
        if (event.key === "Enter" && button != null) {
            event.preventDefault();
            document.querySelector(`[id^="saveRequest--"]`).click()
       }
    })

//SetupCompleteRequest is used within the change event listener to switch the request's isComplete prop to true instead of false

const setupCompleteRequest = (requestId) => {
    let object = {
        id: requestId,
        isComplete: true
    } 
    editRequest(object)
}

mainContainer.addEventListener(
    "click",
    click => {
        if (click.target.id.startsWith("completeRequest--")) {
            const requestId = parseInt(click.target.id.split("--")[1])
            const plumberId = parseInt(click.target.id.split(",")[1])
            console.log(requestId)
            console.log(plumberId)
            let dateEntered = new Date()
            dateEntered = dateEntered.toLocaleDateString()
            const completion = {
                requestId: requestId,
                plumberId: plumberId,
                date_created: dateEntered
            }
            setupCompleteRequest(requestId)
            sendCompletion(completion)
        }
    }
)

mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")
            console.log(requestId)
            console.log(`plumbe id changed:`,plumberId)
            const assignPlumber = {
                id: requestId,
                plumberId: plumberId
            }
            editRequest(assignPlumber)
        }
    }
)