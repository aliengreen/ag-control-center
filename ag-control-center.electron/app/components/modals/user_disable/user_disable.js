// import './user_disable.scss'
import { Component } from '../../component'
import user_disable from './user_disable.html'


/**
 * USer Disable Component
 * @extends Component
 */
export class UserDisable extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, user_disable);

    let elements = this.componentElem.querySelectorAll('.close-button');
    elements.forEach( (element) => {
      element.addEventListener('click', () => {
        this.removeModal();
      });
    });

    if(props.data) {
      this.setValue('name', props.data.name);
    }
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}