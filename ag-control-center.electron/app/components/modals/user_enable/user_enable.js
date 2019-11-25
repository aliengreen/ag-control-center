// import './user_disable.scss'
import { Component } from '../../component'
import user_enable from './user_enable.html'


/**
 * User Disable Component
 * @extends Component
 */
export class EnableDisable extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, user_enable);

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