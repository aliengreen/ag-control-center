
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
        }
      }
    });

    this._emailphone = this.getValue('user-emailphone');

    let element = this.getElementByClassName('.generate-button');
    element.addEventListener('click', (e) => {
      // this.setValue('user-newpassword', 'JimSheri');
      this.setValue('user-newpassword', this.generatePassword());
    });
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
      }
    }

    const type = this.getValue('user-accesstype');
    const newpassword = this.getValue('user-newpassword');
    if (newpassword.length) {
      if (!confirm(this.polyglot.t('msg.user.warn.passwordchanged', { name: this.userMeta.name }))) {
        this.setValue('user-newpassword', '');
        return null;
      }
    }

    this.userMeta.name = name;
    this.user.meta = JSON.stringify(this.userMeta);
    this.user.email = emailphone;
    this.user.type = type;

    if (newpassword.length) {
      this.user.password = newpassword;
    }

    return this.user;
  }


  generatePassword() {
    let names = ['miliardi',
      'veberTela',
      'mxedari',
      'vinari',
      'kukuSa',
      'edemi',
      'fuCqi',
      'fizika',
      'pele',
      'garinCa',
      'niutoni',
      'sevdagul',
      'femistokle',
      'armatura',
      'kekluca',
      'neqtari',
      'lamazi',
      'vargiso',
      'moqeife',
      'tashti',
      'cerakvi',
      'uro', 'gveleshapi', 'matori', 'ganteli', 'provokatori', 'glandi', 'gandini', 'modreka', 'kolimatori', 'zorbegi', 'zgurbli', 'betoni',
      'xandazmuli', 'buasili', 'revolveri', 'prashmadovka'];

    let lastNames = ['avgarozaSvili',
      'TerZiSvili',
      'kbilianaSvili',
      'zecaSvili',
      'zurmuxtaSvili',
      'kriWinaSvili',
      'varvariZe',
      'survilaZe',
      'SavTvaliSvili',
      'ufrosaSvili',
      'TevdorikaSvili',
      'namziTiSvili',
      'buCuxiSvili',
      'elkanaSvili',
      'sasurqinaSvili',
      'kvitini',
      'RvliRvaSvili',
      'monavardiSvili'];

    let rnd1 = Math.floor(Math.random() * Math.floor(names.length));
    let rnd2 = Math.floor(Math.random() * Math.floor(3));
    let rnd3 = Math.floor(Math.random() * Math.floor(names.length));
    let rnd4 = Math.floor(Math.random() * Math.floor(lastNames.length));
    let num = Math.floor(Math.random() * Math.floor(999));
    let num2 = Math.floor(Math.random() * Math.floor(9));
    // console.log(rnd1, rnd2, rnd3, rnd4);

    let password = `${names[rnd3].substr(0, 3)}${num}${names[rnd1]}${num2}${lastNames[rnd4].substr(rnd2, 3)}`;
    let newpassword = '';
    for (const c of password) {
      let uplow = Math.floor(Math.random() * Math.floor(10));
      if (uplow >= 5) {
        newpassword += c.toLowerCase();
      } else {
        newpassword += c.toUpperCase();
      }
    }
    // console.log(names[rnd3].substr(0, 3));
    // console.log(names[rnd1]);
    // console.log(lastNames[rnd4].substr(0, 3));
    // console.log(lastNames[rnd2]);
    return newpassword;
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}