import './login.scss'
import { Component } from '../component'
import View from './controller.html'
import { Login } from './login'

/**
 * Login General Component
 * Display login, error, etc.. on modal view
 * @extends Component
 */
export class LoginController extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, View);

    if (props.dataset) {
      this.connection = props.dataset.connection;
    }

    this.login = new Login('loginView', {
      dataset: props.dataset,
      events: {
        login: event => {
          this.loginAction();
        },
        closeButton: event => {
          // this.closeModal();
        }
      }
    });

    this.login.showModalPage(null);
    this.login.focus('email');
  }

  loginAction() {
    let data = this.login.validate();

    if (data !== undefined) {
      this.startLoading();
      this.connection.login(data.email, data.password).then((res, statusCode) => {
        this.stopLoading();
        this.login.closeModal();
        this.triggerEvent('login', res);
      }).catch((statusCode) => {
        alert(this.polyglot.t('Connection error')); 
        console.log(`Can't get access token, check email and password (${statusCode})`);
      });
    }
  }
}