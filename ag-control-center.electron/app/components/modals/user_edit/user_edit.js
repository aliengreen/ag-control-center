
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


    this.userMeta.name = name;
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