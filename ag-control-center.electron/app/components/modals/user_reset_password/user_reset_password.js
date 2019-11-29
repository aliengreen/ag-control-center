
import { Component } from '../../component'
import user_reset_password from './user_reset_password.html'


/**
 * User Reset Password Component
 * @extends Component
 */
export class UserResetPassword extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, user_reset_password);

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

    let element = this.getElementByClassName('.generate-button');
    element.addEventListener('click', (e) => {
      this.setValue('user-newpassword', this.generatePassword());
    });

  }

  /** Validate form */
  validateForm() {

    const newpassword = this.getValue('user-newpassword');
    if (newpassword.length) {
      if (!confirm(this.polyglot.t('msg.user.warn.passwordchanged', { name: this.userMeta.name }))) {
        this.setValue('user-newpassword', '');
        return null;
      } else {
        this.user.password = newpassword;
      }
    }

    return { newpassword: newpassword };
  }

  /** Generate password  */
  generatePassword() {
    let names = ['miliardi', 'veberTela', 'mxedari', 'vinari', 'kukuSa',
      'edemi', 'fuCqi', 'fizika', 'pele', 'garinCa', 'niutoni', 'sevdagul',
      'femistokle', 'armatura', 'kekluca', 'neqtari', 'lamazi',
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