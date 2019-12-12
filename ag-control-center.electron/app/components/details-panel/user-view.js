// import './user-view.scss'
import template from './user-view.html'
import { Component } from '../component'
import { Map } from '../map/map'
import _ from 'lodash';
import moment from 'moment';

/**
 * User View Component
 * @extends Component
 */
export class UserView extends Component {
  /** UserView Component Constructor
   */
  constructor(placeholderId, props) {
    super(placeholderId, props, template)

    this.map = new Map('map-placeholder');

    // this.map.show([0, 0]);
  }


  /** Show user info when a user item is selected */
  async show(user) {

    const meta = JSON.parse(user.meta);

    if (meta.geo_location) {
      this.showElement(this.refs['map-view']);
      this.hideElement(this.refs['map-footer-text']);
      this.map.show([meta.geo_location.lat, meta.geo_location.lng], 18);
      this.refs['user-geolocation-gmap-link'].href = `https://maps.google.com/?q=${meta.geo_location.lat},${meta.geo_location.lng}&z=30`;
    } else {
      this.hideElement(this.refs['map-view']);
      this.showElement(this.refs['map-footer-text']);
    }

    let user_items = '';

    user_items += `
       <div  class="media">
        <div class="media-left">
          <span class="icon is-size-2">
            <i class="fa fa-user-o"></i>
          </span>
        </div>
        <div class="media-content">
          <p class="title is-4">${user.name}</p>
          <p class="subtitle is-6"><a href="mailto:${user.email}">${user.email}</a></p>`;

    if (meta.first_name !== undefined) {
      user_items += `<ul>
            <li>${meta.first_name} ${meta.last_name} (${_.defaultTo(meta.id_number, "XXXXXXXXXXX")})</li>
            <li>${meta.street_address}</li>
            <li>${meta.address_line_2}</li>
            <li>${meta.city} ${meta.zip_code}, ${meta.region_province_state}, ${this.polyglot.t(meta.country)}</li>
            <li><a href="tel:${meta.phone_number}">${meta.phone_number}</a></li>
          </ul>`;
    }

    user_items += `</div>
      </div>`;

    // user_items += `
    // <a class="button is-small is-outlined" alt="Edit Map" data-id="${user.uuid}" data-bind-clkcb="editMap">Edit Map</a>
    // <a class="button is-small is-outlined is-hidden" alt="Edit Map" data-id="${user.uuid}" data-bind-clkcb="cancelMap">Cancel Update</a>
    // `;

    this.refs.user_items.innerHTML = user_items;
    this.translateComponent();
    this.bindCallbacks();


  }

  // editMap(e, id) {
  //   // console.log(id);
  //   const cancelupdate = e.target.nextElementSibling;

  //   if (cancelupdate.classList.contains('is-hidden')) {
  //     e.target.innerHTML = 'Update Map';
  //     e.target.nextElementSibling.classList.remove('is-hidden');
  //     this.map.editableMarker(true);
  //   } else {
  //     e.target.innerHTML = 'Edit Map';
  //     e.target.nextElementSibling.classList.add('is-hidden');
  //     this.map.editableMarker(false);
  //   }

  // }

  // cancelMap(e, id) {

  //   e.target.previousElementSibling.innerHTML = 'Edit Map';
  //   e.target.classList.add('is-hidden');
  //   this.map.show([41.739165, 44.756937], 18);
  //   this.map.editableMarker(false);
  // }
}