import './details-panel.scss'
import template from './details-panel.html'
import { Component } from '../component'

/**
 * Details Panel Component
 * Download and display metadata for selected items.
 * @extends Component
 */
export class DetailsPanel extends Component {
  /** DetailsPanel Component Constructor
   * @param { Object } props.data.apiService ApiService instance to use for data fetching
   */
  constructor(placeholderId, props) {
    super(placeholderId, props, template)

    // Toggle info panel on title click
    this.refs.title.addEventListener('click', () => this.refs.container.classList.toggle('info-active'))
  }

  /** Show info when a user item is selected */
  async showInfo(user) {

    console.log(user.devices);
    let userMeta = JSON.parse(user.meta);

    // Display title
    this.refs.title.innerHTML = `<h1 class="has-text-weight-bold">${userMeta.name}</h1>`

    // Download and display information, based on location type
    this.refs.content.innerHTML = `
    <div class="tabs is-toggle is-toggle-rounded">
    <ul>
      <li class="is-active">
        <a>
          <span class="icon is-small"><i class="fa fa-image"></i></span>
          <span>Pictures</span>
        </a>
      </li>
      <li>
        <a>
          <span class="icon is-small"><i class="fa fa-music"></i></span>
          <span>Music</span>
        </a>
      </li>
      <li>
        <a>
          <span class="icon is-small"><i class="fa fa-film"></i></span>
          <span>Videos</span>
        </a>
      </li>
      <li>
        <a>
          <span class="icon is-small"><i class="fa fa-file"></i></span>
          <span>Documents</span>
        </a>
      </li>
    </ul>
  </div>

      `;
  }

}