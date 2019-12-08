
import { Component } from '../../component'
import user_edit from './user_edit.html'


/**
 * User Edit Component
 * @extends Component
 */
export class UserEdit extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, user_edit);

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
      this.setValue('user-name', this.userMeta.name);
      this.setValue('user-emailphone', this.user.email);
      this.setValue('user-accesstype', this.user.type);

      if (this.userMeta.street_address !== undefined) {
        this.setValue('user-email', this.userMeta.email);
        this.setValue('user-firstname', this.userMeta.first_name);
        this.setValue('user-lastname', this.userMeta.last_name);
        this.setValue('user-phonenumber', this.userMeta.phone_number);
        this.setValue('user-streetaddress', this.userMeta.street_address);
        this.setValue('user-addressline2', this.userMeta.address_line_2);
        this.setValue('user-city', this.userMeta.city);
        this.setValue('user-regionprovincestate', this.userMeta.region_province_state);
        this.setValue('user-zipcode', this.userMeta.zip_code);
        this.setValue('user-country', this.userMeta.country);
      }
    }


    /** Attach change event */
    let selElem = this.getElementByClassName('.select-access-type');
    this._access_type = selElem.value;
    selElem.addEventListener('change', (e) => {
      const type = e.target.value;
      if (type == 'mostat_admin') {
        if (!confirm(this.polyglot.t('msg.user.warn.mostatadminselected', { name: this.userMeta.name }))) {
          selElem.value = this._access_type;
        } else {
          alert('მე გაგაფრთხილე დალშე შენ იცი');
        }
      }
    });

    this._emailphone = this.getValue('user-emailphone');

  }

  validateForm() {
    const name = this.getValue('user-name');

    if (!name.length) {
      alert(this.polyglot.t('msg.user.error.usernamecannotbeempty'));
      return null;
    }

    const emailphone = this.getValue('user-emailphone');
    if (!emailphone.length) {
      alert(this.polyglot.t('msg.user.error.emailphonecannotbeempty'));
      return null;
    }

    if (this._emailphone !== emailphone) {
      if (!confirm(this.polyglot.t('msg.user.warn.emailphonechanged', { name: this.userMeta.name }))) {
        this.setValue('user-emailphone', this._emailphone);
        return null;
      } else {
        alert('მე გაგაფრთხილე დალშე შენ იცი');
      }
    }

    const type = this.getValue('user-accesstype');

    const firstname = this.getValue('user-firstname');
    const lastname = this.getValue('user-lastname');
    const email = this.getValue('user-email');
    const phonenumber = this.getValue('user-phonenumber');
    const streetaddress = this.getValue('user-streetaddress');
    const addressline2 = this.getValue('user-addressline2');
    const city = this.getValue('user-city');
    const regionprovincestate = this.getValue('user-regionprovincestate');
    const zipcode = this.getValue('user-zipcode');
    const country = this.getValue('user-country');


    this.userMeta.name = name;
    this.userMeta.first_name = firstname;
    this.userMeta.last_name = lastname;
    this.userMeta.email = email;
    this.userMeta.phone_number = phonenumber;
    this.userMeta.street_address = streetaddress;
    this.userMeta.address_line_2 = addressline2;
    this.userMeta.city = city;
    this.userMeta.region_province_state = regionprovincestate;
    this.userMeta.zip_code = zipcode;
    this.userMeta.country = country;
    this.user.meta = JSON.stringify(this.userMeta);
    this.user.email = emailphone;
    this.user.type = type;


    return this.user;
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}