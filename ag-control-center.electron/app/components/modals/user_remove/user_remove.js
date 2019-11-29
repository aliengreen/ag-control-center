
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
    elements.forEach((element) => {
      element.addEventListener('click', () => {
        this.removeModal();
      });
    });

    if (props.data) {
      this.user = props.data;
      this.userMeta = JSON.parse(props.data.meta);
      this.setValue('name', this.userMeta.name);
    }

  }

  /** Validate form */
  validateForm() {

    let value = 0;
    let elements = this.componentElem.querySelectorAll("input[name='remove-user']");
    elements.forEach((element) => {
      if (element.checked) {
        value = element.value;
      }
    });

    return { action: value };
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}