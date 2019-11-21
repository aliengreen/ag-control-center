import { Component } from '../component'
import View from './login.html'


/**
 * Login Component
 * Display login
 * @extends Component
 */
export class Login extends Component {
  constructor(placeholderId, props) {
    super(placeholderId, props, View);
    if (props.dataset) {
      this.connection = props.dataset.connection;
    }

    let searchElem = this.getElementByClassName('.password-field');
    searchElem.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        this.triggerEvent('login', e)
      }
    });

  }

  /* Validate login form */
  validate() {
    let email = this.getValue('email');
    let password = this.getValue('password');
    return { email, password };
  }

  /* Clear form */
  clearForm() {
    this.setValue('email', '');
    this.setValue('password', '');
  }
}