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

  show(message) {
    const element = document.getElementById('snackbar');
    element.classList.add('show');
    const elementBody = this.getElementByClassName('.message-body');
    elementBody.innerHTML = message;
    setTimeout(function(){element.classList.remove('show'); }, 3000);
  }

}