import './snackbar.scss'
import { Component } from '../component'
import snackbar from './snackbar.html'


/**
 * Snackbar Component
 * @extends Component
 */
export class Snackbar extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, snackbar);

  }

  show(message, type) {
    const element = document.getElementById('snackbar');
    element.classList.add('show');
    element.classList.add(`is-${type}`);
    const elementBody = this.getElementByClassName('.message-body');
    elementBody.innerHTML = message;
    setTimeout(function(){element.classList.remove('show'); element.classList.remove(`is-${type}`); }, 3000);
  }

}