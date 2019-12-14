// import './device-view.scss'
import template from './device-view.html'
import { Component } from '../component'
import moment from 'moment';
import { GeoLocationEdit } from '../modals/geolocation_edit/geolocation_edit';

/**
 * Device View Component
 * @extends Component
 */
export class DeviceView extends Component {
  /** DeviceView Component Constructor
   */
  constructor(placeholderId, props) {
    super(placeholderId, props, template)

  }

  normalizeDeviceFields(device, user) {

    const attributes = {
      eui64: null,
      name: null,
      registers: {},
      date_added: null,
      is_master_device_offline: false,
      services: null,
      diagnostics: null
    }

    const userMeta = JSON.parse(user.meta);
    attributes.eui64 = device.device_uuid;
    attributes.name = device.data.meta.name;
    attributes.date_added = device.data.date_added;
    attributes.is_master_device_offline = device.data.offline_notified;
    attributes.services = device.data.services;

    attributes.services.forEach(service => {
      if (service == 'room_sensor') {
        attributes.registers.room_sensor = device.data.roomsensors[0];
        attributes.registers.room_sensor.last_seen_text = moment(device.data.roomsensors[0].last_seen, 'X')
          .utcOffset(parseFloat(userMeta.preferred_timezone) * 60)
          .locale(this.appInfo.locale).fromNow() + ', ' + moment(device.data.roomsensors[0].last_seen, 'X').utcOffset(parseFloat(userMeta.preferred_timezone) * 60).format('D MMM YY h:mm A');

        attributes.registers.room_sensor.last_seen = parseInt(device.data.roomsensors[0].last_seen);
        attributes.diagnostics = device.data.diagnostics;

      } else if (service == 'thermostat') {
        attributes.registers.thermostat = device.data.boiler;
        attributes.registers.thermostat.last_seen_text = moment(device.data.boiler.last_seen, 'X')
          .utcOffset(parseFloat(userMeta.preferred_timezone) * 60)
          .locale(this.appInfo.locale).fromNow() + ', ' + moment(device.data.boiler.last_seen, 'X').utcOffset(parseFloat(userMeta.preferred_timezone) * 60).format('D MMM YY h:mm A');
        attributes.registers.thermostat.last_seen = parseInt(device.data.boiler.last_seen);
        attributes.diagnostics = device.data.diagnostics;
      } else if (service == 'door_lock') {
        attributes.registers.door_lock = device.data.door_lock;
        attributes.registers.door_lock.last_seen_text = moment(device.data.door_lock.rtc.unix_time, 'X')
          .utcOffset(parseFloat(userMeta.preferred_timezone) * 60)
          .locale(this.appInfo.locale).fromNow() + ', ' + moment(device.data.door_lock.rtc.unix_time, 'X').utcOffset(parseFloat(userMeta.preferred_timezone) * 60).format('D MMM YY h:mm A');
          attributes.registers.door_lock.last_seen = parseInt(device.data.door_lock.rtc.unix_time);
          attributes.diagnostics = device.data.door_lock.attributes.diagnostics;
      } else if (service == 'water_tank') {
        console.error(`Unknown service ${service}`);
      } else {
        console.error(`Unknown service ${service}`);
      }
    });


    return attributes;
  }

  /** Show info when a user item is selected */
  async show(devices, user) {

    if (devices === null) {
      this.refs.device_items.innerHTML = '<span class="tag is-warning" data-trn>no device</span>';
      this.translateComponent();
      return;
    }

    let device_items = '';
    devices.forEach(device => {

      const attributes = this.normalizeDeviceFields(device, user);

      device_items += `
       <div  class="media">
        <div class="media-left">
          <span class="icon is-size-2">
            <i class="fa fa-hdd-o"></i>
          </span>
        </div>
        <div class="media-content"><p class="title is-4" >${attributes.name}<span class="is-size-7 is-family-code" title="Serial number" data-trn-title>&nbsp;${attributes.eui64}</span>
          <a class="button is-small is-outlined" title="Copy to Clipboard" data-trn-title data-id="${attributes.eui64}" data-bind-clkcb="copyEUI64">
          <span class="icon">
            <i class="fa fa-copy"></i>
          </span>
          </a>
          <span>&nbsp;</span>
          <a class="button is-small is-outlined" title="Show location" data-trn-title data-id="${attributes.eui64}" data-bind-clkcb="showGeoLocation">
          <span class="icon">
            <i class="fa fa-map-marker"></i>
          </span>
          </a>
        </p>`;

      for (var service_name in attributes.registers) {
        let service = attributes.registers[service_name];

        if (Array.isArray(service)) {
          service = service[0];
        }

        let tag_color = "is-success";
        /* Check if device is offline (30min max timeout to set as offline) */
        if((moment().unix() - service.last_seen) >= 1800) {
          tag_color = "is-danger";
        }

        // console.log(service);
        let tagPlug = '';
        if (service.battery_level) {
          tagPlug = `<i class="fa fa-battery"></i>&nbsp;<span class="is-size-7">${service.battery_level}%</span>`;
        } else {
          tagPlug = `<i class="fa fa-plug"></i>&nbsp;`;
        }

        let list = '';
        for (var att_name in service) {
          let att = service[att_name];
          list += `<li class="is-size-7 is-family-code">${att_name}: ${att.toString()}</li>`;
        }
        list += `<li>&nbsp;</li>`;
        device_items += `
        <span class="tag ${tag_color} is-size-7">${service_name}</span>&nbsp;
        ${tagPlug}
        <i class="fa fa-wifi"></i>&nbsp;<span class="is-size-7">${service.wifi_signal_level}%</span>
        <ul>
          <li><p class="is-size-7"><span data-trn>Registration date</span> ${moment(attributes.date_added).format('D MMM YYYY h:mm A')}</p></li>
          <li><p class="is-size-7"><span data-trn>Last seen</span> ${service.last_seen_text}</p></li>
          <li><a class="is-size-7" href="#" data-bind-clkcb="showMore" data-trn>Show more</a></li>
        </ul>
        <ul class="is-hidden">
        <li>
          <ul>
          ${list}
          </ul>
        </li>
        </ul>
        <p>&nbsp;</p>
        `
      }



      device_items += `</div>
      </div>`;
    });

    this.refs.device_items.innerHTML = device_items;
    this.bindCallbacks();
    this.translateComponent();
  }

  copyEUI64(e, id) {
    if (!navigator.clipboard) {
      this.dataset.snackbar.show(this.polyglot.t('Copy clipboard not supported by this browser'), 'danger');
      return;
    }

    navigator.clipboard.writeText(id).then(() => {
      this.dataset.snackbar.show(this.polyglot.t('Copying to clipboard was successful'), 'success');
    }, (err) => {
      this.dataset.snackbar.show(this.polyglot.t('Could not copy serial number'), 'danger');
    });

    // console.log(id);

  }

  showGeoLocation(e, id) {

    if (this.modal) {
      this.modal = null;
    }

    this.connection.getDeviceByEUI64(id).then((res, statusCode) => {
      let device = res[0];
      let meta = JSON.parse(device.meta);
      let latlng = [41.739165, 44.756937];
      let zoomLevel = 12;


      if (meta.geo_location) {
        latlng = [meta.geo_location.lat, meta.geo_location.lng];
        zoomLevel = 18;
      } else {
        if (!confirm(this.polyglot.t('msg.user.warn.nodevicelocation', { name: meta.name }))) {
          return; /* Just ignore if user selects NO */
        }
      }
      this.modal = new GeoLocationEdit('modal-placeholder', {
        dataset: this.dataset,
        options: { editable: true, latlng: latlng, zoomLevel: zoomLevel },
        data: device,
        events: {
          locationButton: event => {
            const latlng = this.modal.validateForm();
            if (latlng) {
              this.modal.locate(latlng, 18);
            }
          },
          saveButton: event => {
            let latlng = this.modal.validateForm();
            if (latlng) {
              this.modal.startLoading();

              meta.geo_location = { lat: latlng[0], lng: latlng[1] };
              device.meta = JSON.stringify(meta);

              this.connection.deviceUpdate(device).then((res, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                this.dataset.snackbar.show(this.polyglot.t('msg.device.updated', { name: meta.name }), 'success');
              }).catch((response, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                console.log(`Can't modify device (${response.statusMessage})`);
              });

              this.modal.removeModal();
            } else {
              alert(this.polyglot.t('Incorrect Latitude and Longitude'));
            }
          }
        }
      });

      this.modal.showModalPage();

    }).catch((statusCode) => {
      console.log(`Can't getDeviceByEUI64 (${statusCode})`);
    });

  }

  showMore(e, id) {
    const showMore = e.target.parentElement.parentElement.nextElementSibling;
    if (showMore.classList.contains('is-hidden')) {
      showMore.classList.remove('is-hidden');
    } else {
      showMore.classList.add('is-hidden');
    }
    // console.log(showMore);
  }
}