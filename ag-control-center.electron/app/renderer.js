/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';
import './main.scss';

import { Header } from './components/header/header'
import { MapJSON } from './services/mapjson'
import { Connection } from './services/connection'
import { LeftSidebar } from './components/left/left'
import { LoginController } from './components/login/controller'
import { Users } from './components/users/users'
import { Payments } from './components/payments/payments'
import { Wizard } from './components/wizard/wizard'
import { Snackbar } from './components/snackbar/snackbar'
import template from './index.html'

import Polyglot from 'node-polyglot'

/* Language and locles imports should be here */
import enlng from './lng/en.json'
import kalng from './lng/ka.json'
import 'moment/locale/ka'; /* Georgian locale file for momentjs */

/* check if we are in electron framework */
let electron = window && window.process && window.process.type;



/** Main UI Controller Class */
class ViewController {

  /** Initialize Application */
  constructor() {

    this._appInfo = {
      title: 'AG Center',
      version: 0.1,
      api_url: 'https://admin.aliengreen.ge',
      app_url: 'https://app.aliengreen.ge',
      web_url: 'https://aliengreen.ge',
      language: kalng,
      locale: 'ka'
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    this.polyglot = new Polyglot({ phrases: this._appInfo.language });

    this._isload = false;

    if (electron) {
      console.log('We are in electron framework');
      this.initializeMainProcessMenuCmd();
    }


    if (!electron) {
      document.getElementById('app').outerHTML = template;
    }
    this.initializeComponents();

  }

  /** Initialize Components with data and event listeners */
  initializeComponents() {

    // Initialize Map JSON service
    this.mapjson = new MapJSON();


    // Initialize Snackbar
    this.snackbar = new Snackbar('snackbar-placeholder');

    // Initialize connection service
    this.connection = new Connection({
      host: this._appInfo.api_url,
      events: {
        error: event => {
          let response = event.detail;
          if (response.statusCode > 200) {
            if (response.statusCode === 401 || response.statusCode === 501) {
              alert(this.polyglot.t('The access token expired'));
              this.connection.setCookie('accessToken', '', -9999999);
              location.reload();
            } else {
              this.snackbar.show(this.polyglot.t(response.statusMessage), 'danger');
            }
          }
        },
      }
    });

    let dataset = {
      connection: this.connection,
      mapjson: this.mapjson,
      polyglot: this.polyglot,
      appInfo: this._appInfo,
      snackbar: this.snackbar
    }

    // Initialize Header
    // this.headerComponent = new Header('header-placeholder');
    // this.connection.setCookie('accessToken', '', -9999999);

    if (!this.connection.hasAccessToken()) {
      // Initialize Login component
      this.loginController = new LoginController('container-placeholder', {
        dataset: dataset,
        events: {
          login: event => {
            let response = event.detail;
            this.createWizard(dataset);
          }
        }
      });
    } else {


      this.createWizard(dataset);
    }


    this.updateAppVersion();

    /* Set changelog */
    let changeLogElem = document.querySelector('#changelog-placeholder');
    if (changeLogElem) {
      changeLogElem.innerHTML += `<h6>ვერსია 0.1</h6>`;
      changeLogElem.innerHTML += `<p>საწყისი ბეტა ვერსია</p>`;
    }

  }

  updateAppVersion() {
    /* Set app version */
    let elements = document.querySelectorAll('.app-version');
    elements.forEach((element) => {
      element.innerHTML = this._appInfo.version;
    });

    /* Set document titile */
    document.title = `${this._appInfo.title} ${this._appInfo.version}`;
  }

  createWizard(dataset) {

    this.leftSidebar = new LeftSidebar('left-placeholder', {
      dataset: dataset,
      events: {
        userList: event => {
          this.leftSidebar.setActive('userList');
          this.users = null;
          this.users = new Users('container-placeholder', {
            dataset: dataset,
            events: {

            }
          });
        },
        paymentsList: event => {
          this.leftSidebar.setActive('paymentsList');
          this.payments = null;
          this.payments = new Payments('container-placeholder', {
            dataset: dataset,
            events: {

            }
          });
        }
      }
    });

    this.wizard = new Wizard('container-placeholder', {
      dataset: dataset,
      events: {
        userList: event => {
          this.wizard.closeModal();
          this.leftSidebar.setActive('userList');
          this.users = new Users('container-placeholder', {
            dataset: dataset,
            events: {

            }
          });
        },
        paymentList: event => {
          this.wizard.closeModal();
          this.leftSidebar.setActive('paymentsList');
          this.payments = new Payments('container-placeholder', {
            dataset: dataset,
            events: {

            }
          });
        },
        closeButton: event => {
          alert('Aba ras shvebi');
        }
      }
    });
  }

  initializeMainProcessMenuCmd() {

    const { ipcRenderer } = require('electron');

    /* Open about window by catching message from main electron process */
    ipcRenderer.on('aboutWindow', (event, message) => {
      const refElems = document.querySelectorAll('.modal')
      refElems.forEach((elem) => { elem.classList.remove('is-active'); })
      document.querySelector('#legal-notice-modal').classList.add("is-active");
    })
    /* ---------------- */

    /* Create new wizard by catching message from main electron process */
    ipcRenderer.on('new', (event, message) => {
      // if (!this.wizard.isActive()) {
      location.reload();
      // }

    })
    /* ---------------- */

    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', (event, arg) => {
      ipcRenderer.removeAllListeners('app_version');
      this._appInfo.version = arg.version;
      this.updateAppVersion();
    });

    // ipcRenderer.on('update_available', () => {
    //   ipcRenderer.removeAllListeners('update_available');
    //   if (this.snackbar !== undefined) {
    //     this.snackbar.show('A new update is available. Downloading now...', 'warning');
    //   }
    // });

    // ipcRenderer.on('update_downloaded', () => {
    //   ipcRenderer.removeAllListeners('update_downloaded');
    //   if (this.snackbar !== undefined) {
    //     this.snackbar.show('Update Downloaded. It will be installed on restart. Restart now?', 'warning');
    //   }
    //   ipcRenderer.send('restart_app');
    // });

  }
}

window.ctrl = new ViewController();
