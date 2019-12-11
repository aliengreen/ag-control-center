import './map.scss'
import L from 'leaflet'
import MG from 'mapbox-gl'
import MGL from 'mapbox-gl-leaflet'
import { Component } from '../component'
const template = '<div ref="mapContainer" class="map-container"></div>'
import pinPNG from '!!url-loader!./pin.png'


/**
 * Leaflet Map Component
 * Render map poi, and provide user interactivity.
 * @extends Component
 */
export class Map extends Component {

  /** Map Component Constructor
   * @param { String } placeholderId Element ID to inflate the map into
   * @param { Object } props.events.click Map item click listener
   */
  constructor(mapPlaceholderId, props) {
    super(mapPlaceholderId, props, template)
    this.initializeMap();
  }

  /** Initialize MAP leaflet component */
  initializeMap() {

    // Initialize Leaflet map
    this.map = L.map(this.refs.mapContainer);


    let editableMarker = false;
    let latlng = [0, 0];
    let zoomLevel = 0;

    if (this.options !== undefined) {

      if (this.options.editable !== undefined) {
        editableMarker = this.options.editable;
      }

      if (this.options.zoomLevel !== undefined) {
        zoomLevel = this.options.zoomLevel;
      }

      if (this.options.latlng !== undefined) {
        latlng = this.options.latlng;
      }
    }

    var gl = L.mapboxGL({
      attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
      accessToken: 'not-needed',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=DAS3vFae2hTT85fCcb7J'
    }).addTo(this.map);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.map);


    this.marker = L.marker(latlng, { icon: L.icon({ iconUrl: pinPNG, iconSize: [35, 42] }), draggable: editableMarker });

    this.marker.addTo(this.map);
    this.marker.on('dragend', (event) => {
      var marker = event.target;
      var position = marker.getLatLng();
      marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: editableMarker });
      this.map.panTo(new L.LatLng(position.lat, position.lng));
      this.triggerEvent('dragMarker', position);
    });


    // this.map.on('load', (e) => {
    // console.log(latlng, zoomLevel);

    setTimeout(() => {
      this.map.setView(latlng, zoomLevel);
    }, 1000);

    // this.map.panTo(new L.LatLng(latlng[0], latlng[1]));
    // });




    // .bindPopup('A pretty CSS3 popup.<br> Easily customizable.').addTo(this.map)


    // this.map.zoomControl.setPosition('bottomright');
    // this.map.setMaxZoom(3);
    // this.map.setMinZoom(-1);
  }

  show(latlng, zoomLevel) {
    // this.map.setView(latlng, zoomLevel);
    this.map.flyTo(latlng, zoomLevel, {
      animate: true,
      duration: 1.5
    });
    this.marker.setLatLng(latlng);
  }

  editableMarker(edit) {
    if (edit) {
      this.marker.dragging.enable();
    } else {
      this.marker.dragging.disable();
    }
  }

  getLatLng() {
    return this.marker.getLatLng();
  }

}