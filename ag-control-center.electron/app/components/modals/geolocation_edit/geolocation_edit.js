
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

    let searchElem = this.getElementByClassName('.latlng-field');
    
    /** Attach enter key event to the textbox */
    searchElem.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        const latlng = this.validateForm();
        if (latlng) {
          this.locate(latlng, this.options.zoomLevel);
        }
      } else if(e.keyCode == 27) {
        this.removeModal();
      }
    });

  }

  validateForm() {
    const tmp = this.getValue('user-latitudelongitude');
    if (!tmp.indexOf(',')) {
      return null;
    }
    const latlng = tmp.split(',');
    if (latlng.length != 2) {
      return null;
    }

    return [latlng[0].trim(), latlng[1].trim()];
  }

  locate(latlng, zoomLevel) {
    this.map.show(latlng, zoomLevel);
  }

  setLocation(latlng) {
    this.setValue('user-latitudelongitude', latlng[0] + ', ' + latlng[1]);
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}