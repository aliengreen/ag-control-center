
import { Component } from '../../component'
import geolocation_edit from './geolocation_edit.html'
import { Map } from '../../map/map'

/**
 * GeoLocationEdit Component
 * @extends Component
 */
export class GeoLocationEdit extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, geolocation_edit);

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

    this.map = new Map('geolocationmap-placeholder', {
      options: this.options,
      events: {
        dragMarker: (e) => {
          const latlng = [e.detail.lat.toFixed(6), e.detail.lng.toFixed(6)]
          this.setLocation(latlng);
        }
      }
    });

    if (this.options !== undefined) {
      if (this.options.latlng !== undefined) {
        this.setLocation(this.options.latlng);
      }
    }

  }

  validateForm() {
    const latitude = this.getValue('user-latitude');
    const longitude = this.getValue('user-longitude');
    return [latitude, longitude];
  }

  locate(latlng, zoomLevel) {
    this.map.show(latlng, zoomLevel);
  }

  setLocation(latlng) {
    this.setValue('user-latitude', latlng[0]);
    this.setValue('user-longitude', latlng[1]);
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}