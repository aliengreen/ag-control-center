import './left.scss'
import { Component } from '../component'
import View from './left.html'

/**
 * Left SideBar Component
 * @extends Component
 */
export class LeftSidebar extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, View);

    const eventElems = this.componentElem.querySelectorAll('[data-click-event]')
    eventElems.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        this.triggerEvent(elem.getAttribute('data-click-event'), e)
      });
    });

  }

  getView() {
    return View;
  }

  setActive(refName) {
    const eventElems = this.componentElem.querySelectorAll('[ref]')
    eventElems.forEach((elem) => {
      elem.classList.remove('is-active');
    });

    this.refs[refName].classList.add('is-active');
  }

}