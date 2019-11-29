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

  show(message, type, delay) {
    const element = document.getElementById('snackbar');
    element.classList.add('show');
    element.classList.add(`is-${type}`);
    const elementBody = this.getElementByClassName('.message-body');
    elementBody.innerHTML = message;
    if(delay === undefined) {
      delay = 3000;
    }
    setTimeout(function(){element.classList.remove('show'); element.classList.remove(`is-${type}`); }, delay);
  }

}