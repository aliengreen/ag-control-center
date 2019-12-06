import './details-panel.scss'
import template from './details-panel.html'
import { Component } from '../component'
import { DeviceView } from './device-view'
import JSONEditor from 'jsoneditor';
import moment from 'moment';

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

    const options = {
      mode: 'tree',
      onEditable: function (node) {
        return false;
      }
    };
    // this.editor = new JSONEditor(this.refs.jsoneditor, options);
    this.devices = new DeviceView('devices-placeholder', {
      dataset: props.dataset
    });

    // Toggle info panel on title click
    this.refs.title.addEventListener('click', () => this.refs.container.classList.toggle('info-active'))
  }

  /** Show info when a user item is selected */
  showInfo(user) {

    var clonedObj = { ...user };
    delete clonedObj.meta;
    delete clonedObj.devices;
    const devices = JSON.parse(user.devices);

    let userMeta = JSON.parse(user.meta);

    // Display title
    this.refs.title.innerHTML = `<h1 class="has-text-weight-bold">${userMeta.name}</h1>`

    this.devices.show(devices, user);
  }


}