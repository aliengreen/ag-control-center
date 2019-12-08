// import './device-view.scss'
import template from './device-view.html'
import { Component } from '../component'
import moment from 'moment';
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
        attributes.diagnostics = device.data.diagnostics;
      } else if (service == 'thermostat') {
        attributes.registers.thermostat = device.data.boiler;
        attributes.registers.thermostat.last_seen_text = moment(device.data.boiler.last_seen, 'X')
          .utcOffset(parseFloat(userMeta.preferred_timezone) * 60)
          .locale(this.appInfo.locale).fromNow() + ', ' + moment(device.data.boiler.last_seen, 'X').utcOffset(parseFloat(userMeta.preferred_timezone) * 60).format('D MMM YY h:mm A');
        attributes.diagnostics = device.data.diagnostics;
      } else if (service == 'door_lock') {
        attributes.registers.door_lock = device.data.door_lock;
        attributes.registers.door_lock.last_seen_text = moment(device.data.door_lock.rtc.unix_time, 'X')
          .utcOffset(parseFloat(userMeta.preferred_timezone) * 60)
          .locale(this.appInfo.locale).fromNow() + ', ' + moment(device.data.door_lock.rtc.unix_time, 'X').utcOffset(parseFloat(userMeta.preferred_timezone) * 60).format('D MMM YY h:mm A');
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
        <div class="media-content"><p class="title is-4">${attributes.name}<span class="is-size-7 is-family-code">&nbsp;${attributes.eui64}</span>
          <a class="button is-small is-outlined" alt="Copy" data-id="${attributes.eui64}" data-bind-clkcb="copyEUI64">
          <span class="icon">
            <i class="fa fa-copy"></i>
          </span>
          </a>
        </p>`;

      for (var service_name in attributes.registers) {
        let service = attributes.registers[service_name];

        if (Array.isArray(service)) {
          service = service[0]
        }

        console.log(service);
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
        <span class="tag is-success is-size-7">${service_name}</span>&nbsp;
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

  showMore(e, id) {
    const showMore = e.target.parentElement.parentElement.nextElementSibling;
    console.log(showMore);
    if (showMore.classList.contains('is-hidden')) {
      showMore.classList.remove('is-hidden');
    } else {
      showMore.classList.add('is-hidden');
    }
    // console.log(showMore);
  }
}