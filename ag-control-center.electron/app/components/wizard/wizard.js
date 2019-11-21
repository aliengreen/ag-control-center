
import { Component } from '../component'
import wizard from './wizard.html'
import { NewStep1 } from './new-step1'

/**
 * Wizard Component
 * Display create new map and open existing map files
 * @extends Component
 */
export class Wizard extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, wizard);

    this.newStep1 = new NewStep1('wizardStep1', {
      dataset: props.dataset,
      events: {
        userList: event => {
          this.triggerEvent('userList', event.detail);
        },
        closeButton: event => {
          this.triggerEvent('closeButton', event.detail);
        }
      }
    });

    this.showView(this.newStep1, null);
  }

  showView(view, htmlView) {
    this.closeModal(); /* Close prev modal */
    this.currentView = view;
    this.currentView.showModalPage(htmlView);
  }

  newMap() {
    
  }

  exMap() {
    let elem = this.componentElem.querySelector('#upload');
    elem.click();
  }

  isActive() {
    return document.querySelector('#modal-wizard').classList.contains('is-active');
  }

}