
import { Component } from '../../component'
import user_remove from './user_remove.html'


/**
 * User Remove Component
 * @extends Component
 */
export class UserRemove extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, user_remove);

    let elements = this.componentElem.querySelectorAll('.close-button');
    elements.forEach( (element) => {
      element.addEventListener('click', () => {
        this.removeModal();
      });
    });

  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}