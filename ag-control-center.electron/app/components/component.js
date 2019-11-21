/**
 * Base component class to provide view ref binding, template insertion, and event listener setup
 */
export class Component {
  /** SearchPanel Component Constructor
   * @param { String } placeholderId - Element ID to inflate the component into
   * @param { Object } props - Component properties
   * @param { Object } props.events - Component event listeners
   * @param { Object } props.data - Component data properties
   * @param { String } template - HTML template to inflate into placeholder id
   */
  constructor(placeholderId, props = {}, template) {

    if (props.dataset) {
      this._dataset = props.dataset;
      this.polyglot = props.dataset.polyglot;
    }

    this.setupTemplate(placeholderId, template);

    if (props.events) {
      this.createEvents(props.events)
      this.props = props.events;
    }

  }

  /* Setup template and all references */
  setupTemplate(placeholderId, template) {
    this.componentElem = document.getElementById(placeholderId)

    if (template) {
      // Load template into placeholder element
      this.componentElem.innerHTML = template

      if (this.polyglot) {
        const trnElems = this.componentElem.querySelectorAll('[data-trn]')
        trnElems.forEach((elem) => {
          this.translateElement(elem);
        });
      }

      // Find all refs in component
      this.refs = {}
      const refElems = this.componentElem.querySelectorAll('[ref]')
      refElems.forEach((elem) => { this.refs[elem.getAttribute('ref')] = elem })
    }
  }

  /** Read "event" component parameters, and attach event listeners for each */
  createEvents(events) {
    Object.keys(events).forEach((eventName) => {
      this.componentElem.addEventListener(eventName, events[eventName], false)
    })
  }

  /** Read "event" component parameters, and remove event listeners for each */
  removeEvents(events) {
    Object.keys(events).forEach((eventName) => {
      this.componentElem.removeEventListener(eventName, events[eventName], false)
    })
  }

  /** Remove all events from component */
  removaAllEvents() {
    this.removeEvents(this.props);
  }

  /** Trigger a component event with the provided "detail" payload */
  triggerEvent(eventName, detail) {
    const event = new window.CustomEvent(eventName, { detail })
    this.componentElem.dispatchEvent(event)
  }

  /* Translate elements in HTML */
  translateElement(element) {

    if (element) {
      if (element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA') {
        element.placeholder = this.polyglot.t(element.placeholder.trim());
      } else if (element.tagName === 'P' ||
        element.tagName === 'BUTTON' ||
        element.tagName === 'STRONG' ||
        element.tagName === 'A' ||
        element.tagName === 'SPAN' ||
        element.tagName.startsWith("H")) {
        element.innerText = this.polyglot.t(element.innerHTML.trim());
      }
    }
  }

  /* Close active modal view in given parent container */
  closeModalPage(parent) {
    let element = parent.querySelector('.modal');
    if (element !== undefined) {
      element.classList.remove('is-active');
    }
  }

  /* Close active modal view */
  closeModal() {
    const refElems = document.querySelectorAll('.modal')
    refElems.forEach((elem) => { elem.classList.remove('is-active'); })
  }

  /* Start button to loading state */
  startLoading() {
    const eventElems = this.componentElem.querySelectorAll(`[data-loading]`)
    eventElems.forEach((element) => {
      if (element) {
        element.classList.add('is-loading');
      }
    });

  }

  /* Stop button to loading state */
  stopLoading() {
    const eventElems = this.componentElem.querySelectorAll(`[data-loading]`)
    eventElems.forEach((element) => {
      if (element) {
        element.classList.remove('is-loading');
      }
    });
  }

  /* 
   * Show modal HTML page in given parent element 
   * Also setup click events.
   */
  showModalPage(template) {

    if (template !== null) {
      this.setupTemplate(this.componentElem.id, template);
    }

    let element = this.componentElem.querySelector('.modal');
    if (element !== undefined) {
      // console.log(element);
      element.classList.add('is-active');
    }

    const eventElems = this.componentElem.querySelectorAll('[data-click-event]')
    eventElems.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        this.triggerEvent(elem.getAttribute('data-click-event'), e)
      });
    });

    if (this.onload) {
      this.onload();
    }
  }

  getValue(object) {

    let element = object;
    if (typeof object === 'string' ||
      object instanceof String) {
      element = this.componentElem.querySelector(`#${object}`);
    }

    if (element) {
      if (element.tagName === 'INPUT' ||
        element.tagName === 'TEXTAREA') {
        return element.value;
      } else if (element.tagName === 'IMG') {
        return element.src; /* Do we really need this ?, I don't know */
      } else {
        return element.innerHTML;
      }
    }
  }

  setValue(sufix, content) {
    const eventElems = this.componentElem.querySelectorAll(`[data-field-${sufix}]`)
    eventElems.forEach((element) => {
      if (element) {
        if (element.tagName === 'INPUT' ||
          element.tagName === 'TEXTAREA') {
          element.value = content;
        } else if (element.tagName === 'IMG') {
          element.src = content;
        } else {
          element.innerHTML = content;
        }
      }
    });

  }

  /* Focus element by given ID */
  focus(id) {
    let element = this.componentElem.querySelector(`#${id}`);
    if (element) {
      element.focus();
    }
  }

  /* Get element by class name */
  getElementByClassName(className) {
    let eventElems = this.componentElem.querySelectorAll(className)
    if (eventElems.length) {
      return eventElems[0];
    }
    return null;
  }

}