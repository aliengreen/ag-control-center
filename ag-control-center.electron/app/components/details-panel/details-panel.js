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
  async showInfo(name, id, type) {
    // Display title
    this.refs.title.innerHTML = `<h1>${name}</h1>`

    // Download and display information, based on location type
    this.refs.content.innerHTML = `
      <h3>KINGDOM</h3>
      <div>Size Estimate - ${name} km<sup>2</sup></div>
      <div>Number of Castles - ${name}</div>
      `;
  }

}