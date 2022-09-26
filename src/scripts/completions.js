import { getCompletions , editRequest, getRequests, deleteCompletion } from "./dataAccess.js";

export const Completions = () => {

    const completions = getCompletions()
    console.log(`COMPLETIONS: `, completions)


    const convertCompletionToListElement = (completion) => {
        
        return `
                <li><b>Plumber: </b>${completion.plumber.name}</li>
                <li><b>Description: </b>${completion.request.description}</li>
                <li><b>Address: </b>${completion.request.address}</li>
                <li><b>Budget: </b>$${completion.request.budget}</li>
                <li><b>Needed By: </b>${completion.request.neededBy}</li>
                <li><b>Completed On: </b>${completion.date_created}</li><br>
                <button class="button" id="undo--${completion.request.id},${completion.id}">Reactivate</button><br><br>`
                
    }
    let html = `<ul>${completions.map(convertCompletionToListElement).join("")}</ul>`

    return html
}

const setupIncompleteRequest = (requestId) => {
    let object = {
        id: requestId,
        isComplete: false
    }
    editRequest(object)
}

const mainContainer = document.querySelector("#container")

mainContainer.addEventListener(
    "click",
    click => {
        if (click.target.id.startsWith("undo")) {
        const requestId = parseInt(click.target.id.split("--")[1])
        const completionId = parseInt(click.target.id.split(",")[1])
        console.log(`here is the completion ID -->`,completionId)
        console.log(`here is the request ID that will be moved back to pending --> #`,requestId)
        const completions = getCompletions()
        for (const completion of completions) {
            if (completion.request.id === requestId) {
            console.log(`COMPLETION:`,completion)
            setupIncompleteRequest(requestId)
            deleteCompletion(completionId)
        }
        }
        }
    })