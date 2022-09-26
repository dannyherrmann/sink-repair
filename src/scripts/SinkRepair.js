import { ServiceForm } from "./ServiceForm.js"
import { Requests } from "./Requests.js"
import { Completions } from "./completions.js"

export const SinkRepair = () => {
    return `
    <h1>Maude and Merle's Sink Repair</h1>
    <section class="serviceForm">
        ${ServiceForm()}
    </section>

    <section class="serviceRequests">
    <h2>Service Requests (In Progress)</h2>
        <div class="inProgressRequests">
            
            ${Requests()}
        </div>
        <h2>Completed Requests</h2>
        <div class="completedRequests">
            
            ${Completions()}
        </div>
    </section>
    `
}



