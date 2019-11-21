import './header.scss'
import { Component } from '../component'
import header from './header.html'
import infoSVG from '!!raw-loader!./jazI.svg'

/**
 * Header Component
 * Display logo etc.. on top of the right side column
 * @extends Component
 */
export class Header extends Component {
  //<img src="${infoSVG}" width="30" height="30" alt="Info button" />

  constructor(placeholderId, props) {
    super(placeholderId, props, `${header}
      <a id="header-logo">
      <div>
      ${infoSVG}
      </div>
      </a>`);

    let headerLogoDiv = document.querySelector('#header-logo');
    headerLogoDiv.addEventListener('click', () => {
      document.querySelector('#legal-notice-modal').classList.add("is-active");
    });

    let elements = document.querySelectorAll('.close-button');
    elements.forEach(function (element) {
      element.addEventListener('click', () => {
        document.querySelector('#legal-notice-modal').classList.remove("is-active");
      });
    });

  }
}