const applicationState = {
    requests: []
}

const API = "http://localhost:8000"

export const fetchRequests = async () => {
    const dataFetch = await fetch(`${API}/requests`)
    const serviceRequests = await dataFetch.json()
    // Store the external state in application state
    applicationState.requests = serviceRequests
}




