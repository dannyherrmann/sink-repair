const applicationState = {
    requests: [],
    plumbers: [],
    completions: []
}

const API = "http://localhost:8088"

export const fetchRequests = async () => {
    const dataFetch = await fetch(`${API}/requests/?_expand=plumber`)
    const serviceRequests = await dataFetch.json()
    // Store the external state in application state
    applicationState.requests = serviceRequests
}

export const fetchPlumbers = async () => {
    const dataFetch = await fetch(`${API}/plumbers`)
    const plumbers = await dataFetch.json()
    applicationState.plumbers = plumbers
}

export const fetchCompletions = async () => {
    const dataFetch = await fetch(`${API}/completions/?_expand=request&_expand=plumber`)
    const completions = await dataFetch.json()
    applicationState.completions = completions
}

export const getRequests = () => {
    return applicationState.requests.map(request => ({...request}))
}

export const getPlumbers = () => {
    return applicationState.plumbers.map(plumber => ({...plumber}))
}

export const getCompletions = () => {
    return applicationState.completions.map(completion => ({...completion}))
}


export const sendRequest = async (newRequest) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newRequest)
    }
    const response = await fetch(`${API}/requests`, fetchOptions)
    const responseJson = await response.json(response)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

const mainContainer = document.querySelector("#container")

export const deleteRequest = async (id) => {
    await fetch(`${API}/requests/${id}`, { method: "DELETE" })
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const sendCompletion = async (newCompletion) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCompletion)
    }
    const response = await fetch(`${API}/completions`, fetchOptions)
    const responseJson = await response.json(response)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const editRequest = async (object) => {

    const fetchOptions = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    }
    const response = await fetch(`${API}/requests/${object.id}`, fetchOptions)
    const responseJson = await response.json(response)
    document.dispatchEvent(new CustomEvent("stateChanged"))
}

export const deleteCompletion = async (id) => {
    await fetch(`${API}/completions/${id}`, { method: "DELETE" })
    document.dispatchEvent(new CustomEvent("stateChanged"))
}







