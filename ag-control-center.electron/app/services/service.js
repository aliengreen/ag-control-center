/**
 * Base service class to provide event listener setup
 */
export class Service {
    /** Constructor
     * @param { Object } props - Service properties
     * @param { Object } props.events - Component event listeners
     * @param { Object } props.data - Component data properties
     */
    constructor(props = {}) {
        if (props.events) {
            this.createEvents(props.events)
            this.props = props.events;
        }
    }

    /** Read "event" service parameters, and attach event listeners for each */
    createEvents(events) {
        Object.keys(events).forEach((eventName) => {
            window.addEventListener(eventName, events[eventName], false)
        })
    }

    /** Read "event" service parameters, and remove event listeners for each */
    removeEvents(events) {
        Object.keys(events).forEach((eventName) => {
            window.removeEventListener(eventName, events[eventName], false)
        })
    }

    /** Remove all events from service */
    removaAllEvents() {
        this.removeEvents(this.props);
    }

    /** Trigger a service event with the provided "detail" payload */
    triggerEvent(eventName, detail) {
        const event = new window.CustomEvent(eventName, { detail })
        window.dispatchEvent(event)
    }

}